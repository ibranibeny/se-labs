/** @type {import('next').NextConfig} */
const nextConfig = {
  // Every route in this app is fully static (prerendered at build time via
  // generateStaticParams / static pages) — there's no SSR, middleware, API
  // routes, or ISR anywhere in the app. Azure Static Web Apps' Next.js
  // "hybrid" mode (output: 'standalone', built in-place by Oryx) is still in
  // preview and fails with an opaque "An unknown exception has occurred"
  // for this app. Since we don't need any hybrid/server features, use plain
  // static HTML export instead, which Azure SWA deploys as a regular static
  // site and is fully supported/stable.
  output: 'export',
  // Don't auto-generate AGENTS.md / CLAUDE.md — this repo has its own conventions.
  agentRules: false,
  // A stray lockfile in the home dir makes Next mis-infer the workspace root.
  turbopack: {
    root: import.meta.dirname,
  },
  // TypeScript 7 (native compiler) exposes only the CLI, not the compiler API
  // Next uses for its build-time type check.
  experimental: {
    useTypeScriptCli: true,
  },
};

export default nextConfig;
