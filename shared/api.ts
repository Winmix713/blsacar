/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * AI Design Generation Request
 * Sent from client to /api/ai-generate
 */
export interface AIGenerationRequest {
  model: "gpt-4o" | "gpt-4-turbo" | "gpt-3.5-turbo";
  prompt: string;
  timestamp: string;
}

/**
 * Partial InspectorState updates from AI
 * Can update any subset of design properties
 */
export interface AIDesignUpdate {
  elementTag?: string;
  textContent?: string;
  size?: {
    width?: string;
    height?: string;
    maxWidth?: string;
    maxHeight?: string;
  };
  padding?: { top?: string; right?: string; bottom?: string; left?: string };
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: string;
    lineHeight?: string;
    letterSpacing?: string;
  };
  background?: {
    type?: "solid" | "linear" | "radial";
    color?: string;
    gradient?: { from?: string; to?: string; angle?: number };
  };
  border?: { color?: string; width?: string; radius?: string };
  transforms?: {
    translateX?: number;
    translateY?: number;
    rotate?: number;
    scale?: number;
    skewX?: number;
    skewY?: number;
  };
  transforms3d?: {
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
    perspective?: number;
  };
  opacity?: number;
  blur?: number;
  backdropBlur?: number;
}

/**
 * AI Generation Response
 * Returns design updates from OpenAI
 */
export interface AIGenerationResponse {
  success: boolean;
  design?: AIDesignUpdate;
  explanation?: string;
  error?: string;
  tokens?: {
    input: number;
    output: number;
    total: number;
  };
}
