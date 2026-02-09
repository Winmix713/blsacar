import React, { useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DebouncedInput } from "@/components/editor/core/DebouncedInput";
import { BoxModelVisualizer } from "@/components/editor/controls/BoxModelVisualizer";

interface SpacingSectionProps {
  padding: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  margin: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  onPaddingChange: (
    side: "top" | "right" | "bottom" | "left",
    value: string,
  ) => void;
  onMarginChange: (
    side: "top" | "right" | "bottom" | "left",
    value: string,
  ) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

/**
 * SpacingSection - Manage padding and margin
 * Features:
 * - BoxModelVisualizer for visual representation
 * - Individual controls for each side (T, R, B, L)
 * - Separated padding and margin groups
 * - Real-time visual feedback
 */
export const SpacingSection: React.FC<SpacingSectionProps> = React.memo(
  ({
    padding,
    margin,
    onPaddingChange,
    onMarginChange,
    expanded = false,
    onToggleExpand,
  }) => {
    return (
      <Accordion
        type="single"
        value={expanded ? "spacing" : ""}
        onValueChange={() => onToggleExpand?.()}
      >
        <AccordionItem
          value="spacing"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={onToggleExpand}
          >
            Spacing
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-4">
            {/* Visual Box Model */}
            <BoxModelVisualizer
              padding={padding}
              margin={margin}
              showLabels={true}
            />

            {/* Padding Inputs */}
            <div className="space-y-2">
              <h4 className="text-[9px] font-bold text-muted-foreground">
                Padding
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[8px] text-muted-foreground">
                    Top
                  </label>
                  <DebouncedInput
                    value={padding.top}
                    onChange={(value) => onPaddingChange("top", value)}
                    placeholder="0"
                    className="h-7 text-[10px] bg-[#1e1e20]"
                    aria-label="Padding top"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-muted-foreground">
                    Right
                  </label>
                  <DebouncedInput
                    value={padding.right}
                    onChange={(value) => onPaddingChange("right", value)}
                    placeholder="0"
                    className="h-7 text-[10px] bg-[#1e1e20]"
                    aria-label="Padding right"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-muted-foreground">
                    Bottom
                  </label>
                  <DebouncedInput
                    value={padding.bottom}
                    onChange={(value) => onPaddingChange("bottom", value)}
                    placeholder="0"
                    className="h-7 text-[10px] bg-[#1e1e20]"
                    aria-label="Padding bottom"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-muted-foreground">
                    Left
                  </label>
                  <DebouncedInput
                    value={padding.left}
                    onChange={(value) => onPaddingChange("left", value)}
                    placeholder="0"
                    className="h-7 text-[10px] bg-[#1e1e20]"
                    aria-label="Padding left"
                  />
                </div>
              </div>
            </div>

            {/* Margin Inputs */}
            <div className="space-y-2">
              <h4 className="text-[9px] font-bold text-muted-foreground">
                Margin
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[8px] text-muted-foreground">
                    Top
                  </label>
                  <DebouncedInput
                    value={margin.top}
                    onChange={(value) => onMarginChange("top", value)}
                    placeholder="0"
                    className="h-7 text-[10px] bg-[#1e1e20]"
                    aria-label="Margin top"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-muted-foreground">
                    Right
                  </label>
                  <DebouncedInput
                    value={margin.right}
                    onChange={(value) => onMarginChange("right", value)}
                    placeholder="0"
                    className="h-7 text-[10px] bg-[#1e1e20]"
                    aria-label="Margin right"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-muted-foreground">
                    Bottom
                  </label>
                  <DebouncedInput
                    value={margin.bottom}
                    onChange={(value) => onMarginChange("bottom", value)}
                    placeholder="0"
                    className="h-7 text-[10px] bg-[#1e1e20]"
                    aria-label="Margin bottom"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-muted-foreground">
                    Left
                  </label>
                  <DebouncedInput
                    value={margin.left}
                    onChange={(value) => onMarginChange("left", value)}
                    placeholder="0"
                    className="h-7 text-[10px] bg-[#1e1e20]"
                    aria-label="Margin left"
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

SpacingSection.displayName = "SpacingSection";
