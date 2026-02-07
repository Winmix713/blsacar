import React, { useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DebouncedInput } from "@/components/editor/core/DebouncedInput";
import { ColorPicker } from "@/components/editor/controls/ColorPicker";
import type { BackgroundType } from "@/hooks/use-inspector";

interface AppearanceSectionProps {
  backgroundType: BackgroundType;
  backgroundColor: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientAngle?: number;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  onBackgroundTypeChange: (type: BackgroundType) => void;
  onBackgroundColorChange: (color: string) => void;
  onGradientFromChange: (color: string) => void;
  onGradientToChange: (color: string) => void;
  onGradientAngleChange: (angle: number) => void;
  onBorderColorChange: (color: string) => void;
  onBorderWidthChange: (width: string) => void;
  onBorderRadiusChange: (radius: string) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const BACKGROUND_TYPES: BackgroundType[] = ["solid", "linear", "radial"];

/**
 * AppearanceSection - Manage background, border, and colors
 * Features:
 * - Background type selection (solid, linear, radial)
 * - Color picker for solid backgrounds
 * - Gradient editor with from/to colors and angle
 * - Border properties with color picker
 * - Border radius control
 */
export const AppearanceSection: React.FC<AppearanceSectionProps> = React.memo(
  ({
    backgroundType,
    backgroundColor,
    gradientFrom = "",
    gradientTo = "",
    gradientAngle = 90,
    borderColor,
    borderWidth,
    borderRadius,
    onBackgroundTypeChange,
    onBackgroundColorChange,
    onGradientFromChange,
    onGradientToChange,
    onGradientAngleChange,
    onBorderColorChange,
    onBorderWidthChange,
    onBorderRadiusChange,
    expanded = false,
    onToggleExpand,
  }) => {
    const handleBackgroundTypeChange = useCallback(
      (value: string) => {
        onBackgroundTypeChange(value as BackgroundType);
      },
      [onBackgroundTypeChange],
    );

    const handleAngleChange = useCallback(
      (value: string) => {
        const num = parseInt(value) || 0;
        onGradientAngleChange(Math.min(Math.max(num, 0), 360));
      },
      [onGradientAngleChange],
    );

    return (
      <Accordion
        type="single"
        value={expanded ? "appearance" : ""}
        onValueChange={() => onToggleExpand?.()}
      >
        <AccordionItem
          value="appearance"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={onToggleExpand}
          >
            Appearance
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-4">
            {/* Background Type Selection */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-muted-foreground block">
                Background Type
              </label>
              <Select
                value={backgroundType}
                onValueChange={handleBackgroundTypeChange}
              >
                <SelectTrigger className="h-8 text-xs bg-[#1e1e20]">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1c] border-white/10">
                  {BACKGROUND_TYPES.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="text-xs capitalize"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Solid Background */}
            {backgroundType === "solid" && (
              <ColorPicker
                label="Background Color"
                value={backgroundColor}
                onChange={onBackgroundColorChange}
                placeholder="#000000"
                aria-label="Background color"
              />
            )}

            {/* Gradient Background */}
            {(backgroundType === "linear" || backgroundType === "radial") && (
              <div className="space-y-3 p-3 rounded-lg bg-black/20 border border-white/5">
                <ColorPicker
                  label="Gradient From"
                  value={gradientFrom}
                  onChange={onGradientFromChange}
                  placeholder="#000000"
                  aria-label="Gradient start color"
                />
                <ColorPicker
                  label="Gradient To"
                  value={gradientTo}
                  onChange={onGradientToChange}
                  placeholder="#ffffff"
                  aria-label="Gradient end color"
                />

                {/* Gradient Angle (for linear gradients) */}
                {backgroundType === "linear" && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-muted-foreground block">
                      Angle ({gradientAngle}°)
                    </label>
                    <DebouncedInput
                      value={gradientAngle.toString()}
                      onChange={handleAngleChange}
                      type="number"
                      placeholder="90"
                      className="h-8 text-xs bg-[#1e1e20]"
                      aria-label="Gradient angle"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Border Section */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <h4 className="text-[9px] font-bold text-muted-foreground">
                Border
              </h4>

              <ColorPicker
                label="Border Color"
                value={borderColor}
                onChange={onBorderColorChange}
                placeholder="#000000"
                aria-label="Border color"
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-muted-foreground block">
                    Border Width (px)
                  </label>
                  <DebouncedInput
                    value={borderWidth}
                    onChange={onBorderWidthChange}
                    placeholder="0"
                    type="number"
                    className="h-8 text-xs bg-[#1e1e20]"
                    aria-label="Border width"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-muted-foreground block">
                    Border Radius (px)
                  </label>
                  <DebouncedInput
                    value={borderRadius}
                    onChange={onBorderRadiusChange}
                    placeholder="0"
                    type="number"
                    className="h-8 text-xs bg-[#1e1e20]"
                    aria-label="Border radius"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
);

AppearanceSection.displayName = "AppearanceSection";
