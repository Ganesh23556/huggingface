export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.HUGGINGFACE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing API key" }),
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `You are a helpful AI tutor. Answer clearly: ${message}`,
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.[0]?.generated_text || "No response from AI";

    return new Response(JSON.stringify({ reply }));
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "AI failed" }),
      { status: 500 }
    );
  }
}
