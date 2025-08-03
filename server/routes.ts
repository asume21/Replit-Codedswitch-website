import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  translateCode,
  generateLyrics,
  analyzeLyrics,
  generateBeatPattern,
  codeToMusic,
  getAIAssistance
} from "./openai";
import {
  insertUserSchema,
  insertProjectSchema,
  insertCodeTranslationSchema,
  insertMusicGenerationSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ 
        message: "Failed to create user", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch user", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Code translation routes
  app.post("/api/code/translate", async (req, res) => {
    try {
      const schema = z.object({
        sourceCode: z.string().min(1),
        sourceLanguage: z.string().min(1),
        targetLanguage: z.string().min(1),
        userId: z.string().optional()
      });

      const { sourceCode, sourceLanguage, targetLanguage, userId } = schema.parse(req.body);
      
      const result = await translateCode(sourceCode, sourceLanguage, targetLanguage);
      
      // Save translation if user is provided
      if (userId) {
        const translation = await storage.createCodeTranslation({
          userId,
          sourceLanguage,
          targetLanguage,
          sourceCode,
          translatedCode: result.translatedCode
        });
        res.json({ ...result, id: translation.id });
      } else {
        res.json(result);
      }
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to translate code", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/users/:userId/translations", async (req, res) => {
    try {
      const translations = await storage.getUserCodeTranslations(req.params.userId);
      res.json(translations);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch translations", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Lyrics routes
  app.post("/api/lyrics/generate", async (req, res) => {
    try {
      const schema = z.object({
        prompt: z.string().min(1),
        genre: z.string().optional(),
        mood: z.string().optional(),
        userId: z.string().optional()
      });

      const { prompt, genre, mood, userId } = schema.parse(req.body);
      
      const result = await generateLyrics(prompt, genre, mood);
      
      // Save generation if user is provided
      if (userId) {
        const generation = await storage.createMusicGeneration({
          userId,
          type: "lyrics",
          prompt,
          result
        });
        res.json({ ...result, id: generation.id });
      } else {
        res.json(result);
      }
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to generate lyrics", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.post("/api/lyrics/analyze", async (req, res) => {
    try {
      const schema = z.object({
        lyrics: z.string().min(1)
      });

      const { lyrics } = schema.parse(req.body);
      const result = await analyzeLyrics(lyrics);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to analyze lyrics", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Beat generation routes
  app.post("/api/beat/generate", async (req, res) => {
    try {
      const schema = z.object({
        genre: z.string().min(1),
        bpm: z.number().min(60).max(200),
        duration: z.number().min(1).max(300),
        userId: z.string().optional()
      });

      const { genre, bpm, duration, userId } = schema.parse(req.body);
      
      const result = await generateBeatPattern(genre, bpm, duration);
      
      // Save generation if user is provided
      if (userId) {
        const generation = await storage.createMusicGeneration({
          userId,
          type: "beat",
          prompt: `${genre} beat at ${bpm} BPM`,
          result
        });
        res.json({ ...result, id: generation.id });
      } else {
        res.json(result);
      }
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to generate beat", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // CodeBeat fusion routes
  app.post("/api/codebeat/convert", async (req, res) => {
    try {
      const schema = z.object({
        code: z.string().min(1),
        language: z.string().min(1),
        userId: z.string().optional()
      });

      const { code, language, userId } = schema.parse(req.body);
      
      const result = await codeToMusic(code, language);
      
      // Save generation if user is provided
      if (userId) {
        const generation = await storage.createMusicGeneration({
          userId,
          type: "codebeat",
          prompt: `Convert ${language} code to music`,
          result
        });
        res.json({ ...result, id: generation.id });
      } else {
        res.json(result);
      }
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to convert code to music", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // AI Assistant routes
  app.post("/api/ai/assist", async (req, res) => {
    try {
      const schema = z.object({
        question: z.string().min(1),
        context: z.string().optional()
      });

      const { question, context } = schema.parse(req.body);
      const result = await getAIAssistance(question, context);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to get AI assistance", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Project routes
  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ 
        message: "Failed to create project", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/users/:userId/projects", async (req, res) => {
    try {
      const projects = await storage.getUserProjects(req.params.userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch projects", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/users/:userId/music-generations", async (req, res) => {
    try {
      const generations = await storage.getUserMusicGenerations(req.params.userId);
      res.json(generations);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch music generations", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
