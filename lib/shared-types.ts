/**
 * Shared types between client and server
 */

export interface DemoResponse {
  message: string;
}

export interface AIGenerationRequest {
  model: "gpt-4o" | "gpt-4-turbo" | "gpt-3.5-turbo";
  prompt: string;
  timestamp: string;
}

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
