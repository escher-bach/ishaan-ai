import { type Express, Router, Request, Response } from "express";
import { storage } from "./storage";
import {
  summarizeText,
  simplifyText,
  translateText,
  correctGrammar,
  getChatResponse,
  getSuggestedResponses,
} from "./groq";

export async function registerRoutes(app: Express): Promise<Express> {
  const router = Router();

  router.post("/summarize", async (req: Request, res: Response): Promise<void> => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        res.status(400).json({ message: "Text is required and must be a string" });
        return;
      }
      const summary = await summarizeText(text);
      res.json({ summary });
    } catch (error) {
      console.error("Error summarizing text:", error);
      res.status(500).json({
        message: "Error processing text summarization",
        error: (error as Error).message,
      });
    }
  });

  router.post("/simplify", async (req: Request, res: Response): Promise<void> => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        res.status(400).json({ message: "Text is required and must be a string" });
        return;
      }
      const simplifiedText = await simplifyText(text);
      res.json({ simplifiedText });
    } catch (error) {
      console.error("Error simplifying text:", error);
      res.status(500).json({
        message: "Error processing text simplification",
        error: (error as Error).message,
      });
    }
  });

  router.post("/correct-grammar", async (req: Request, res: Response): Promise<void> => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        res.status(400).json({ message: "Text is required and must be a string" });
        return;
      }
      const correctedText = await correctGrammar(text);
      res.json({ correctedText });
    } catch (error) {
      console.error("Error correcting grammar:", error);
      res.status(500).json({
        message: "Error processing grammar correction",
        error: (error as Error).message,
      });
    }
  });

  router.post("/translate", async (req: Request, res: Response): Promise<void> => {
    try {
      const { text, sourceLanguage, targetLanguage } = req.body;
      if (!text || typeof text !== "string") {
        res.status(400).json({ message: "Text is required and must be a string" });
        return;
      }
      if (!targetLanguage) {
        res.status(400).json({ message: "Target language is required" });
        return;
      }
      const translatedText = await translateText(text, sourceLanguage, targetLanguage);
      res.json({ translatedText });
    } catch (error) {
      console.error("Error translating text:", error);
      res.status(500).json({
        message: "Error processing translation",
        error: (error as Error).message,
      });
    }
  });

  router.post("/chat", async (req: Request, res: Response): Promise<void> => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== "string") {
        res.status(400).json({ message: "Message is required and must be a string" });
        return;
      }
      const response = await getChatResponse(message);
      res.json({ response });
    } catch (error) {
      console.error("Error getting chat response:", error);
      res.status(500).json({
        message: "Error processing chat response",
        error: (error as Error).message,
      });
    }
  });

  router.post("/suggested-responses", async (req: Request, res: Response): Promise<void> => {
    try {
      const { context } = req.body;
      if (!context || typeof context !== "string") {
        res.status(400).json({ message: "Context is required and must be a string" });
        return;
      }
      const suggestions = await getSuggestedResponses(context);
      res.json({ suggestions });
    } catch (error) {
      console.error("Error getting suggested responses:", error);
      res.status(500).json({
        message: "Error processing suggested responses",
        error: (error as Error).message,
      });
    }
  });

  router.post("/preferences", async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, ...preferences } = req.body;
      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
      const userPrefs = await storage.saveUserPreferences(userId, preferences);
      res.json(userPrefs);
    } catch (error) {
      console.error("Error saving user preferences:", error);
      res.status(500).json({
        message: "Error saving user preferences",
        error: (error as Error).message,
      });
    }
  });

  router.get("/preferences/:userId", async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
      const preferences = await storage.getUserPreferences(userId);
      if (!preferences) {
        res.status(404).json({ message: "User preferences not found" });
        return;
      }
      res.json(preferences);
    } catch (error) {
      console.error("Error getting user preferences:", error);
      res.status(500).json({
        message: "Error getting user preferences",
        error: (error as Error).message,
      });
    }
  });

  router.get("/test-groq", async (_req: Request, res: Response): Promise<void> => {
    try {
      const testResult = await summarizeText(
        "Hello, this is a test to check if GROQ is working properly. The quick brown fox jumps over the lazy dog.",
      );
      res.json({
        success: true,
        message: "GROQ integration is working",
        testResult,
      });
    } catch (error) {
      console.error("Error testing GROQ:", error);
      res.status(500).json({
        success: false,
        message: "GROQ integration test failed",
        error: (error as Error).message,
      });
    }
  });

  // Mount all routes under /api
  app.use("/api", router);

  return app;
}