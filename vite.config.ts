import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Base path matches the GitHub Pages project site (https://<user>.github.io/se-labs/).
// Change this if the repository is renamed.
export default defineConfig({
  base: '/se-labs/',
  plugins: [react(), tailwindcss()],
});
