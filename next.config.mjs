/** @type {import('next').NextConfig} */
const isGhPages = process.env.DEPLOY_TARGET === 'gh-pages';
const repoName = 'se-labs';

const nextConfig = {
  // The portal is fully pre-rendered (no server actions, route handlers or
  // middleware), so export a plain static site. Azure Static Web Apps then
  // uploads the small `out/` folder instead of a hybrid `.next` app, which
  // avoids both the 250 MB hybrid size limit and the Oryx artifact validation
  // failure. `output: 'standalone'` must not be used here — Oryx/SWA manage the
  // build output format for hybrid apps themselves.
  output: 'export',
  images: {
    unoptimized: true,
  },
  // When building for GitHub Pages the site is served from
  // https://ibranibeny.github.io/se-labs/ (a sub-path), so assets and links
  // need to be prefixed with the repo name. Azure Static Web Apps serves from
  // the domain root, so this only applies when DEPLOY_TARGET=gh-pages.
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
