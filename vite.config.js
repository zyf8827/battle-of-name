import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    base: '/battle-of-name/', // GitHub Pages repository name
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
});
