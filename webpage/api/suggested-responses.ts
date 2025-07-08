import { VercelRequest, VercelResponse } from '@vercel/node';
import { getSuggestedResponses } from '../server/groq';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") return res.status(400).json({ message: "Text is required" });

  try {
    const response = await getSuggestedResponses(text);
    res.json({ response });
  } catch (err) {
    res.status(500).json({ message: "Error getting suggested responses", error: (err as Error).message });
  }
};