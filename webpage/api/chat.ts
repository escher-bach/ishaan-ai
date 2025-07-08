import { VercelRequest, VercelResponse } from '@vercel/node';
import { getChatResponse } from '../server/groq.js';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") return res.status(400).json({ message: "Text is required" });

  try {
    const answer = await getChatResponse(text);
    const response = answer.replace(/<think>[\s\S]*?<\/think>\n\n/g, '');
    res.json({ response });
  } catch (err) {
    res.status(500).json({ message: "Error chat response", error: (err as Error).message });
  }
};