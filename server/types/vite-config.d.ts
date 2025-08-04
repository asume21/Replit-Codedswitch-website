/// <reference types="node" />
/// <reference types="vite/client" />

import { UserConfig, ConfigEnv } from 'vite';
import { IncomingMessage, ServerResponse } from 'http';

declare module 'vite' {
  interface ViteUserConfig extends UserConfig {
    server?: ViteServerOptions;
    preview?: ViteServerOptions;
    test?: any;
  }

  interface ViteServerOptions {
    port?: number;
    host?: string | boolean;
    https?: boolean | { key: Buffer; cert: Buffer };
    open?: boolean | string;
    proxy?: Record<string, string | ProxyConfig>;
    cors?: boolean | CorsOptions;
    strictPort?: boolean;
    hmr?: boolean | HmrOptions;
    fs?: FileSystemOptions;
    watch?: WatchOptions;
    middleware?: (req: IncomingMessage, res: ServerResponse, next: () => void) => void;
  }

  interface ProxyConfig {
    target: string;
    changeOrigin?: boolean;
    secure?: boolean;
    ws?: boolean;
    rewrite?: (path: string) => string;
    configure?: (proxy: any, options: any) => void;
    events?: {
      error?: (err: Error, req: any, res: any) => void;
      proxyReq?: (proxyReq: any, req: any, res: any) => void;
      proxyRes?: (proxyRes: any, req: any, res: any) => void;
    };
  }

  interface CorsOptions {
    origin?: string | boolean | string[] | RegExp | ((origin: string) => boolean);
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
  }

  interface HmrOptions {
    protocol?: string;
    host?: string;
    port?: number;
    clientPort?: number;
    path?: string;
    timeout?: number;
    overlay?: boolean;
    server?: any;
  }

  interface FileSystemOptions {
    strict?: boolean;
    allow?: string[];
    deny?: string[];
  }

  interface WatchOptions {
    ignored?: string | RegExp | (string | RegExp)[];
    ignoreInitial?: boolean;
    followSymlinks?: boolean;
    disableGlobbing?: boolean;
    usePolling?: boolean | number;
    interval?: number;
    binaryInterval?: number;
    alwaysStat?: boolean;
    depth?: number;
    awaitWriteFinish?: boolean | {
      stabilityThreshold?: number;
      pollInterval?: number;
    };
    ignorePermissionErrors?: boolean;
    atomic?: boolean | number;
  }
}

export {};
