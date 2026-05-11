# Deployment

This handbook deploys as a static Next.js export to GitHub Pages.

## GitHub Pages source

In the repository settings, set:

- Pages source: `GitHub Actions`
- Environment: `github-pages`

The workflow at `.github/workflows/handbook-pages.yml` validates pull requests and deploys pushes to `main`.

## Local checks

```bash
npm run lint
npm run typecheck
npm run build
```

## GitHub Pages static build

The workflow sets `GITHUB_PAGES=true`, which makes `next.config.mjs` use:

- `output: "export"`
- repository-aware `basePath`
- repository-aware `assetPrefix`
- `trailingSlash`
- unoptimized images for static hosting

For this repository, the expected project Pages URL is:

```txt
https://karimtismail.github.io/summary/
```
