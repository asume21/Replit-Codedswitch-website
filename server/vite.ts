import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import type { ViteDevServer, InlineConfig } from 'vite';
import { createServer as createViteServer } from 'vite';
import { type Server } from "http";
import { nanoid } from "nanoid";

// Simple logger implementation
interface ViteLogger {
  info: (msg: string, options?: any) => void;
  warn: (msg: string, options?: any) => void;
  warnOnce: (msg: string, options?: any) => void;
  error: (msg: string, options?: any) => void;
  clearScreen: () => void;
  hasErrorLogged: (error: Error | string) => boolean;
  hasWarned: boolean;
}

const viteLogger: ViteLogger = {
  info: (msg: string, options?: any) => console.log(`[vite] ${msg}`, options || ''),
  warn: (msg: string, options?: any) => console.warn(`[vite] ${msg}`, options || ''),
  warnOnce: (msg: string, options?: any) => console.warn(`[vite] ${msg}`, options || ''),
  error: (msg: string, options?: any) => console.error(`[vite] ${msg}`, options || ''),
  clearScreen: () => {},
  hasErrorLogged: (error: Error | string) => false,
  hasWarned: false
};

// Vite configuration will be loaded dynamically when needed

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  try {
    // Create Vite server with proper configuration
    const viteConfig: InlineConfig = {
      configFile: false, // Don't use a config file, we'll configure everything here
      root: path.resolve(import.meta.dirname, '..'), // Set root to project root
      server: { 
        middlewareMode: true,
        hmr: { server },
        allowedHosts: true as const,
      },
      appType: 'custom' as const,
      logLevel: 'info',
      clearScreen: false,
      // Add any additional Vite config overrides here if needed
      plugins: [
        // Add any required plugins here
      ],
      resolve: {
        alias: {
          // Add any required aliases here
        }
      }
    };

    const vite = await createViteServer(viteConfig);

    // Use Vite's middleware
    if (!vite.middlewares) {
      throw new Error('Vite middleware is not available');
    }

    app.use(vite.middlewares);
    
    // Handle all other requests with the index.html file
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;

      try {
        const clientTemplate = path.resolve(
          import.meta.dirname,
          "..",
          "client",
          "index.html"
        );

        // Always reload the index.html file in case it changes
        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        
        // Add cache-busting query parameter to the main script
        template = template.replace(
          `src="/src/main.tsx"`,
          `src="/src/main.tsx?v=${nanoid()}"`
        );
        
        // Transform the HTML using Vite
        const page = await vite.transformIndexHtml(url, template);
        
        // Send the transformed HTML to the client
        res.status(200).set({ "Content-Type": "text/html" }).end(page);
      } catch (e) {
        const error = e as Error;
        vite.ssrFixStacktrace(error);
        viteLogger.error('Error processing request:', error);
        next(error);
      }
    });
    
    return vite;
  } catch (error) {
    viteLogger.error('Failed to set up Vite:', error);
    throw error; // Re-throw to allow the application to handle the error
  }
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
