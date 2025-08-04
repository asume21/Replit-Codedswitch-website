import { defineConfig, loadEnv, type ConfigEnv, type UserConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';
import type { ServerOptions as HttpProxyOptions } from 'http-proxy';
import type { InlineConfig } from 'vite';
import type { RollupOptions, OutputOptions } from 'rollup';

// Define a more specific type for the proxy configuration
interface ProxyConfig extends HttpProxyOptions {
  target: string;
  changeOrigin: boolean;
  secure: boolean;
  ws: boolean;
  rewrite?: (path: string) => string;
  configure?: (proxy: any, options: any) => void;
  [key: string]: any;
}

interface ViteServerOptions {
  port: number;
  strictPort: boolean;
  open: boolean;
  proxy: Record<string, string | ProxyConfig>;
  fs: {
    allow: string[];
    strict?: boolean;
    cachedChecks?: boolean;
  };
  cors: boolean | {
    origin?: string | string[] | ((origin: string) => string | undefined | null);
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
  };
  hmr: boolean | {
    protocol?: string;
    host?: string;
    port?: number;
    path?: string;
    timeout?: number;
    overlay?: boolean;
    clientPort?: number;
    server?: any;
  };
  watch: {
    usePolling?: boolean;
    interval?: number;
    binaryInterval?: number;
    useFsEvents?: boolean;
    disableGlobbing?: boolean;
  };
  host?: string | boolean;
  https?: boolean | { key: Buffer | string; cert: Buffer | string };
  headers?: Record<string, string>;
  logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
  clearScreen?: boolean;
  base?: string;
  public?: string;
  logHttpRequests?: boolean;
  proxyBypass?: (req: any, res: any, proxyOptions: any) => boolean | void;
}

// Extend the Vite UserConfig type with our custom options
interface ViteUserConfig extends UserConfig {
  server?: ViteServerOptions;
  preview?: {
    port: number;
    open: boolean;
    cors: boolean | { origin: string | string[] };
    headers: Record<string, string>;
    proxy: Record<string, string | ProxyConfig>;
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): ViteUserConfig => {
  // Load environment variables based on the current mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');
  
  // Configure plugins
  const plugins: (PluginOption | false | undefined)[] = [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ];

  // Add visualizer only in development
  if (mode === 'development') {
    plugins.push(
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }) as PluginOption
    );
  }

  // Server configuration
  const server: ViteServerOptions = {
    port: parseInt(env.PORT || '3000', 10),
    strictPort: true,
    open: true,
    proxy: {
      '^/api/.*': {
        target: env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
        configure: (proxy: any, _options: any) => {
          proxy.on('error', (err: Error, _req: any, _res: any) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq: any, req: any, _res: any) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes: any, req: any, _res: any) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
    },
    fs: {
      // Allow serving files from one level up from the package root
      allow: ['..'],
      strict: true,
      cachedChecks: true
    },
    cors: {
      origin: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true
    },
    hmr: {
      overlay: true,
      clientPort: 3000,
      protocol: 'ws',
      host: 'localhost',
      port: 3000
    },
    watch: {
      usePolling: true,
      interval: 100,
      binaryInterval: 300
    },
    host: '0.0.0.0',
    logLevel: 'info',
    clearScreen: true,
    base: '/',
    public: '/public',
    logHttpRequests: true
  };

  return {
    plugins: plugins.filter(Boolean) as PluginOption[],
    
    // Base public path when served in development or production
    base: mode === 'production' ? '/dist/' : '/',

    // Resolve configuration
    resolve: {
      alias: [
        { find: '@', replacement: resolve(__dirname, 'src') },
        { find: '@shared', replacement: resolve(__dirname, 'shared') },
        { find: '@components', replacement: resolve(__dirname, 'src/components') },
        { find: '@pages', replacement: resolve(__dirname, 'src/pages') },
        { find: '@hooks', replacement: resolve(__dirname, 'src/hooks') },
        { find: '@utils', replacement: resolve(__dirname, 'src/utils') },
        { find: '@assets', replacement: resolve(__dirname, 'src/assets') },
      ],
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
    },

    // Build configuration
    build: {
      outDir: 'dist/client',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'esbuild' : false,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            emotion: ['@emotion/react', '@emotion/styled'],
            vendor: ['lodash', 'axios', 'date-fns'],
          },
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
        },
        onwarn(warning, warn) {
          // Suppress certain warnings
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return;
          }
          warn(warning);
        },
      },
      chunkSizeWarningLimit: 1600,
      target: 'es2020',
      cssTarget: 'chrome80',
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    server,
    preview: {
      port: 3000,
      open: true,
      cors: true,
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
      proxy: {
        '^/api/.*': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(env.NODE_ENV || 'development'),
      __APP_VERSION__: JSON.stringify(env.npm_package_version || '0.0.0'),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: mode === 'development' 
          ? '[name]__[local]--[hash:base64:5]' 
          : '[hash:base64:8]',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:math";
            @import "@/styles/variables";
            @import "@/styles/mixins";
          `,
        },
      },
      postcss: {
        plugins: [
          require('autoprefixer'),
          require('postcss-preset-env')({
            stage: 3,
            features: {
              'nesting-rules': true,
            },
          }),
        ],
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@emotion/react',
        '@emotion/styled',
        'axios',
      ],
      exclude: ['@babel/runtime/helpers/esm/'],
      esbuildOptions: {
        target: 'es2020',
        supported: {
          bigint: true,
        },
        define: {
          global: 'globalThis',
        },
      },
    },
    worker: {
      format: 'es',
      plugins: [],
    },
    json: {
      namedExports: true,
      stringify: true,
    },
    clearScreen: true,
    logLevel: 'info',
    envPrefix: 'VITE_',
    envDir: __dirname,
    base: '/',
    publicDir: 'public',
    cacheDir: 'node_modules/.vite',
  };
});
