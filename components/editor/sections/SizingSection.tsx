import React, { useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DebouncedInput } from "@/components/editor/core/DebouncedInput";

interface SizingSectionProps {
  width: string;
  height: string;
  maxWidth: string;
  maxHeight: string;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onMaxWidthChange: (value: string) => void;
  onMaxHeightChange: (value: string) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

/**
 * SizingSection - Manage element dimensions
 * Features:
 * - Width input with flexible units
 * - Height input with flexible units
 * - Max-width and max-height constraints
 * - Supports px, %, auto, or arbitrary values
 */
export const SizingSection: React.FC<SizingSectionProps> = React.memo(
  ({
    width,
    height,
    maxWidth,
    maxHeight,
    onWidthChange,
    onHeightChange,
    onMaxWidthChange,
    onMaxHeightChange,
    expanded = false,
    onToggleExpand,
  }) => {
    return (
      <Accordion
        type="single"
        value={expanded ? "sizing" : ""}
        onValueChange={() => onToggleExpand?.()}
      >
        <AccordionItem
          value="sizing"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={onToggleExpand}
          >
            Sizing
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-3">
            {/* Width & Height Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-muted-foreground block">
                  Width
                </label>
                <DebouncedInput
                  value={width}
                  onChange={onWidthChange}
                  placeholder="auto"
                  className="h-8 text-xs bg-[#1e1e20]"
                  aria-label="Element width"
                />
                <div className="text-[8px] text-muted-foreground">
                  px, %, or auto
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-muted-foreground block">
                  Height
                </label>
                <DebouncedInput
                  value={height}
                  onChange={onHeightChange}
                  placeholder="auto"
                  className="h-8 text-xs bg-[#1e1e20]"
                  aria-label="Element height"
                />
                <div className="text-[8px] text-muted-foreground">
                  px, %, or auto
                </div>
              </div>
            </div>

            {/* Max Width & Max Height Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-muted-foreground block">
                  Max Width
                </label>
                <DebouncedInput
                  value={maxWidth}
                  onChange={onMaxWidthChange}
                  placeholder="none"
                  className="h-8 text-xs bg-[#1e1e20]"
                  aria-label="Element max width"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-muted-foreground block">
                  Max Height
                </label>
                <DebouncedInput
                  value={maxHeight}
                  onChange={onMaxHeightChange}
                  placeholder="none"
                  className="h-8 text-xs bg-[#1e1e20]"
                  aria-label="Element max height"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
);

SizingSection.displayName = "SizingSection";
