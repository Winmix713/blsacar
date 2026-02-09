import React, { useState, useCallback, useMemo } from "react";
import {
  useInspector,
  type ElementTag,
  type BackgroundType,
} from "@/hooks/use-inspector";
import { usePropertyGroups } from "@/hooks/usePropertyGroups";
import { ContentSection } from "@/components/editor/sections/ContentSection";
import { SizingSection } from "@/components/editor/sections/SizingSection";
import { SpacingSection } from "@/components/editor/sections/SpacingSection";
import { TypographySection } from "@/components/editor/sections/TypographySection";
import { AppearanceSection } from "@/components/editor/sections/AppearanceSection";
import { TransformsSection } from "@/components/editor/sections/TransformsSection";
import { EffectsSection } from "@/components/editor/sections/EffectsSection";

/**
 * EditTab - Main properties editor
 * Renders all property sections in organized accordion format
 * Features:
 * - All 7 property sections
 * - Expandable/collapsible accordion
 * - Real-time state updates
 * - Type-safe property handlers
 */
export const EditTab: React.FC = React.memo(() => {
  const { state, updateState, updateNestedState } = useInspector();
  const { getDefaultExpandedGroups } = usePropertyGroups();

  // Local state for expanded sections
  const [expandedSections, setExpandedSections] = useState<string[]>(
    getDefaultExpandedGroups(),
  );

  const handleToggleSection = useCallback((section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  }, []);

  // Handlers for Content Section
  const handleTagChange = useCallback(
    (tag: ElementTag) => {
      updateState("elementTag", tag);
    },
    [updateState],
  );

  const handleTextChange = useCallback(
    (text: string) => {
      updateState("textContent", text);
    },
    [updateState],
  );

  const handleLinkChange = useCallback(
    (link: string) => {
      updateState("link", link);
    },
    [updateState],
  );

  // Handlers for Sizing Section
  const handleWidthChange = useCallback(
    (value: string) => {
      updateNestedState("size", "width", value);
    },
    [updateNestedState],
  );

  const handleHeightChange = useCallback(
    (value: string) => {
      updateNestedState("size", "height", value);
    },
    [updateNestedState],
  );

  const handleMaxWidthChange = useCallback(
    (value: string) => {
      updateNestedState("size", "maxWidth", value);
    },
    [updateNestedState],
  );

  const handleMaxHeightChange = useCallback(
    (value: string) => {
      updateNestedState("size", "maxHeight", value);
    },
    [updateNestedState],
  );

  // Handlers for Spacing Section
  const handlePaddingChange = useCallback(
    (side: "top" | "right" | "bottom" | "left", value: string) => {
      updateNestedState("padding", side, value);
    },
    [updateNestedState],
  );

  const handleMarginChange = useCallback(
    (side: "top" | "right" | "bottom" | "left", value: string) => {
      updateNestedState("margin", side, value);
    },
    [updateNestedState],
  );

  // Handlers for Typography Section
  const handleFontFamilyChange = useCallback(
    (value: string) => {
      updateNestedState("typography", "fontFamily", value);
    },
    [updateNestedState],
  );

  const handleFontSizeChange = useCallback(
    (value: string) => {
      updateNestedState("typography", "fontSize", value);
    },
    [updateNestedState],
  );

  const handleFontWeightChange = useCallback(
    (value: string) => {
      updateNestedState("typography", "fontWeight", value);
    },
    [updateNestedState],
  );

  const handleTextAlignChange = useCallback(
    (value: "left" | "center" | "right" | "justify") => {
      updateNestedState("typography", "textAlign", value);
    },
    [updateNestedState],
  );

  const handleLineHeightChange = useCallback(
    (value: string) => {
      updateNestedState("typography", "lineHeight", value);
    },
    [updateNestedState],
  );

  const handleLetterSpacingChange = useCallback(
    (value: string) => {
      updateNestedState("typography", "letterSpacing", value);
    },
    [updateNestedState],
  );

  // Handlers for Appearance Section
  const handleBackgroundTypeChange = useCallback(
    (type: BackgroundType) => {
      updateNestedState("background", "type", type);
    },
    [updateNestedState],
  );

  const handleBackgroundColorChange = useCallback(
    (color: string) => {
      updateNestedState("background", "color", color);
    },
    [updateNestedState],
  );

  const handleGradientFromChange = useCallback(
    (color: string) => {
      const gradient = {
        ...(state.background.gradient || { from: "", to: "" }),
        from: color,
      };
      updateNestedState("background", "gradient", gradient);
    },
    [state.background.gradient, updateNestedState],
  );

  const handleGradientToChange = useCallback(
    (color: string) => {
      const gradient = {
        ...(state.background.gradient || { from: "", to: "" }),
        to: color,
      };
      updateNestedState("background", "gradient", gradient);
    },
    [state.background.gradient, updateNestedState],
  );

  const handleGradientAngleChange = useCallback(
    (angle: number) => {
      const gradient = {
        ...(state.background.gradient || { from: "", to: "" }),
        angle,
      };
      updateNestedState("background", "gradient", gradient);
    },
    [state.background.gradient, updateNestedState],
  );

  const handleBorderColorChange = useCallback(
    (color: string) => {
      updateNestedState("border", "color", color);
    },
    [updateNestedState],
  );

  const handleBorderWidthChange = useCallback(
    (width: string) => {
      updateNestedState("border", "width", width);
    },
    [updateNestedState],
  );

  const handleBorderRadiusChange = useCallback(
    (radius: string) => {
      updateNestedState("border", "radius", radius);
    },
    [updateNestedState],
  );

  // Handlers for Transforms Section
  const handleTranslateXChange = useCallback(
    (value: number) => {
      updateNestedState("transforms", "translateX", value);
    },
    [updateNestedState],
  );

  const handleTranslateYChange = useCallback(
    (value: number) => {
      updateNestedState("transforms", "translateY", value);
    },
    [updateNestedState],
  );

  const handleRotateChange = useCallback(
    (value: number) => {
      updateNestedState("transforms", "rotate", value);
    },
    [updateNestedState],
  );

  const handleScaleChange = useCallback(
    (value: number) => {
      updateNestedState("transforms", "scale", value);
    },
    [updateNestedState],
  );

  const handleSkewXChange = useCallback(
    (value: number) => {
      updateNestedState("transforms", "skewX", value);
    },
    [updateNestedState],
  );

  const handleSkewYChange = useCallback(
    (value: number) => {
      updateNestedState("transforms", "skewY", value);
    },
    [updateNestedState],
  );

  const handleRotateXChange = useCallback(
    (value: number) => {
      updateNestedState("transforms3d", "rotateX", value);
    },
    [updateNestedState],
  );

  const handleRotateYChange = useCallback(
    (value: number) => {
      updateNestedState("transforms3d", "rotateY", value);
    },
    [updateNestedState],
  );

  const handleRotateZChange = useCallback(
    (value: number) => {
      updateNestedState("transforms3d", "rotateZ", value);
    },
    [updateNestedState],
  );

  const handlePerspectiveChange = useCallback(
    (value: number) => {
      updateNestedState("transforms3d", "perspective", value);
    },
    [updateNestedState],
  );

  // Handlers for Effects Section
  const handleOpacityChange = useCallback(
    (value: number) => {
      updateState("opacity", value);
    },
    [updateState],
  );

  const handleBlurChange = useCallback(
    (value: number) => {
      updateState("blur", value);
    },
    [updateState],
  );

  const handleBackdropBlurChange = useCallback(
    (value: number) => {
      updateState("backdropBlur", value);
    },
    [updateState],
  );

  return (
    <div className="space-y-3 pb-4">
      {/* Content Section */}
      <ContentSection
        elementTag={state.elementTag}
        textContent={state.textContent}
        link={state.link}
        onTagChange={handleTagChange}
        onTextChange={handleTextChange}
        onLinkChange={handleLinkChange}
        expanded={expandedSections.includes("content")}
        onToggleExpand={() => handleToggleSection("content")}
      />

      {/* Sizing Section */}
      <SizingSection
        width={state.size.width}
        height={state.size.height}
        maxWidth={state.size.maxWidth}
        maxHeight={state.size.maxHeight}
        onWidthChange={handleWidthChange}
        onHeightChange={handleHeightChange}
        onMaxWidthChange={handleMaxWidthChange}
        onMaxHeightChange={handleMaxHeightChange}
        expanded={expandedSections.includes("sizing")}
        onToggleExpand={() => handleToggleSection("sizing")}
      />

      {/* Spacing Section */}
      <SpacingSection
        padding={state.padding}
        margin={state.margin}
        onPaddingChange={handlePaddingChange}
        onMarginChange={handleMarginChange}
        expanded={expandedSections.includes("spacing")}
        onToggleExpand={() => handleToggleSection("spacing")}
      />

      {/* Typography Section */}
      <TypographySection
        fontFamily={state.typography.fontFamily}
        fontSize={state.typography.fontSize}
        fontWeight={state.typography.fontWeight}
        textAlign={state.typography.textAlign}
        lineHeight={state.typography.lineHeight}
        letterSpacing={state.typography.letterSpacing}
        onFontFamilyChange={handleFontFamilyChange}
        onFontSizeChange={handleFontSizeChange}
        onFontWeightChange={handleFontWeightChange}
        onTextAlignChange={handleTextAlignChange}
        onLineHeightChange={handleLineHeightChange}
        onLetterSpacingChange={handleLetterSpacingChange}
        expanded={expandedSections.includes("typography")}
        onToggleExpand={() => handleToggleSection("typography")}
      />

      {/* Appearance Section */}
      <AppearanceSection
        backgroundType={state.background.type}
        backgroundColor={state.background.color}
        gradientFrom={state.background.gradient?.from || ""}
        gradientTo={state.background.gradient?.to || ""}
        gradientAngle={state.background.gradient?.angle || 90}
        borderColor={state.border.color}
        borderWidth={state.border.width}
        borderRadius={state.border.radius}
        onBackgroundTypeChange={handleBackgroundTypeChange}
        onBackgroundColorChange={handleBackgroundColorChange}
        onGradientFromChange={handleGradientFromChange}
        onGradientToChange={handleGradientToChange}
        onGradientAngleChange={handleGradientAngleChange}
        onBorderColorChange={handleBorderColorChange}
        onBorderWidthChange={handleBorderWidthChange}
        onBorderRadiusChange={handleBorderRadiusChange}
        expanded={expandedSections.includes("appearance")}
        onToggleExpand={() => handleToggleSection("appearance")}
      />

      {/* Transforms Section */}
      <TransformsSection
        translateX={state.transforms.translateX}
        translateY={state.transforms.translateY}
        rotate={state.transforms.rotate}
        scale={state.transforms.scale}
        skewX={state.transforms.skewX}
        skewY={state.transforms.skewY}
        rotateX={state.transforms3d.rotateX}
        rotateY={state.transforms3d.rotateY}
        rotateZ={state.transforms3d.rotateZ}
        perspective={state.transforms3d.perspective}
        onTranslateXChange={handleTranslateXChange}
        onTranslateYChange={handleTranslateYChange}
        onRotateChange={handleRotateChange}
        onScaleChange={handleScaleChange}
        onSkewXChange={handleSkewXChange}
        onSkewYChange={handleSkewYChange}
        onRotateXChange={handleRotateXChange}
        onRotateYChange={handleRotateYChange}
        onRotateZChange={handleRotateZChange}
        onPerspectiveChange={handlePerspectiveChange}
        expanded={expandedSections.includes("transforms")}
        onToggleExpand={() => handleToggleSection("transforms")}
      />

      {/* Effects Section */}
      <EffectsSection
        opacity={state.opacity}
        blur={state.blur}
        backdropBlur={state.backdropBlur}
        onOpacityChange={handleOpacityChange}
        onBlurChange={handleBlurChange}
        onBackdropBlurChange={handleBackdropBlurChange}
        expanded={expandedSections.includes("effects")}
        onToggleExpand={() => handleToggleSection("effects")}
      />
    </div>
  );
});

EditTab.displayName = "EditTab";
