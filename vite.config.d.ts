/// <reference types="node" />
/// <reference types="vite/client" />

import { UserConfig, ConfigEnv } from 'vite';
import { IncomingMessage, ServerResponse } from 'http';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { Server as SocketIOServer } from 'socket.io';

export interface ViteServerOptions {
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
  preTransformRequests?: boolean;
  preTransformIndexHtml?: boolean;
  preTransformAssets?: boolean;
  preTransformPublicFiles?: boolean;
  preTransformSsr?: boolean;
  preTransformLegacy?: boolean;
  preTransformModern?: boolean;
}

export interface ProxyConfig {
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

export interface ViteUserConfig extends UserConfig {
  server?: ViteServerOptions;
  preview?: ViteServerOptions;
  test?: any;
}

export function defineConfig(config: ViteUserConfig): ViteUserConfig;
export function defineConfig(config: (env: ConfigEnv) => ViteUserConfig): ViteUserConfig;

declare const config: (env: ConfigEnv) => ViteUserConfig | Promise<ViteUserConfig>;

export default config;
