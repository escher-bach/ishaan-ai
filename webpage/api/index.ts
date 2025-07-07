// index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import serverless from "serverless-http";
import { summarizeText, simplifyText, correctGrammar, translateText, getChatResponse, getSuggestedResponses } from "./groq";

const storage = {
  async saveUserPreferences(userId: string, prefs: any) {
    return { userId, ...prefs };
  },
  async getUserPreferences(userId: string) {
    return { userId, theme: "dark" };
  },
};

// ---- Setup Express app ----
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Routes ----
app.post("/api/summarize", async (req: Request, res: Response) => {
  const { text } = req.body;
  console.log(text);
  if (!text || typeof text !== "string") return res.status(400).json({ message: "Text is required" });
  try {
    const answer = await summarizeText(text);
    const summary = answer.replace(/<think>[\s\S]*?<\/think>\n\n/g, '');
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: "Error summarizing", error: (err as Error).message });
  }
});

app.post("/api/simplify", async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") return res.status(400).json({ message: "Text is required" });
  try {
    const answer = await simplifyText(text);
    const simplifiedText = answer.replace(/<think>[\s\S]*?<\/think>\n\n/g, '');
    res.json({ simplifiedText });
  } catch (err) {
    res.status(500).json({ message: "Error simplifying", error: (err as Error).message });
  }
});

app.post("/api/correct-grammar", async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") return res.status(400).json({ message: "Text is required" });
  try {
    const answer = await correctGrammar(text);
    const correctedText = answer.replace(/<think>[\s\S]*?<\/think>\n\n/g, '');
    res.json({ correctedText });
  } catch (err) {
    res.status(500).json({ message: "Error correcting grammar", error: (err as Error).message });
  }
});

app.post("/api/translate", async (req: Request, res: Response) => {
  const { text, sourceLanguage, targetLanguage } = req.body;
  if (!text || typeof text !== "string") return res.status(400).json({ message: "Text is required" });
  if (!targetLanguage) return res.status(400).json({ message: "Target language is required" });
  try {
    const answer = await translateText(text, sourceLanguage, targetLanguage);
    const translatedText = answer.replace(/<think>[\s\S]*?<\/think>\n\n/g, '');
    res.json({ translatedText });
  } catch (err) {
    res.status(500).json({ message: "Error translating", error: (err as Error).message });
  }
});

app.post("/api/chat", async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message || typeof message !== "string") return res.status(400).json({ message: "Message is required" });
  try {
    const answer = await getChatResponse(message);
    const response = answer.replace(/<think>[\s\S]*?<\/think>\n\n/g, '');
    res.json({ response });
  } catch (err) {
    res.status(500).json({ message: "Error in chat", error: (err as Error).message });
  }
});

app.post("/api/suggested-responses", async (req: Request, res: Response) => {
  const { context } = req.body;
  if (!context || typeof context !== "string") return res.status(400).json({ message: "Context is required" });
  try {
    const suggestions = await getSuggestedResponses(context);
    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ message: "Error getting suggestions", error: (err as Error).message });
  }
});

app.post("/api/preferences", async (req: Request, res: Response) => {
  const { userId, ...prefs } = req.body;
  if (!userId) return res.status(400).json({ message: "User ID is required" });
  try {
    const saved = await storage.saveUserPreferences(userId, prefs);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error saving preferences", error: (err as Error).message });
  }
});

app.get("/api/preferences/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "User ID is required" });
  try {
    const prefs = await storage.getUserPreferences(userId);
    if (!prefs) return res.status(404).json({ message: "Preferences not found" });
    res.json(prefs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching preferences", error: (err as Error).message });
  }
});

// ---- Local Dev Server ----
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

// ---- Export for Vercel ----
export default process.env.VERCEL ? serverless(app) : app;