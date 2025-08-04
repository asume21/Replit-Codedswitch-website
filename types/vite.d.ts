// This file provides type declarations for Vite that aren't properly exported
// from the main Vite package

declare module 'vite' {
  // Extend the existing ViteDevServer interface
  interface ViteDevServer {
    /**
     * The resolved vite config object
     */
    config: any;
    
    /**
     * A connect app instance.
     * - Can be used to attach custom middlewares to the dev server.
     * - Can also be used as the handler parameter of a custom http server
     *   or as a middleware in any connect-style Node.js frameworks
     */
    middlewares: Connect.Server;
    
    /**
     * The resolved urls Vite prints on the CLI. null in middleware mode or
     * before the server is listening.
     */
    resolvedUrls: { local: string[]; network: string[]; } | null;
    
    /**
     * The resolved vite config object
     */
    httpServer: HttpServer | HttpsServer | null;
    
    /**
     * Start the server
     */
    listen(port?: number, isHttps?: boolean): Promise<ViteDevServer>;
    
    /**
     * Stop the server
     */
    close(): Promise<void>;
    
    /**
     * The resolved vite config object
     */
    printUrls(): void;
    
    /**
     * Load a URL for the server's web browser. Returns false if the URL was handled by a plugin
     * and shouldn't be loaded by the browser.
     */
    openBrowser(url: string, openInEditor?: boolean): Promise<boolean>;
    
    /**
     * Apply vite internal middlewares
     */
    applyMiddleware(
      req: IncomingMessage,
      res: ServerResponse,
      next: (err?: any) => void
    ): void;
    
    /**
     * Transform the index.html
     */
    transformIndexHtml(
      url: string,
      html: string,
      originalUrl?: string
    ): Promise<string>;
    
    /**
     * Fix the stack trace of an error
     */
    ssrFixStacktrace(e: Error): void;
  }

  // Define a simpler logger interface
  interface Logger {
    info(msg: string, options?: any): void;
    warn(msg: string, options?: any): void;
    warnOnce(msg: string, options?: any): void;
    error(msg: string, options?: any): void;
    clearScreen(type: 'error' | 'warn' | 'info' | 'success'): void;
    hasErrorLogged(error: Error | string): boolean;
    hasWarned: boolean;
  }

  // Define the Vite config interface
  interface InlineConfig {
    root?: string;
    base?: string;
    mode?: string;
    configFile?: string | false;
    logLevel?: 'info' | 'warn' | 'error' | 'silent';
    clearScreen?: boolean;
    server?: any;
    plugins?: any[];
    resolve?: {
      alias?: Record<string, string>;
      extensions?: string[];
      [key: string]: any;
    };
    build?: any;
    preview?: any;
    optimizeDeps?: any;
    css?: any;
    json?: any;
    esbuild?: any;
    define?: Record<string, any>;
    [key: string]: any;
  }

  // Export the types
  export function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>;
  export function createLogger(level?: 'info' | 'warn' | 'error' | 'silent'): Logger;
  export function defineConfig(config: InlineConfig): InlineConfig;
  export function loadEnv(mode: string, root: string, prefix?: string): Record<string, string>;
  
  // Export other Vite types that might be needed
  export * from 'vite/types';
}

// Global type declarations
declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}

declare module '*.sass' {
  const content: string;
  export default content;
}

declare module '*.less' {
  const content: string;
  export default content;
}

declare module '*.styl' {
  const content: string;
  export default content;
}

declare module '*.stylus' {
  const content: string;
  export default content;
}

declare module '*.pcss' {
  const content: string;
  export default content;
}

declare module '*.sss' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

declare module '*.bmp' {
  const content: string;
  export default content;
}

declare module '*.woff' {
  const content: string;
  export default content;
}

declare module '*.woff2' {
  const content: string;
  export default content;
}

declare module '*.ttf' {
  const content: string;
  export default content;
}

declare module '*.eot' {
  const content: string;
  export default content;
}

declare module '*.otf' {
  const content: string;
  export default content;
}

declare module '*.mp4' {
  const content: string;
  export default content;
}

declare module '*.webm' {
  const content: string;
  export default content;
}

declare module '*.ogg' {
  const content: string;
  export default content;
}

declare module '*.mp3' {
  const content: string;
  export default content;
}

declare module '*.wav' {
  const content: string;
  export default content;
}

declare module '*.flac' {
  const content: string;
  export default content;
}

declare module '*.aac' {
  const content: string;
  export default content;
}

declare module '*.opus' {
  const content: string;
  export default content;
}

declare module '*.wasm' {
  const content: string;
  export default content;
}

declare module '*.webmanifest' {
  const content: string;
  export default content;
}

declare module '*.pdf' {
  const content: string;
  export default content;
}

declare module '*.txt' {
  const content: string;
  export default content;
}

declare module '*.md' {
  const content: string;
  export default content;
}

declare module '*.mdx' {
  const content: string;
  export default content;
}

declare module '*.csv' {
  const content: string;
  export default content;
}

declare module '*.xml' {
  const content: string;
  export default content;
}

declare module '*.yaml' {
  const content: string;
  export default content;
}

declare module '*.yml' {
  const content: string;
  export default content;
}

declare module '*.toml' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}

declare module '*.json5' {
  const content: any;
  export default content;
}

declare module '*.graphql' {
  const content: string;
  export default content;
}

declare module '*.gql' {
  const content: string;
  export default content;
}

declare module '*.glsl' {
  const content: string;
  export default content;
}

declare module '*.vert' {
  const content: string;
  export default content;
}

declare module '*.frag' {
  const content: string;
  export default content;
}

declare module '*.vs' {
  const content: string;
  export default content;
}

declare module '*.fs' {
  const content: string;
  export default content;
}

// This allows us to import from 'vite' and get our extended types
export {};
