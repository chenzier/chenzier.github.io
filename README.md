# chenzier.github.io

个人博客源码 —— **说唱、旅行、读书，以及开发程序**。

- 线上地址：<https://chenzier.github.io>
- 文章写在 `src/content/posts/`（Markdown / MDX），游记图片放在 `public/trips/`
- 主题基于 [AstroPaper](https://github.com/satnaing/astro-paper)，在此基础上重做了目录栏、游记「朋友圈」视图、搜索页与中文排版

## 本地开发

```bash
pnpm install
pnpm dev            # http://localhost:4321
pnpm build          # astro check + astro build + pagefind 索引
```

推送到 `main` 后由 `.github/workflows/deploy.yml` 自动构建并发布到 GitHub Pages。
