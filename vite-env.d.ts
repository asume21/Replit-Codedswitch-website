/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Vite built-in environment variables
  readonly VITE_API_URL: string;
  
  // Custom environment variables
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  
  // API Keys (if any)
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  
  // Feature flags
  readonly VITE_ENABLE_ANALYTICS: 'true' | 'false';
  
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type CSSModuleClasses = { readonly [key: string]: string };

declare module '*.module.css' {
  const classes: CSSModuleClasses;
  export default classes;
  export = classes;
}

declare module '*.module.scss' {
  const classes: CSSModuleClasses;
  export default classes;
  export = classes;
}

declare module '*.module.sass' {
  const classes: CSSModuleClasses;
  export default classes;
  export = classes;
}

declare module '*.module.less' {
  const classes: CSSModuleClasses;
  export default classes;
  export = classes;
}

declare module '*.module.styl' {
  const classes: CSSModuleClasses;
  export default classes;
  export = classes;
}

type ImageSrc = string;

declare module '*.png' {
  const src: ImageSrc;
  export default src;
}

declare module '*.jpg' {
  const src: ImageSrc;
  export default src;
}

declare module '*.jpeg' {
  const src: ImageSrc;
  export default src;
}

declare module '*.gif' {
  const src: ImageSrc;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';
  
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: ImageSrc;
  export default src;
}

declare module '*.webp' {
  const src: ImageSrc;
  export default src;
}

declare module '*.avif' {
  const src: ImageSrc;
  export default src;
}

declare module '*.ico' {
  const src: ImageSrc;
  export default src;
}

declare module '*.bmp' {
  const src: ImageSrc;
  export default src;
}

// For Vite config
declare module 'vite' {
  interface UserConfig {
    test?: {
      globals?: boolean;
      environment?: string;
      setupFiles?: string[];
      include?: string[];
      exclude?: string[];
      coverage?: {
        reporter?: string[];
      };
    };
  }
}

// For Vite config
declare module 'vite' {
  import { UserConfig } from 'vite';
  export function defineConfig(config: UserConfig): UserConfig;
  export function createServer(options?: ServerOptions): Promise<ViteDevServer>;
}
