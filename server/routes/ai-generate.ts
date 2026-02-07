import { RequestHandler } from "express";
import { OpenAI } from "openai";
import type {
  AIGenerationRequest,
  AIGenerationResponse,
  AIDesignUpdate,
} from "@shared/api";

/**
 * Initialize OpenAI client with API key from environment
 * Note: OPENAI_API_KEY must be set in environment variables
 */
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({ apiKey });
};

/**
 * System prompt for AI design generation
 * Instructs the model how to generate design properties
 */
const SYSTEM_PROMPT = `You are an expert UI/UX designer assistant. Your task is to generate CSS properties and design updates based on user descriptions.

When the user describes a design, respond ONLY with a valid JSON object (no markdown, no code blocks) containing design properties. Use this structure:

{
  "elementTag": "div|section|h1-h6|p|span|button|etc",
  "textContent": "generated text if applicable",
  "size": { "width": "value", "height": "value", "maxWidth": "value", "maxHeight": "value" },
  "padding": { "top": "value", "right": "value", "bottom": "value", "left": "value" },
  "margin": { "top": "value", "right": "value", "bottom": "value", "left": "value" },
  "typography": { "fontFamily": "value", "fontSize": "value", "fontWeight": "value", "textAlign": "value", "lineHeight": "value", "letterSpacing": "value" },
  "background": { "type": "solid|linear|radial", "color": "value", "gradient": { "from": "value", "to": "value", "angle": 90 } },
  "border": { "color": "value", "width": "value", "radius": "value" },
  "transforms": { "translateX": 0, "translateY": 0, "rotate": 0, "scale": 100, "skewX": 0, "skewY": 0 },
  "transforms3d": { "rotateX": 0, "rotateY": 0, "rotateZ": 0, "perspective": 0 },
  "opacity": 100,
  "blur": 0,
  "backdropBlur": 0
}

Rules:
- Only include properties that make sense for the design
- Use Tailwind-compatible values (e.g., "16" for padding, "20" for font-size)
- Use hex colors or rgb/hsl formats for colors
- Use numeric values for transforms (degrees for rotate, pixels for translate)
- Scale should be 0-200 (percentage)
- Opacity should be 0-100 (percentage)
- Focus on creating a cohesive, professional design`;

/**
 * Parse AI response - extract JSON from various formats
 */
function parseAIResponse(content: string): AIDesignUpdate {
  // Try direct JSON parsing first
  try {
    return JSON.parse(content);
  } catch {
    // If wrapped in markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {
        // Continue to next attempt
      }
    }

    // If wrapped in other delimiters
    const objectMatch = content.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    throw new Error("No valid JSON found in AI response");
  }
}

/**
 * Validate design update - ensure values are reasonable
 */
function validateDesignUpdate(design: unknown): design is AIDesignUpdate {
  if (typeof design !== "object" || design === null) {
    return false;
  }

  const obj = design as Record<string, unknown>;

  // Basic validation - check if at least some properties exist
  const hasValidProps =
    Boolean(obj.elementTag) ||
    Boolean(obj.textContent) ||
    Boolean(obj.size) ||
    Boolean(obj.padding) ||
    Boolean(obj.margin) ||
    Boolean(obj.typography) ||
    Boolean(obj.background) ||
    Boolean(obj.border) ||
    Boolean(obj.transforms) ||
    Boolean(obj.transforms3d) ||
    typeof obj.opacity === "number" ||
    typeof obj.blur === "number" ||
    typeof obj.backdropBlur === "number";

  return hasValidProps;
}

/**
 * POST /api/ai-generate
 * Generates design suggestions using OpenAI
 */
export const handleAIGenerate: RequestHandler<
  never,
  AIGenerationResponse,
  AIGenerationRequest
> = async (req, res) => {
  try {
    const { model, prompt } = req.body;

    // Validate request
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required and must be non-empty",
      });
    }

    if (!model || !["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"].includes(model)) {
      return res.status(400).json({
        success: false,
        error: "Invalid model specified",
      });
    }

    // Initialize OpenAI client
    let client: OpenAI;
    try {
      client = getOpenAIClient();
    } catch (error) {
      console.error("OpenAI initialization error:", error);
      return res.status(500).json({
        success: false,
        error:
          "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.",
      });
    }

    // Call OpenAI API
    const completion = await client.chat.completions.create({
      model: model === "gpt-4-turbo" ? "gpt-4-turbo-preview" : model,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "text" },
    });

    // Extract response content
    const responseContent = completion.choices[0]?.message?.content || "";
    if (!responseContent) {
      return res.status(500).json({
        success: false,
        error: "Empty response from OpenAI",
      });
    }

    // Parse AI response
    let design: AIDesignUpdate;
    try {
      design = parseAIResponse(responseContent);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      return res.status(500).json({
        success: false,
        error: `Failed to parse AI response: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
      });
    }

    // Validate design update
    if (!validateDesignUpdate(design)) {
      return res.status(500).json({
        success: false,
        error: "Generated design data is invalid",
      });
    }

    // Return success response
    return res.json({
      success: true,
      design,
      explanation: `Generated design using ${model}`,
      tokens: {
        input: completion.usage?.prompt_tokens || 0,
        output: completion.usage?.completion_tokens || 0,
        total: completion.usage?.total_tokens || 0,
      },
    });
  } catch (error) {
    console.error("AI generation error:", error);
    return res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate design",
    });
  }
};
