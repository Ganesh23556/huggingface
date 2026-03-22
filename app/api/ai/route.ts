import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, lesson, course } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const hfToken = process.env.HUGGINGFACE_API_KEY;
    if (!hfToken) {
      console.error("HUGGINGFACE_API_KEY is not configured");
      return NextResponse.json({ error: "AI service configuration error" }, { status: 500 });
    }

    // Prompt construction for Flan-T5
    const context = lesson ? `Context: This is for a lesson about "${lesson}"${course ? ` in the course "${course}"` : ""}. ` : "";
    const prompt = `You are a helpful LMS tutor. ${context}Answer the student's question clearly: ${message}`;

    const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-large", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Hugging Face API Error:", errorData);
      
      // Handle model loading error (HF quirk)
      if (errorData.error?.includes("loading")) {
        return NextResponse.json(
          { error: "AI model is still loading, please try again in a moment." },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: "AI service is currently unavailable" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Hugging Face inference API typically returns an array for text generation
    const reply = data[0]?.generated_text || "AI could not generate a response";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
