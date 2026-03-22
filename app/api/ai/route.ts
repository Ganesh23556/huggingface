export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.HUGGINGFACE_API_KEY;

    // Optional debug
    console.log("HF KEY EXISTS:", !!process.env.HUGGINGFACE_API_KEY);

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
          inputs: `You are a helpful LMS AI tutor. Answer clearly: ${message}`,
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.[0]?.generated_text || "No response from AI";

    return new Response(JSON.stringify({ reply }));
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "AI error occurred" }),
      { status: 500 }
    );
  }
}
