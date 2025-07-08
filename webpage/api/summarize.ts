import { VercelRequest, VercelResponse } from '@vercel/node';
import { summarizeText } from '../src/lib/groq';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    const answer = await summarizeText(text);
    const summary = answer.replace(/<think>[\s\S]*?<\/think>\n\n/g, '');
    res.status(200).json({ summary });
  } catch (err) {
    res.status(500).json({ message: "Error summarizing", error: (err as Error).message });
  }
};