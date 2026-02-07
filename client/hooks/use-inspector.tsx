'use client';

import * as React from "react";
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext,
} from "react";

/**
 * HTML Element Tag Union Type
 * Supported semantic HTML tags for the inspector
 */
export type ElementTag =
  | "div"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "nav"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "button"
  | "a"
  | "ul"
  | "ol"
  | "li";

/**
 * Background Type Union
 * Supports solid colors, linear and radial gradients
 */
export type BackgroundType = "solid" | "linear" | "radial";

/**
 * Extended Inspector State with complete CSS properties support
 * Fully typed and organized by category
 */
export interface InspectorState {
  // Element properties
  elementId: string;
  elementTag: ElementTag;
  textContent: string;
  link: string;

  // Dimensions
  size: {
    width: string;
    height: string;
    maxWidth: string;
    maxHeight: string;
  };

  // Spacing
  margin: {
    left: string;
    top: string;
    right: string;
    bottom: string;
  };
  padding: {
    left: string;
    top: string;
    right: string;
    bottom: string;
  };

  // Typography
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    letterSpacing: string;
    lineHeight: string;
    textAlign: "left" | "center" | "right" | "justify";
  };

  // Background with gradient support
  background: {
    type: BackgroundType;
    color: string; // solid color or fallback
    gradient?: {
      from: string;
      to: string;
      angle?: number; // for linear gradients (0-360)
      shape?: "circle" | "ellipse"; // for radial gradients
    };
  };

  // Border styling
  border: {
    color: string;
    width: string;
    radius: string;
  };

  // 2D Transforms
  transforms: {
    translateX: number;
    translateY: number;
    rotate: number; // in degrees
    scale: number; // 0-200 (percentage)
    skewX: number; // in degrees
    skewY: number; // in degrees
  };

  // 3D Transforms
  transforms3d: {
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    perspective: number; // in pixels
  };

  // Effects
  opacity: number; // 0-100 (percentage)
  blur: number; // in pixels
  backdropBlur: number; // in pixels

  // Tailwind & Breakpoints
  tailwindClasses: string;
  breakpoint: "auto" | "base" | "sm" | "md" | "lg" | "xl" | "2xl";
}

interface InspectorContextType {
  state: InspectorState;
  updateState: <K extends keyof InspectorState>(
    key: K,
    value: InspectorState[K],
  ) => void;
  updateNestedState: <K extends keyof InspectorState>(
    key: K,
    nestedKey: keyof InspectorState[K],
    value: any,
  ) => void;
  generatedCode: string;
  generatedTailwind: string;
  resetState: () => void;
  history: InspectorState[];
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const defaultState: InspectorState = {
  elementId: "aura-emgn5hp8g9knbc3d",
  elementTag: "h2",
  textContent: "Layers",
  link: "",
  size: {
    width: "",
    height: "",
    maxWidth: "",
    maxHeight: "",
  },
  margin: { left: "", top: "", right: "", bottom: "" },
  padding: { left: "2", top: "", right: "2", bottom: "3" },
  typography: {
    fontFamily: "inter",
    fontSize: "18",
    fontWeight: "semibold",
    letterSpacing: "tight",
    lineHeight: "normal",
    textAlign: "left",
  },
  background: {
    type: "solid",
    color: "",
  },
  border: { color: "", width: "", radius: "" },
  transforms: {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    scale: 100,
    skewX: 0,
    skewY: 0,
  },
  transforms3d: {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    perspective: 0,
  },
  opacity: 100,
  blur: 0,
  backdropBlur: 0,
  tailwindClasses:
    "px-2 pb-3 text-[18px] md:text-[20px] font-semibold tracking-tight",
  breakpoint: "auto",
};

const InspectorContext = createContext<InspectorContextType | null>(null);

export const useInspector = () => {
  const context = useContext(InspectorContext);
  if (!context) {
    throw new Error("useInspector must be used within InspectorProvider");
  }
  return context;
};

/**
 * Generate Tailwind classes from inspector state
 * Supports arbitrary values for custom dimensions
 * Applies breakpoint prefixes when needed
 */
const generateTailwindClasses = (state: InspectorState): string => {
  const classes: string[] = [];
  const bp =
    state.breakpoint === "auto" || state.breakpoint === "base"
      ? ""
      : `${state.breakpoint}:`;

  // Padding
  if (state.padding.left) classes.push(`${bp}pl-${state.padding.left}`);
  if (state.padding.top) classes.push(`${bp}pt-${state.padding.top}`);
  if (state.padding.right) classes.push(`${bp}pr-${state.padding.right}`);
  if (state.padding.bottom) classes.push(`${bp}pb-${state.padding.bottom}`);

  // Margin
  if (state.margin.left) classes.push(`${bp}ml-${state.margin.left}`);
  if (state.margin.top) classes.push(`${bp}mt-${state.margin.top}`);
  if (state.margin.right) classes.push(`${bp}mr-${state.margin.right}`);
  if (state.margin.bottom) classes.push(`${bp}mb-${state.margin.bottom}`);

  // Sizing
  if (state.size.width) classes.push(`${bp}w-[${state.size.width}px]`);
  if (state.size.height) classes.push(`${bp}h-[${state.size.height}px]`);
  if (state.size.maxWidth)
    classes.push(`${bp}max-w-[${state.size.maxWidth}px]`);
  if (state.size.maxHeight)
    classes.push(`${bp}max-h-[${state.size.maxHeight}px]`);

  // Typography
  if (state.typography.fontSize)
    classes.push(`${bp}text-[${state.typography.fontSize}px]`);
  if (state.typography.fontWeight)
    classes.push(`${bp}font-${state.typography.fontWeight}`);
  if (state.typography.letterSpacing)
    classes.push(`${bp}tracking-${state.typography.letterSpacing}`);
  if (state.typography.lineHeight)
    classes.push(`${bp}leading-${state.typography.lineHeight}`);
  if (state.typography.textAlign)
    classes.push(`${bp}text-${state.typography.textAlign}`);

  // 2D Transforms
  if (state.transforms.translateX !== 0)
    classes.push(`${bp}translate-x-[${state.transforms.translateX}px]`);
  if (state.transforms.translateY !== 0)
    classes.push(`${bp}translate-y-[${state.transforms.translateY}px]`);
  if (state.transforms.rotate !== 0)
    classes.push(`${bp}rotate-[${state.transforms.rotate}deg]`);
  if (state.transforms.scale !== 100)
    classes.push(`${bp}scale-[${(state.transforms.scale / 100).toFixed(2)}]`);
  if (state.transforms.skewX !== 0)
    classes.push(`${bp}skew-x-[${state.transforms.skewX}deg]`);
  if (state.transforms.skewY !== 0)
    classes.push(`${bp}skew-y-[${state.transforms.skewY}deg]`);

  // 3D Transforms (requires inline styles, represented in Tailwind arbitrary values)
  if (state.transforms3d.rotateX !== 0)
    classes.push(`${bp}[transform:rotateX(${state.transforms3d.rotateX}deg)]`);
  if (state.transforms3d.rotateY !== 0)
    classes.push(`${bp}[transform:rotateY(${state.transforms3d.rotateY}deg)]`);
  if (state.transforms3d.rotateZ !== 0)
    classes.push(`${bp}[transform:rotateZ(${state.transforms3d.rotateZ}deg)]`);
  if (state.transforms3d.perspective !== 0)
    classes.push(
      `${bp}[perspective:${state.transforms3d.perspective * 100}px]`,
    );

  // Effects
  if (state.opacity !== 100)
    classes.push(`${bp}opacity-[${(state.opacity / 100).toFixed(2)}]`);
  if (state.blur && state.blur > 0) classes.push(`${bp}blur-[${state.blur}px]`);
  if (state.backdropBlur && state.backdropBlur > 0)
    classes.push(`${bp}backdrop-blur-[${state.backdropBlur}px]`);

  // Background
  if (state.background.type === "solid" && state.background.color) {
    classes.push(`${bp}bg-[${state.background.color}]`);
  } else if (state.background.type === "linear" && state.background.gradient) {
    const angle = state.background.gradient.angle ?? 90;
    const from = state.background.gradient.from;
    const to = state.background.gradient.to;
    classes.push(
      `${bp}bg-gradient-to-r`,
      `${bp}[background:linear-gradient(${angle}deg,${from},${to})]`,
    );
  } else if (state.background.type === "radial" && state.background.gradient) {
    const from = state.background.gradient.from;
    const to = state.background.gradient.to;
    const shape = state.background.gradient.shape ?? "circle";
    classes.push(`${bp}[background:radial-gradient(${shape},${from},${to})]`);
  }

  // Border
  if (state.border.color) classes.push(`${bp}border-[${state.border.color}]`);
  if (state.border.width) classes.push(`${bp}border-[${state.border.width}px]`);
  if (state.border.radius)
    classes.push(`${bp}rounded-[${state.border.radius}px]`);

  // Remove duplicates and filter empty strings
  return classes
    .filter((cls, i, arr) => arr.indexOf(cls) === i && cls.trim())
    .join(" ");
};

/**
 * Generate semantic HTML code from inspector state
 * Includes proper tag wrapping, link wrapper if needed, and generated classes
 */
const generateHTMLCode = (state: InspectorState, tailwind: string): string => {
  const tag = state.elementTag;
  const content = state.textContent || "Content";
  const link = state.link;
  const classes = tailwind.trim();

  // Wrap in link if href is provided
  if (link) {
    return `<a href="${link}" class="inline-block">\n  <${tag} class="${classes}">\n    ${content}\n  </${tag}>\n</a>`;
  }

  // Standard element
  return `<${tag} class="${classes}">\n  ${content}\n</${tag}>`;
};

const MAX_HISTORY = 20;
const LOCALSTORAGE_DEBOUNCE_MS = 300;

export const InspectorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<InspectorState>(() => {
    if (typeof window === "undefined") return defaultState;
    try {
      const saved = localStorage.getItem("inspector-state");
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch (error) {
      console.error("Failed to load inspector state from localStorage:", error);
      return defaultState;
    }
  });

  const [history, setHistory] = useState<InspectorState[]>([]);
  const [future, setFuture] = useState<InspectorState[]>([]);
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Persist state to localStorage with debounce
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem("inspector-state", JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save inspector state to localStorage:", error);
      }
    }, LOCALSTORAGE_DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [state]);

  /**
   * Update top-level state property
   * Automatically adds current state to history (stack-based undo)
   */
  const updateState = useCallback(
    <K extends keyof InspectorState>(key: K, value: InspectorState[K]) => {
      setState((prev) => {
        setHistory((h) => [...h.slice(-(MAX_HISTORY - 1)), prev]);
        setFuture([]); // Clear redo stack on new change
        return { ...prev, [key]: value };
      });
    },
    [],
  );

  /**
   * Update nested object property (e.g., padding.left, transforms.rotate)
   * Automatically adds current state to history
   */
  const updateNestedState = useCallback(
    <K extends keyof InspectorState>(
      key: K,
      nestedKey: keyof InspectorState[K],
      value: any,
    ) => {
      setState((prev) => {
        setHistory((h) => [...h.slice(-(MAX_HISTORY - 1)), prev]);
        setFuture([]); // Clear redo stack on new change
        return {
          ...prev,
          [key]: {
            ...(prev[key] as object),
            [nestedKey]: value,
          },
        };
      });
    },
    [],
  );

  /**
   * Reset state to default values
   * Clears localStorage and history
   */
  const resetState = useCallback(() => {
    setHistory((h) => [...h.slice(-(MAX_HISTORY - 1)), state]);
    setState(defaultState);
    try {
      localStorage.removeItem("inspector-state");
    } catch (error) {
      console.error(
        "Failed to clear inspector state from localStorage:",
        error,
      );
    }
  }, [state]);

  /**
   * Undo last state change
   * Pops from history stack
   */
  const undo = useCallback(() => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setHistory((h) => h.slice(0, -1));
      setState((current) => {
        setFuture((f) => [...f, current]);
        return previousState;
      });
    }
  }, [history]);

  const redo = useCallback(() => {
    if (future.length > 0) {
      const nextState = future[future.length - 1];
      setFuture((f) => f.slice(0, -1));
      setState((current) => {
        setHistory((h) => [...h.slice(-(MAX_HISTORY - 1)), current]);
        return nextState;
      });
    }
  }, [future]);

  const generatedTailwind = useMemo(
    () => generateTailwindClasses(state),
    [state],
  );

  const generatedCode = useMemo(
    () => generateHTMLCode(state, state.tailwindClasses || generatedTailwind),
    [state, generatedTailwind],
  );

  const canUndo = useMemo(() => history.length > 0, [history.length]);
  const canRedo = useMemo(() => future.length > 0, [future.length]);

  const contextValue = useMemo<InspectorContextType>(
    () => ({
      state,
      updateState,
      updateNestedState,
      generatedCode,
      generatedTailwind,
      resetState,
      history,
      undo,
      redo,
      canUndo,
      canRedo,
    }),
    [
      state,
      updateState,
      updateNestedState,
      generatedCode,
      generatedTailwind,
      resetState,
      history,
      undo,
      redo,
      canUndo,
      canRedo,
    ],
  );

  return (
    <InspectorContext.Provider value={contextValue}>
      {children}
    </InspectorContext.Provider>
  );
};
