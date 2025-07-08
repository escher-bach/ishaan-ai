// app/api/simplify/route.ts

import { simplifyText } from '../server/groq.js';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ message: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const answer = await simplifyText(text);
    const simplifiedText = answer.replace(/<think>[\s\S]*?<\/think>\n\n/g, '');

    return new Response(JSON.stringify({ simplifiedText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        message: 'Error simplifying text',
        error: err.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
