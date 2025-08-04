import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  // Base configuration
  const config = {
    root: 'client',
    base: '/',
    publicDir: resolve(__dirname, 'public'),
    
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
    ],

    // Development server configuration
    server: {
      port: parseInt(env.PORT || '3000', 10),
      strictPort: true,
      open: false,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      fs: {
        allow: ['..'],
      },
    },

    // Build configuration
    build: {
      outDir: '../dist/client',
      emptyOutDir: true,
      target: 'es2020',
      cssTarget: 'chrome80',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'esbuild' : false,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'client/index.html'),
        },
      },
    },

    // CSS configuration
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          postcssPresetEnv({
            stage: 3,
            features: {
              'nesting-rules': true,
            },
          }),
        ],
      },
    },
  };

  // Add visualizer in development
  if (mode === 'development') {
    config.plugins.push(
      visualizer({
        open: true,
        filename: 'bundle-analysis.html',
        gzipSize: true,
        brotliSize: true,
      })
    );
  }

  return config;
});
