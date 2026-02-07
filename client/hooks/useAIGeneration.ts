import { useState, useCallback } from "react";
import type {
  AIGenerationRequest,
  AIGenerationResponse,
  AIDesignUpdate,
} from "@shared/api";

interface UseAIGenerationState {
  isLoading: boolean;
  error: string | null;
  design: AIDesignUpdate | null;
  tokens: { input: number; output: number; total: number } | null;
}

/**
 * useAIGeneration - Hook for AI design generation
 * Handles API calls to /api/ai-generate endpoint
 * Features:
 * - Loading state management
 * - Error handling
 * - Response parsing
 * - Token usage tracking
 */
export const useAIGeneration = () => {
  const [state, setState] = useState<UseAIGenerationState>({
    isLoading: false,
    error: null,
    design: null,
    tokens: null,
  });

  /**
   * Generate design using OpenAI
   * Returns the design update or throws an error
   */
  const generate = useCallback(
    async (
      prompt: string,
      model: "gpt-4o" | "gpt-4-turbo" | "gpt-3.5-turbo" = "gpt-4o",
    ): Promise<AIDesignUpdate | null> => {
      // Reset state
      setState({
        isLoading: true,
        error: null,
        design: null,
        tokens: null,
      });

      try {
        // Validate prompt
        if (!prompt || prompt.trim().length === 0) {
          throw new Error("Prompt cannot be empty");
        }

        // Prepare request
        const request: AIGenerationRequest = {
          model,
          prompt: prompt.trim(),
          timestamp: new Date().toISOString(),
        };

        // Make API call
        const response = await fetch("/api/ai-generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        // Handle HTTP errors
        if (!response.ok) {
          const errorData = (await response.json()) as AIGenerationResponse;
          throw new Error(
            errorData.error ||
              `HTTP ${response.status}: ${response.statusText}`,
          );
        }

        // Parse response
        const data = (await response.json()) as AIGenerationResponse;

        // Check for API-level errors
        if (!data.success) {
          throw new Error(data.error || "AI generation failed");
        }

        // Update state with successful response
        setState({
          isLoading: false,
          error: null,
          design: data.design || null,
          tokens: data.tokens || null,
        });

        return data.design || null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setState({
          isLoading: false,
          error: errorMessage,
          design: null,
          tokens: null,
        });
        return null;
      }
    },
    [],
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      design: null,
      tokens: null,
    });
  }, []);

  return {
    ...state,
    generate,
    clearError,
    reset,
  };
};
