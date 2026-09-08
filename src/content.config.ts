import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

/** 旅行游记（朋友圈式短篇） */
const trips = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/trips" }),
  schema: z.object({
    title: z.string(),
    series: z.string().optional(), // 系列：环球旅行 / 平行宇宙 …
    station: z.number().optional(), // 第 N 站
    destination: z.string().optional(), // 城市
    region: z.string().optional(), // 省 / 国
    date: z.coerce.date().optional(), // 到访日期（可选，展示用）
    coords: z.object({ lat: z.number(), lng: z.number() }).optional(), // 足迹地图用
    images: z.array(z.string()).optional(), // 图集（public 下路径，朋友圈九宫格）
    description: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { posts, pages, trips };
