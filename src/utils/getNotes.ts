import type { ImageMetadata } from "astro";
import { getCollection } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import config from "@/config";
import { getAssetPath } from "./withBase";
import { getPostUrl } from "./getPostPaths";
import { postFilter } from "./postFilter";
import { getUniqueTags } from "./getUniqueTags";

dayjs.extend(utc);
dayjs.extend(timezone);

/** A card cover: an imported asset (posts) or a `public/` path (trips). */
export type NoteCover =
  { kind: "asset"; src: ImageMetadata } | { kind: "public"; src: string };

export type FeedNote = {
  id: string;
  kind: "post" | "trip";
  title: string;
  description?: string;
  url: string;
  /** Series name for trips; posts show the “长文” label instead. */
  series?: string;
  metaLeft?: string;
  metaRight?: string;
  /** `null` when the note has no image — the card then renders a text cover. */
  cover: NoteCover | null;
};

/**
 * Builds the note feed shown on the home page: long-form posts and trip
 * journals in one stream of text-first cards.
 *
 * Covers are full-bleed at 3:4. The trip SVGs are the closest thing this site
 * has to note images; posts use `cover`, falling back to their `ogImage`.
 *
 * Ordering: dated notes first (newest first), then undated ones keep their
 * station order — most trip journals have no `date:` yet, and inventing one
 * would be worse than showing them after the timeline. Add `date:` to a trip
 * to place it on the timeline.
 */
export async function getNotes(locale?: string): Promise<FeedNote[]> {
  const lang = locale ?? config.site.lang;
  const zh = lang.startsWith("zh");
  const [posts, trips] = await Promise.all([
    getCollection("posts"),
    getCollection("trips"),
  ]);

  const postNotes = posts.filter(postFilter).map(post => {
    const publishedAt = new Date(
      post.data.modDatetime ?? post.data.pubDatetime
    );
    const cover = post.data.cover ?? post.data.ogImage;
    const noteCover: NoteCover | null = cover
      ? typeof cover === "string"
        ? { kind: "public", src: getAssetPath(cover) }
        : { kind: "asset", src: cover }
      : null;
    const tag = post.data.tags?.[0];

    return {
      id: post.id,
      kind: "post" as const,
      title: post.data.title,
      description: post.data.description,
      url: getPostUrl(post.id, post.filePath, lang),
      metaLeft: tag ? `#${tag}` : undefined,
      metaRight: dayjs(publishedAt)
        .tz(config.site.timezone)
        .format(zh ? "M月D日" : "D MMM"),
      cover: noteCover,
      publishedAt,
      featured: post.data.featured,
    };
  });

  const tripNotes = trips
    .filter(trip => !trip.data.draft)
    .map(trip => {
      const firstImage = trip.data.images?.[0];

      return {
        id: trip.id,
        kind: "trip" as const,
        title: trip.data.title,
        description: trip.data.description,
        url: `${getRelativeLocaleUrl(lang, "trips")}${trip.id}/`,
        series: trip.data.series,
        metaLeft: [trip.data.region, trip.data.destination]
          .filter(Boolean)
          .join(" · "),
        metaRight: trip.data.station
          ? zh
            ? `第 ${trip.data.station} 站`
            : `Stop ${trip.data.station}`
          : undefined,
        cover: firstImage
          ? { kind: "public" as const, src: getAssetPath(firstImage) }
          : null,
        station: trip.data.station,
        publishedAt: trip.data.date ? new Date(trip.data.date) : undefined,
      };
    });

  const dated = [...postNotes, ...tripNotes]
    .filter(note => note.publishedAt && !isNaN(+note.publishedAt))
    .sort((a, b) => +b.publishedAt! - +a.publishedAt!);

  const undated = tripNotes
    .filter(note => !note.publishedAt)
    .sort((a, b) => {
      if (a.station === undefined && b.station === undefined) return 0;
      if (a.station === undefined) return -1; // 散记最前，与 /trips 一致
      if (b.station === undefined) return 1;
      return b.station - a.station;
    });

  return [...dated, ...undated].map(note => ({
    id: note.id,
    kind: note.kind,
    title: note.title,
    description: note.description,
    url: note.url,
    series: "series" in note ? note.series : undefined,
    metaLeft: note.metaLeft,
    metaRight: note.metaRight,
    cover: note.cover,
  }));
}

/**
 * Numbers shown in the profile header. Everything here is derived from real
 * content — there is no backend, so no likes/followers are invented.
 */
export async function getFeedStats(): Promise<{
  notes: number;
  longform: number;
  tags: number;
  words: number;
}> {
  const [posts, trips] = await Promise.all([
    getCollection("posts"),
    getCollection("trips"),
  ]);
  const visiblePosts = posts.filter(postFilter);
  const visibleTrips = trips.filter(trip => !trip.data.draft);

  const words = [...visiblePosts, ...visibleTrips].reduce(
    (total, entry) => total + (entry.body ?? "").replace(/\s+/g, "").length,
    0
  );

  const tags = new Set([
    ...getUniqueTags(visiblePosts).map(({ tag }) => tag),
    ...visibleTrips.flatMap(trip =>
      [trip.data.series, trip.data.destination, trip.data.region].filter(
        (value): value is string => Boolean(value)
      )
    ),
  ]);

  return {
    notes: visiblePosts.length + visibleTrips.length,
    longform: visiblePosts.length,
    tags: tags.size,
    words,
  };
}
