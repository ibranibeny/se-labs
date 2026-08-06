/** @type {import('next').NextConfig} */
const isGhPages = process.env.DEPLOY_TARGET === 'gh-pages';
const repoName = 'se-labs';

const nextConfig = {
  // The portal is fully pre-rendered (no server actions, route handlers or
  // middleware), so export a plain static site into `out/` that GitHub Pages
  // serves directly.
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages serves the site from https://ibranibeny.github.io/se-labs/
  // (a sub-path), so assets and links need the repo-name prefix. Local dev and
  // `next start` serve from the domain root, so this only applies when the
  // Pages build sets DEPLOY_TARGET=gh-pages.
  ...(isGhPages && {
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
  }),
  // A stray lockfile in the home dir makes Next mis-infer the workspace root.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
