import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SliderControl } from "@/components/editor/controls/SliderControl";

interface EffectsSectionProps {
  opacity: number;
  blur: number;
  backdropBlur: number;
  onOpacityChange: (value: number) => void;
  onBlurChange: (value: number) => void;
  onBackdropBlurChange: (value: number) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

/**
 * EffectsSection - Manage visual effects
 * Features:
 * - Opacity control (0-100%)
 * - Blur effect control (0-40px)
 * - Backdrop blur effect control (0-40px)
 * - Real-time visual feedback
 */
export const EffectsSection: React.FC<EffectsSectionProps> = React.memo(
  ({
    opacity,
    blur,
    backdropBlur,
    onOpacityChange,
    onBlurChange,
    onBackdropBlurChange,
    expanded = false,
    onToggleExpand,
  }) => {
    return (
      <Accordion
        type="single"
        value={expanded ? "effects" : ""}
        onValueChange={() => onToggleExpand?.()}
      >
        <AccordionItem
          value="effects"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={onToggleExpand}
          >
            Effects
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-4">
            <SliderControl
              label="Opacity"
              value={opacity}
              min={0}
              max={100}
              step={5}
              unit="%"
              onChange={onOpacityChange}
              precision={0}
              aria-label="Element opacity"
            />

            <SliderControl
              label="Blur"
              value={blur}
              min={0}
              max={40}
              step={2}
              unit="px"
              onChange={onBlurChange}
              precision={0}
              aria-label="Blur effect"
            />

            <SliderControl
              label="Backdrop Blur"
              value={backdropBlur}
              min={0}
              max={40}
              step={2}
              unit="px"
              onChange={onBackdropBlurChange}
              precision={0}
              aria-label="Backdrop blur effect"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
);

EffectsSection.displayName = "EffectsSection";
