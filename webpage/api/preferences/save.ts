import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../backend/storage'

export default async (req: VercelRequest, res: VercelResponse) => {
  const { userId, ...prefs } = req.body;
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  try {
    const saved = await storage.saveUserPreferences(userId, prefs);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error saving preferences", error: (err as Error).message });
  }
};