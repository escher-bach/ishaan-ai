// app/api/summarize/route.ts
import { summarizeText } from '@/lib/groq';

export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text || typeof text !== "string") {
    return new Response(JSON.stringify({ message: "Text is required" }), { status: 400 });
  }

  try {
    const answer = await summarizeText(text);
    const summary = answer.replace(/<think>[\s\S]*?<\/think>\n\n/g, '');
    return new Response(JSON.stringify({ summary }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Error", error: (err as Error).message }), { status: 500 });
  }
}