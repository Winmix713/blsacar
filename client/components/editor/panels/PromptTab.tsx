import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Sparkles, Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useInspector } from "@/hooks/use-inspector";
import { useAIGeneration } from "@/hooks/useAIGeneration";
import type { AIDesignUpdate } from "@shared/api";

/**
 * PromptTab - AI Assistant interface for design generation
 * Features:
 * - AI model selector
 * - Template presets
 * - Custom prompt textarea
 * - Real OpenAI integration via /api/ai-generate
 * - Live design application to InspectorState
 * - Complete error handling and user feedback
 */
export const PromptTab: React.FC = React.memo(() => {
  const { updateState, updateNestedState } = useInspector();
  const { isLoading, error, design, tokens, generate, clearError, reset } =
    useAIGeneration();

  const [model, setModel] = useState<
    "gpt-4o" | "gpt-4-turbo" | "gpt-3.5-turbo"
  >("gpt-4o");
  const [customPrompt, setCustomPrompt] = useState("");
  const [lastGeneration, setLastGeneration] = useState<string | null>(null);

  const templates = [
    {
      id: "minimal",
      label: "Minimal Design",
      description: "Clean, simple layout with basic styling",
      prompt:
        "Create a minimal, clean design with a simple layout. Use neutral colors, plenty of whitespace, and modern typography. Keep it professional and understated.",
    },
    {
      id: "modern",
      label: "Modern Style",
      description: "Contemporary design with gradients and effects",
      prompt:
        "Design a modern, contemporary component with gradient backgrounds, smooth shadows, and animated effects. Use vibrant colors and trendy styling.",
    },
    {
      id: "vibrant",
      label: "Vibrant Colors",
      description: "Bold colors and dynamic styling",
      prompt:
        "Create a vibrant, eye-catching design with bold colors, dynamic gradients, and engaging visual elements. Make it stand out and grab attention.",
    },
    {
      id: "professional",
      label: "Professional",
      description: "Business-ready, clean typography",
      prompt:
        "Design a professional, business-ready component with clean typography, corporate colors (blues and grays), and polished styling. Suitable for enterprise applications.",
    },
  ];

  const handleTemplateClick = useCallback((templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setCustomPrompt(template.prompt);
    }
  }, []);

  /**
   * Apply design updates to InspectorState
   */
  const applyDesignUpdates = useCallback(
    (designUpdate: AIDesignUpdate) => {
      // Apply top-level properties
      if (designUpdate.elementTag) {
        updateState("elementTag", designUpdate.elementTag as any);
      }
      if (designUpdate.textContent) {
        updateState("textContent", designUpdate.textContent);
      }
      if (designUpdate.opacity !== undefined) {
        updateState("opacity", designUpdate.opacity);
      }
      if (designUpdate.blur !== undefined) {
        updateState("blur", designUpdate.blur);
      }
      if (designUpdate.backdropBlur !== undefined) {
        updateState("backdropBlur", designUpdate.backdropBlur);
      }

      // Apply size properties
      if (designUpdate.size) {
        if (designUpdate.size.width !== undefined) {
          updateNestedState("size", "width", designUpdate.size.width);
        }
        if (designUpdate.size.height !== undefined) {
          updateNestedState("size", "height", designUpdate.size.height);
        }
        if (designUpdate.size.maxWidth !== undefined) {
          updateNestedState("size", "maxWidth", designUpdate.size.maxWidth);
        }
        if (designUpdate.size.maxHeight !== undefined) {
          updateNestedState("size", "maxHeight", designUpdate.size.maxHeight);
        }
      }

      // Apply padding
      if (designUpdate.padding) {
        if (designUpdate.padding.top !== undefined) {
          updateNestedState("padding", "top", designUpdate.padding.top);
        }
        if (designUpdate.padding.right !== undefined) {
          updateNestedState("padding", "right", designUpdate.padding.right);
        }
        if (designUpdate.padding.bottom !== undefined) {
          updateNestedState("padding", "bottom", designUpdate.padding.bottom);
        }
        if (designUpdate.padding.left !== undefined) {
          updateNestedState("padding", "left", designUpdate.padding.left);
        }
      }

      // Apply margin
      if (designUpdate.margin) {
        if (designUpdate.margin.top !== undefined) {
          updateNestedState("margin", "top", designUpdate.margin.top);
        }
        if (designUpdate.margin.right !== undefined) {
          updateNestedState("margin", "right", designUpdate.margin.right);
        }
        if (designUpdate.margin.bottom !== undefined) {
          updateNestedState("margin", "bottom", designUpdate.margin.bottom);
        }
        if (designUpdate.margin.left !== undefined) {
          updateNestedState("margin", "left", designUpdate.margin.left);
        }
      }

      // Apply typography
      if (designUpdate.typography) {
        if (designUpdate.typography.fontFamily !== undefined) {
          updateNestedState(
            "typography",
            "fontFamily",
            designUpdate.typography.fontFamily,
          );
        }
        if (designUpdate.typography.fontSize !== undefined) {
          updateNestedState(
            "typography",
            "fontSize",
            designUpdate.typography.fontSize,
          );
        }
        if (designUpdate.typography.fontWeight !== undefined) {
          updateNestedState(
            "typography",
            "fontWeight",
            designUpdate.typography.fontWeight,
          );
        }
        if (designUpdate.typography.textAlign !== undefined) {
          updateNestedState(
            "typography",
            "textAlign",
            designUpdate.typography.textAlign,
          );
        }
        if (designUpdate.typography.lineHeight !== undefined) {
          updateNestedState(
            "typography",
            "lineHeight",
            designUpdate.typography.lineHeight,
          );
        }
        if (designUpdate.typography.letterSpacing !== undefined) {
          updateNestedState(
            "typography",
            "letterSpacing",
            designUpdate.typography.letterSpacing,
          );
        }
      }

      // Apply background
      if (designUpdate.background) {
        if (designUpdate.background.type !== undefined) {
          updateNestedState("background", "type", designUpdate.background.type);
        }
        if (designUpdate.background.color !== undefined) {
          updateNestedState(
            "background",
            "color",
            designUpdate.background.color,
          );
        }
        if (designUpdate.background.gradient !== undefined) {
          updateNestedState(
            "background",
            "gradient",
            designUpdate.background.gradient,
          );
        }
      }

      // Apply border
      if (designUpdate.border) {
        if (designUpdate.border.color !== undefined) {
          updateNestedState("border", "color", designUpdate.border.color);
        }
        if (designUpdate.border.width !== undefined) {
          updateNestedState("border", "width", designUpdate.border.width);
        }
        if (designUpdate.border.radius !== undefined) {
          updateNestedState("border", "radius", designUpdate.border.radius);
        }
      }

      // Apply 2D transforms
      if (designUpdate.transforms) {
        if (designUpdate.transforms.translateX !== undefined) {
          updateNestedState(
            "transforms",
            "translateX",
            designUpdate.transforms.translateX,
          );
        }
        if (designUpdate.transforms.translateY !== undefined) {
          updateNestedState(
            "transforms",
            "translateY",
            designUpdate.transforms.translateY,
          );
        }
        if (designUpdate.transforms.rotate !== undefined) {
          updateNestedState(
            "transforms",
            "rotate",
            designUpdate.transforms.rotate,
          );
        }
        if (designUpdate.transforms.scale !== undefined) {
          updateNestedState(
            "transforms",
            "scale",
            designUpdate.transforms.scale,
          );
        }
        if (designUpdate.transforms.skewX !== undefined) {
          updateNestedState(
            "transforms",
            "skewX",
            designUpdate.transforms.skewX,
          );
        }
        if (designUpdate.transforms.skewY !== undefined) {
          updateNestedState(
            "transforms",
            "skewY",
            designUpdate.transforms.skewY,
          );
        }
      }

      // Apply 3D transforms
      if (designUpdate.transforms3d) {
        if (designUpdate.transforms3d.rotateX !== undefined) {
          updateNestedState(
            "transforms3d",
            "rotateX",
            designUpdate.transforms3d.rotateX,
          );
        }
        if (designUpdate.transforms3d.rotateY !== undefined) {
          updateNestedState(
            "transforms3d",
            "rotateY",
            designUpdate.transforms3d.rotateY,
          );
        }
        if (designUpdate.transforms3d.rotateZ !== undefined) {
          updateNestedState(
            "transforms3d",
            "rotateZ",
            designUpdate.transforms3d.rotateZ,
          );
        }
        if (designUpdate.transforms3d.perspective !== undefined) {
          updateNestedState(
            "transforms3d",
            "perspective",
            designUpdate.transforms3d.perspective,
          );
        }
      }
    },
    [updateState, updateNestedState],
  );

  const handleGenerate = useCallback(async () => {
    if (!customPrompt.trim()) {
      alert("Please enter a prompt or select a template");
      return;
    }

    // Call AI generation
    const design = await generate(customPrompt, model);

    if (design) {
      // Apply design updates to InspectorState
      applyDesignUpdates(design);
      setLastGeneration(customPrompt);
    }
  }, [customPrompt, model, generate, applyDesignUpdates]);

  return (
    <div className="space-y-4 pb-4">
      {/* Success Banner */}
      {design && (
        <Alert className="border-green-500/20 bg-green-500/5">
          <Check className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-xs text-green-400">
            Design generated successfully and applied to properties!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Banner */}
      {error && (
        <Alert className="border-red-500/20 bg-red-500/5">
          <X className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-xs text-red-400 space-y-1">
            <div>{error}</div>
            {error.includes("not configured") && (
              <div className="text-[8px] mt-2">
                Set OPENAI_API_KEY environment variable to enable AI features.
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Info Banner */}
      <Alert className="border-blue-500/20 bg-blue-500/5">
        <Sparkles className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-xs text-blue-400">
          AI-powered design generation powered by OpenAI GPT models.
        </AlertDescription>
      </Alert>

      {/* Model Selector */}
      <div className="space-y-2">
        <label className="text-[9px] font-bold text-muted-foreground block">
          AI Model
        </label>
        <Select
          value={model}
          onValueChange={(value) =>
            setModel(value as "gpt-4o" | "gpt-4-turbo" | "gpt-3.5-turbo")
          }
          disabled={isLoading}
        >
          <SelectTrigger className="h-8 text-xs bg-[#1e1e20]">
            <SelectValue placeholder="Select model..." />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a1c] border-white/10">
            <SelectItem value="gpt-4o" className="text-xs">
              GPT-4o (Recommended)
            </SelectItem>
            <SelectItem value="gpt-4-turbo" className="text-xs">
              GPT-4 Turbo
            </SelectItem>
            <SelectItem value="gpt-3.5-turbo" className="text-xs">
              GPT-3.5 Turbo
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="text-[8px] text-muted-foreground">
          Choose the AI model for generation quality
        </div>
      </div>

      {/* Template Presets */}
      <div className="space-y-2">
        <label className="text-[9px] font-bold text-muted-foreground block">
          Templates
        </label>
        <div className="grid grid-cols-2 gap-2">
          {templates.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              size="sm"
              onClick={() => handleTemplateClick(template.id)}
              disabled={isLoading}
              className="h-auto py-2 px-2 text-left flex flex-col items-start gap-1 border-white/10 hover:bg-white/5"
            >
              <span className="text-[10px] font-semibold">
                {template.label}
              </span>
              <span className="text-[8px] text-muted-foreground">
                {template.description}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Prompt */}
      <div className="space-y-2">
        <label className="text-[9px] font-bold text-muted-foreground block">
          Custom Prompt
        </label>
        <Textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          disabled={isLoading}
          placeholder="Describe the design you want to generate... e.g., 'A clean hero section with gradient background and bold heading'"
          className="min-h-[120px] text-xs bg-[#1e1e20] border-white/10 resize-none disabled:opacity-50"
          aria-label="Custom AI prompt"
        />
        <div className="text-[8px] text-muted-foreground">
          {customPrompt.length} characters
        </div>
      </div>

      {/* Token Usage Info */}
      {tokens && (
        <div className="bg-purple-500/5 p-2 rounded-lg border border-purple-500/20 space-y-1">
          <div className="text-[8px] font-semibold text-purple-400">
            Token Usage
          </div>
          <div className="grid grid-cols-3 gap-2 text-[8px] text-muted-foreground">
            <div>Input: {tokens.input}</div>
            <div>Output: {tokens.output}</div>
            <div>Total: {tokens.total}</div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isLoading || !customPrompt.trim()}
        className="w-full bg-primary hover:bg-primary/90 text-black font-semibold h-9"
      >
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Design
          </>
        )}
      </Button>

      {/* Last Generation Info */}
      {lastGeneration && (
        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
          <div className="text-[8px] font-semibold text-muted-foreground mb-1">
            Last Generation
          </div>
          <div className="text-[8px] text-muted-foreground italic">
            "{lastGeneration.substring(0, 100)}
            {lastGeneration.length > 100 ? "..." : ""}"
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="bg-black/20 p-3 rounded-lg border border-white/5 space-y-2">
        <h4 className="text-[9px] font-bold text-muted-foreground">
          How It Works
        </h4>
        <ul className="text-[8px] text-muted-foreground space-y-1">
          <li>• Enter a design description or use a template</li>
          <li>• Choose an AI model (GPT-4o recommended)</li>
          <li>• Click "Generate Design" to create with OpenAI</li>
          <li>• Design updates apply instantly to properties</li>
          <li>• Check token usage for API cost tracking</li>
        </ul>
      </div>
    </div>
  );
});

PromptTab.displayName = "PromptTab";
