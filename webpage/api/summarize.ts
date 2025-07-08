import { VercelRequest, VercelResponse } from '@vercel/node';
import { summarizeText } from '../src/lib/groq.js';

console.log("SUMMARIZE ENDPOINT")

// export default async function handler(req: VercelRequest, res: VercelResponse) {
//   if (req.method !== 'POST') {
//     res.setHeader('Allow', 'POST');
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const { text } = req.body;
//   if (!text || typeof text !== "string") {
//     return res.status(400).json({ message: "Text is required" });
//   }

//   try {
//     const answer = await summarizeText(text);
//     const summary = answer.replace(/<think>[\s\S]*?<\/think>\n\n/g, '');
//     res.status(200).json({ summary });
//   } catch (err) {
//     res.status(500).json({ message: "Error summarizing", error: (err as Error).message });
//   }
// };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ message: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const answer = await summarizeText(text);
    const summary = answer.replace(/<think>[\s\S]*?<\/think>\n\n/g, '');

    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error summarizing', error: (error as Error).message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}