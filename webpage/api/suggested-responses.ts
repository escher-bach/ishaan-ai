// app/api/suggested-responses/route.ts

import { getSuggestedResponses } from '../server/groq.js';

export async function POST(req: Request) {
  try {
    const { context } = await req.json();

    if (!context || typeof context !== 'string') {
      return new Response(JSON.stringify({ message: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const suggestions = await getSuggestedResponses(context);

    return new Response(JSON.stringify({ suggestions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        message: 'Error getting suggested responses',
        error: err.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}