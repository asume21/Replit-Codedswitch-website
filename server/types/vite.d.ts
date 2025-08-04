/// <reference types="vite/client" />

declare module 'vite' {
  import { UserConfig, ConfigEnv } from 'vite';
  import { ViteUserConfig } from '../../vite.config';
  
  export * from 'vite';
  
  export function defineConfig(config: (env: ConfigEnv) => ViteUserConfig): ViteUserConfig;
  export function defineConfig(config: ViteUserConfig): ViteUserConfig;
  export function loadEnv(
    mode: string,
    root: string,
    prefix?: string
  ): Record<string, string>;
}
