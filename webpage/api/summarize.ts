import { VercelRequest, VercelResponse } from '@vercel/node';
import { summarizeText } from '../src/lib/groq';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") return res.status(400).json({ message: "Text is required" });

  try {
    const answer = await summarizeText(text);
    const summary = answer.replace(/<think>[\s\S]*?<\/think>\n\n/g, '');
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: "Error summarizing", error: (err as Error).message });
  }
};