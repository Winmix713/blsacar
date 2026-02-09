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

interface TypographySectionProps {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  textAlign: "left" | "center" | "right" | "justify";
  lineHeight: string;
  letterSpacing: string;
  onFontFamilyChange: (value: string) => void;
  onFontSizeChange: (value: string) => void;
  onFontWeightChange: (value: string) => void;
  onTextAlignChange: (value: "left" | "center" | "right" | "justify") => void;
  onLineHeightChange: (value: string) => void;
  onLetterSpacingChange: (value: string) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const FONT_FAMILIES = [
  { value: "sans", label: "Sans-serif (System)" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Monospace" },
  { value: "inter", label: "Inter" },
];

const FONT_WEIGHTS = [
  { value: "", label: "Default" },
  { value: "thin", label: "Thin (100)" },
  { value: "light", label: "Light (300)" },
  { value: "normal", label: "Normal (400)" },
  { value: "medium", label: "Medium (500)" },
  { value: "semibold", label: "Semibold (600)" },
  { value: "bold", label: "Bold (700)" },
  { value: "extrabold", label: "Extrabold (800)" },
];

const TEXT_ALIGNS = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
  { value: "justify", label: "Justify" },
];

const LINE_HEIGHTS = [
  { value: "", label: "Default" },
  { value: "none", label: "None" },
  { value: "tight", label: "Tight" },
  { value: "snug", label: "Snug" },
  { value: "normal", label: "Normal" },
  { value: "relaxed", label: "Relaxed" },
  { value: "loose", label: "Loose" },
];

const LETTER_SPACINGS = [
  { value: "", label: "Default" },
  { value: "tighter", label: "Tighter" },
  { value: "tight", label: "Tight" },
  { value: "normal", label: "Normal" },
  { value: "wide", label: "Wide" },
  { value: "wider", label: "Wider" },
];

/**
 * TypographySection - Manage text styling properties
 * Features:
 * - Font family selection
 * - Font size input
 * - Font weight dropdown
 * - Text alignment selection
 * - Line height and letter spacing options
 */
export const TypographySection: React.FC<TypographySectionProps> = React.memo(
  ({
    fontFamily,
    fontSize,
    fontWeight,
    textAlign,
    lineHeight,
    letterSpacing,
    onFontFamilyChange,
    onFontSizeChange,
    onFontWeightChange,
    onTextAlignChange,
    onLineHeightChange,
    onLetterSpacingChange,
    expanded = false,
    onToggleExpand,
  }) => {
    const handleTextAlignChange = useCallback(
      (value: string) => {
        onTextAlignChange(value as "left" | "center" | "right" | "justify");
      },
      [onTextAlignChange],
    );

    return (
      <Accordion
        type="single"
        value={expanded ? "typography" : ""}
        onValueChange={() => onToggleExpand?.()}
      >
        <AccordionItem
          value="typography"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={onToggleExpand}
          >
            Typography
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-3">
            {/* Font Family */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-muted-foreground block">
                Font Family
              </label>
              <Select value={fontFamily} onValueChange={onFontFamilyChange}>
                <SelectTrigger className="h-8 text-xs bg-[#1e1e20]">
                  <SelectValue placeholder="Select font..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1c] border-white/10">
                  {FONT_FAMILIES.map((font) => (
                    <SelectItem
                      key={font.value}
                      value={font.value}
                      className="text-xs"
                    >
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-muted-foreground block">
                Font Size (px)
              </label>
              <DebouncedInput
                value={fontSize}
                onChange={onFontSizeChange}
                placeholder="16"
                type="number"
                className="h-8 text-xs bg-[#1e1e20]"
                aria-label="Font size"
              />
            </div>

            {/* Font Weight & Text Align Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-muted-foreground block">
                  Font Weight
                </label>
                <Select value={fontWeight} onValueChange={onFontWeightChange}>
                  <SelectTrigger className="h-8 text-xs bg-[#1e1e20]">
                    <SelectValue placeholder="Weight..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1c] border-white/10">
                    {FONT_WEIGHTS.map((weight) => (
                      <SelectItem
                        key={weight.value}
                        value={weight.value}
                        className="text-xs"
                      >
                        {weight.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-muted-foreground block">
                  Text Align
                </label>
                <Select value={textAlign} onValueChange={handleTextAlignChange}>
                  <SelectTrigger className="h-8 text-xs bg-[#1e1e20]">
                    <SelectValue placeholder="Align..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1c] border-white/10">
                    {TEXT_ALIGNS.map((align) => (
                      <SelectItem
                        key={align.value}
                        value={align.value}
                        className="text-xs"
                      >
                        {align.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Line Height & Letter Spacing Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-muted-foreground block">
                  Line Height
                </label>
                <Select value={lineHeight} onValueChange={onLineHeightChange}>
                  <SelectTrigger className="h-8 text-xs bg-[#1e1e20]">
                    <SelectValue placeholder="Leading..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1c] border-white/10">
                    {LINE_HEIGHTS.map((height) => (
                      <SelectItem
                        key={height.value}
                        value={height.value}
                        className="text-xs"
                      >
                        {height.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-muted-foreground block">
                  Letter Spacing
                </label>
                <Select
                  value={letterSpacing}
                  onValueChange={onLetterSpacingChange}
                >
                  <SelectTrigger className="h-8 text-xs bg-[#1e1e20]">
                    <SelectValue placeholder="Tracking..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1c] border-white/10">
                    {LETTER_SPACINGS.map((spacing) => (
                      <SelectItem
                        key={spacing.value}
                        value={spacing.value}
                        className="text-xs"
                      >
                        {spacing.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
);

TypographySection.displayName = "TypographySection";
