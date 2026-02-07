import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SliderControl } from "@/components/editor/controls/SliderControl";

interface TransformsSectionProps {
  // 2D Transforms
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
  skewX: number;
  skewY: number;
  // 3D Transforms
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  perspective: number;
  // Callbacks
  onTranslateXChange: (value: number) => void;
  onTranslateYChange: (value: number) => void;
  onRotateChange: (value: number) => void;
  onScaleChange: (value: number) => void;
  onSkewXChange: (value: number) => void;
  onSkewYChange: (value: number) => void;
  onRotateXChange: (value: number) => void;
  onRotateYChange: (value: number) => void;
  onRotateZChange: (value: number) => void;
  onPerspectiveChange: (value: number) => void;
  // UI State
  expanded?: boolean;
  onToggleExpand?: () => void;
}

/**
 * TransformsSection - Manage 2D and 3D transformations
 * Features:
 * - 2D transforms: translate, rotate, scale, skew
 * - 3D transforms: rotateX, rotateY, rotateZ, perspective
 * - Separate expandable sections for 2D and 3D
 * - Real-time slider feedback
 */
export const TransformsSection: React.FC<TransformsSectionProps> = React.memo(
  ({
    translateX,
    translateY,
    rotate,
    scale,
    skewX,
    skewY,
    rotateX,
    rotateY,
    rotateZ,
    perspective,
    onTranslateXChange,
    onTranslateYChange,
    onRotateChange,
    onScaleChange,
    onSkewXChange,
    onSkewYChange,
    onRotateXChange,
    onRotateYChange,
    onRotateZChange,
    onPerspectiveChange,
    expanded = false,
    onToggleExpand,
  }) => {
    return (
      <Accordion
        type="single"
        value={expanded ? "transforms" : ""}
        onValueChange={() => onToggleExpand?.()}
      >
        <AccordionItem
          value="transforms"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={onToggleExpand}
          >
            Transforms
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-6">
            {/* 2D Transforms Section */}
            <div className="space-y-3">
              <h4 className="text-[9px] font-bold text-muted-foreground">
                2D Transforms
              </h4>

              <SliderControl
                label="Translate X"
                value={translateX}
                min={-200}
                max={200}
                step={5}
                unit="px"
                onChange={onTranslateXChange}
                aria-label="Translate X"
              />

              <SliderControl
                label="Translate Y"
                value={translateY}
                min={-200}
                max={200}
                step={5}
                unit="px"
                onChange={onTranslateYChange}
                aria-label="Translate Y"
              />

              <SliderControl
                label="Rotate"
                value={rotate}
                min={-180}
                max={180}
                step={5}
                unit="°"
                onChange={onRotateChange}
                aria-label="Rotate"
              />

              <SliderControl
                label="Scale"
                value={scale}
                min={0}
                max={200}
                step={5}
                unit="%"
                onChange={onScaleChange}
                precision={0}
                aria-label="Scale"
              />

              <SliderControl
                label="Skew X"
                value={skewX}
                min={-45}
                max={45}
                step={2}
                unit="°"
                onChange={onSkewXChange}
                aria-label="Skew X"
              />

              <SliderControl
                label="Skew Y"
                value={skewY}
                min={-45}
                max={45}
                step={2}
                unit="°"
                onChange={onSkewYChange}
                aria-label="Skew Y"
              />
            </div>

            {/* 3D Transforms Section */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <h4 className="text-[9px] font-bold text-muted-foreground">
                3D Transforms
              </h4>

              <SliderControl
                label="Rotate X"
                value={rotateX}
                min={-180}
                max={180}
                step={5}
                unit="°"
                onChange={onRotateXChange}
                aria-label="Rotate X"
              />

              <SliderControl
                label="Rotate Y"
                value={rotateY}
                min={-180}
                max={180}
                step={5}
                unit="°"
                onChange={onRotateYChange}
                aria-label="Rotate Y"
              />

              <SliderControl
                label="Rotate Z"
                value={rotateZ}
                min={-180}
                max={180}
                step={5}
                unit="°"
                onChange={onRotateZChange}
                aria-label="Rotate Z"
              />

              <SliderControl
                label="Perspective"
                value={perspective}
                min={0}
                max={10}
                step={1}
                unit="00px"
                onChange={onPerspectiveChange}
                precision={0}
                aria-label="Perspective"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
);

TransformsSection.displayName = "TransformsSection";
