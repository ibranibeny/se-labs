/** @type {import('next').NextConfig} */
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
  // A stray lockfile in the home dir makes Next mis-infer the workspace root.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
