/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output keeps the deployed bundle small enough for the Azure
  // Static Web Apps hybrid Next.js 250 MB limit.
  output: 'standalone',
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
