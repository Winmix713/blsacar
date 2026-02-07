import { useMemo } from "react";
import type { InspectorState } from "./use-inspector";

/**
 * Property group definitions
 * Groups related properties together for better organization in UI
 */
export interface PropertyGroup {
  id: string;
  label: string;
  description?: string;
  properties: string[];
  icon?: string; // Optional icon identifier for UI
}

/**
 * All available property groups for the inspector
 */
const PROPERTY_GROUPS: Record<string, PropertyGroup> = {
  content: {
    id: "content",
    label: "Content",
    description: "Element content and linking",
    properties: ["elementTag", "textContent", "link"],
    icon: "type",
  },
  sizing: {
    id: "sizing",
    label: "Sizing",
    description: "Dimensions and constraints",
    properties: [
      "size.width",
      "size.height",
      "size.maxWidth",
      "size.maxHeight",
    ],
    icon: "square",
  },
  spacing: {
    id: "spacing",
    label: "Spacing",
    description: "Padding and margin",
    properties: [
      "padding.top",
      "padding.right",
      "padding.bottom",
      "padding.left",
      "margin.top",
      "margin.right",
      "margin.bottom",
      "margin.left",
    ],
    icon: "spacing",
  },
  typography: {
    id: "typography",
    label: "Typography",
    description: "Font and text styling",
    properties: [
      "typography.fontFamily",
      "typography.fontSize",
      "typography.fontWeight",
      "typography.textAlign",
      "typography.lineHeight",
      "typography.letterSpacing",
    ],
    icon: "type",
  },
  appearance: {
    id: "appearance",
    label: "Appearance",
    description: "Background, border, and colors",
    properties: [
      "background.type",
      "background.color",
      "background.gradient",
      "border.color",
      "border.width",
      "border.radius",
    ],
    icon: "palette",
  },
  transforms2d: {
    id: "transforms2d",
    label: "2D Transforms",
    description: "Two-dimensional transformations",
    properties: [
      "transforms.translateX",
      "transforms.translateY",
      "transforms.rotate",
      "transforms.scale",
      "transforms.skewX",
      "transforms.skewY",
    ],
    icon: "move",
  },
  transforms3d: {
    id: "transforms3d",
    label: "3D Transforms",
    description: "Three-dimensional transformations",
    properties: [
      "transforms3d.rotateX",
      "transforms3d.rotateY",
      "transforms3d.rotateZ",
      "transforms3d.perspective",
    ],
    icon: "cube",
  },
  effects: {
    id: "effects",
    label: "Effects",
    description: "Opacity and blur effects",
    properties: ["opacity", "blur", "backdropBlur"],
    icon: "sparkles",
  },
};

/**
 * usePropertyGroups - Provides organized property groups
 * Returns all available groups and helper functions for working with them
 */
export const usePropertyGroups = () => {
  const groups = useMemo(() => PROPERTY_GROUPS, []);

  /**
   * Get a specific group by ID
   */
  const getGroup = (groupId: string): PropertyGroup | undefined => {
    return groups[groupId];
  };

  /**
   * Get all groups
   */
  const getAllGroups = (): PropertyGroup[] => {
    return Object.values(groups);
  };

  /**
   * Get groups in recommended order for display
   */
  const getGroupsInOrder = (): PropertyGroup[] => {
    const order = [
      "content",
      "sizing",
      "spacing",
      "typography",
      "appearance",
      "transforms2d",
      "transforms3d",
      "effects",
    ];
    return order.map((id) => groups[id]).filter(Boolean);
  };

  /**
   * Check if a property belongs to a group
   */
  const isPropertyInGroup = (groupId: string, property: string): boolean => {
    const group = groups[groupId];
    return group ? group.properties.includes(property) : false;
  };

  /**
   * Get all properties in a group
   */
  const getPropertiesInGroup = (groupId: string): string[] => {
    const group = groups[groupId];
    return group ? group.properties : [];
  };

  /**
   * Find which group a property belongs to
   */
  const findGroupForProperty = (
    property: string,
  ): PropertyGroup | undefined => {
    return Object.values(groups).find((group) =>
      group.properties.includes(property),
    );
  };

  /**
   * Get default expanded groups (for accordion initialization)
   */
  const getDefaultExpandedGroups = (): string[] => {
    return ["content", "sizing", "spacing"]; // Most commonly used
  };

  return {
    groups,
    getGroup,
    getAllGroups,
    getGroupsInOrder,
    isPropertyInGroup,
    getPropertiesInGroup,
    findGroupForProperty,
    getDefaultExpandedGroups,
  };
};

/**
 * Export group IDs as constants for type safety
 */
export const PROPERTY_GROUP_IDS = {
  CONTENT: "content",
  SIZING: "sizing",
  SPACING: "spacing",
  TYPOGRAPHY: "typography",
  APPEARANCE: "appearance",
  TRANSFORMS_2D: "transforms2d",
  TRANSFORMS_3D: "transforms3d",
  EFFECTS: "effects",
} as const;
