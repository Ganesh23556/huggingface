export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    console.log("HF KEY EXISTS:", !!apiKey);

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing HUGGINGFACE_API_KEY" }),
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
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
