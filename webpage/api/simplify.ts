import { VercelRequest, VercelResponse } from '@vercel/node';
import { simplifyText } from '../src/lib/groq';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") return res.status(400).json({ message: "Text is required" });

  try {
    const answer = await simplifyText(text);
    const response = answer.replace(/<think>[\s\S]*?<\/think>\n\n/g, '');
    res.json({ response });
  } catch (err) {
    res.status(500).json({ message: "Error simplifying text", error: (err as Error).message });
  }
};