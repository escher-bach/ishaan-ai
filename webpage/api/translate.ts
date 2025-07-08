import { VercelRequest, VercelResponse } from '@vercel/node';
import { translateText } from '../server/groq.js';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { text, sourceLanguage, targetLanguage } = req.body;
  if (!text || typeof text !== "string") return res.status(400).json({ message: "Text is required" });

  try {
    const answer = await translateText(text, sourceLanguage, targetLanguage);
    const response = answer.replace(/<think>[\s\S]*?<\/think>\n\n/g, '');
    res.json({ response });
  } catch (err) {
    res.status(500).json({ message: "Error getting translated text", error: (err as Error).message });
  }
};