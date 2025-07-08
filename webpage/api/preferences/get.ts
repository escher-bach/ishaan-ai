import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../backend/storage';

export default async (req: VercelRequest, res: VercelResponse) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  try {
    const prefs = await storage.getUserPreferences(userId);
    if (!prefs) return res.status(404).json({ message: "Preferences not found" });
    res.json(prefs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching preferences", error: (err as Error).message });
  }
};
