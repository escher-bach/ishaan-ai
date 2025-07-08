import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

// Runtime-safe Groq client
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not defined in environment variables.");
  }
  return new Groq({ apiKey });
}

const MODEL_NAME = "deepseek-r1-distill-llama-70b";

// Summarize
export async function summarizeText(text: string): Promise<string> {
  try {
    const groq = getGroqClient();
    console.log('GROQ key defined:', Boolean(process.env.GROQ_API_KEY));
    const response = await groq.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that summarizes text for people with dyslexia and other reading difficulties. Use clear, simple language.",
        },
        {
          role: "user",
          content: `Please summarize the following text:\n\n${text}`,
        },
      ],
    });

    return response.choices[0].message.content || "Unable to generate summary.";
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw new Error(`Failed to summarize text: ${(error as Error).message}`);
  }
}

// Simplify
export async function simplifyText(text: string): Promise<string> {
  try {
    const groq = getGroqClient();
    const response = await groq.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content:
            "Simplify complex text into shorter, easier sentences for people with reading difficulties.",
        },
        {
          role: "user",
          content: `Please simplify this text:\n\n${text}`,
        },
      ],
    });

    return response.choices[0].message.content || "Unable to simplify text.";
  } catch (error) {
    console.error("Error simplifying text:", error);
    throw new Error(`Failed to simplify text: ${(error as Error).message}`);
  }
}

// Correct Grammar
export async function correctGrammar(text: string): Promise<string> {
  try {
    const groq = getGroqClient();
    console.log('GROQ key defined:', Boolean(process.env.GROQ_API_KEY));
    const response = await groq.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content:
            "Correct grammar and spelling while keeping the original meaning clear and simple.",
        },
        {
          role: "user",
          content: `Correct this text:\n\n${text}`,
        },
      ],
    });

    return response.choices[0].message.content || "Unable to correct grammar.";
  } catch (error) {
    console.error("Error correcting grammar:", error);
    throw new Error(`Failed to correct grammar: ${(error as Error).message}`);
  }
}

// Translate
export async function translateText(
  text: string,
  sourceLanguage: string = "auto",
  targetLanguage: string,
): Promise<string> {
  try {
    const groq = getGroqClient();

    let systemPrompt = "Translate text between languages.";
    let userPrompt = `Translate this text from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`;

    if (sourceLanguage === "hi-t" && targetLanguage === "hi") {
      systemPrompt = "Convert Hinglish to proper Hindi script.";
      userPrompt = `Convert this Hinglish text to Hindi:\n\n${text}`;
    } else if (sourceLanguage === "hi-t" && targetLanguage === "en") {
      systemPrompt = "Translate Hinglish (Roman script Hindi) to English.";
      userPrompt = `Translate this Hinglish text to English:\n\n${text}`;
    } else if (targetLanguage === "simple") {
      systemPrompt =
        "Translate this to very simple English for people with reading difficulties.";
      userPrompt = `Simplify and translate this text:\n\n${text}`;
    }

    const response = await groq.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    return response.choices[0].message.content || "Unable to translate text.";
  } catch (error) {
    console.error("Error translating text:", error);
    throw new Error(`Failed to translate text: ${(error as Error).message}`);
  }
}

// Chat response
export async function getChatResponse(message: string): Promise<string> {
  try {
    const groq = getGroqClient();
    console.log('GROQ key defined:', Boolean(process.env.GROQ_API_KEY));
    const response = await groq.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Use simple, supportive language. Avoid complex words.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return response.choices[0].message.content || "No response generated.";
  } catch (error) {
    console.error("Error getting chat response:", error);
    throw new Error(`Failed to get chat response: ${(error as Error).message}`);
  }
}

// Suggested responses
export async function getSuggestedResponses(context: string): Promise<string[]> {
  try {
    const groq = getGroqClient();
    const response = await groq.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content:
            "Suggest 4 short, clear responses for someone with dyslexia. Return as a JSON array.",
        },
        {
          role: "user",
          content: `Suggest responses for this:\n\n${context}`,
        },
      ],
    });

    const content = response.choices[0].message.content || "";
    let suggestions: string[] = [];

    // Attempt to parse or extract suggestions
    try {
      const jsonMatch = content.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        suggestions = content
          .split("\n")
          .filter(Boolean)
          .map((line) => line.replace(/^[0-9.\-–\s]+/, "").trim())
          .slice(0, 4);
      }
    } catch {
      suggestions = ["Can you explain this?", "What does this mean?", "Simplify this please.", "I don’t understand."];
    }

    return suggestions;
  } catch (error) {
    console.error("Error getting suggested responses:", error);
    return ["Can you explain this?", "What does this mean?", "Simplify this please.", "I don’t understand."];
  }
}