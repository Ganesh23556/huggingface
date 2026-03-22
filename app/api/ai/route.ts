import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, lesson, course } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      console.error("GROQ_API_KEY is not configured");
      return NextResponse.json({ error: "AI service configuration error" }, { status: 500 });
    }

    // Using Groq for high reliability and speed
    const systemPrompt = 
      "You are a helpful and encouraging LMS tutor. " + 
      (lesson ? `The user is currently studying the lesson "${lesson}"${course ? ` in the course "${course}"` : ""}. ` : "") +
      "Explain concepts in simple terms and help the user succeed.";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Explain in simple terms: ${message}` },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API Error:", errorData);
      return NextResponse.json(
        { error: "AI service is currently unavailable" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "AI could not generate a response";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
