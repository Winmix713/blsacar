import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI API key is not configured. Set OPENAI_API_KEY environment variable.",
        },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert UI/UX designer. Given a design description, generate CSS/Tailwind properties for an HTML element. Respond ONLY with valid JSON matching this schema:
{
  "elementTag": "string (html tag)",
  "textContent": "string",
  "size": { "width": "string", "height": "string", "maxWidth": "string", "maxHeight": "string" },
  "padding": { "top": "string", "right": "string", "bottom": "string", "left": "string" },
  "margin": { "top": "string", "right": "string", "bottom": "string", "left": "string" },
  "typography": { "fontFamily": "string", "fontSize": "string", "fontWeight": "string", "textAlign": "string", "lineHeight": "string", "letterSpacing": "string" },
  "background": { "type": "solid|linear|radial", "color": "string", "gradient": { "from": "string", "to": "string", "angle": number } },
  "border": { "color": "string", "width": "string", "radius": "string" },
  "transforms": { "translateX": number, "translateY": number, "rotate": number, "scale": number, "skewX": number, "skewY": number },
  "opacity": number,
  "blur": number,
  "backdropBlur": number
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, error: `OpenAI API error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { success: false, error: "No response from OpenAI" },
        { status: 502 }
      );
    }

    const design = JSON.parse(content);
    const usage = data.usage;

    return NextResponse.json({
      success: true,
      design,
      tokens: usage
        ? {
            input: usage.prompt_tokens,
            output: usage.completion_tokens,
            total: usage.total_tokens,
          }
        : undefined,
    });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
