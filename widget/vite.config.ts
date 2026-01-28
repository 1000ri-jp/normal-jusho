import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/jusho-widget.ts'),
      name: 'Jusho',
      formats: ['umd'],
      fileName: () => 'jusho-widget.min.js',
    },
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
  },
});
