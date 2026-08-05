/** @type {import('next').NextConfig} */
const nextConfig = {
  // No `output` override: Azure Static Web Apps' hybrid Next.js support relies on
  // Oryx managing the build output format itself, so it must not be forced here.
  // A stray lockfile in the home dir makes Next mis-infer the workspace root.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
