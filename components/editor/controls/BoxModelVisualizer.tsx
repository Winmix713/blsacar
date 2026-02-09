import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface BoxModelVisualizerProps {
  margin?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  padding?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  className?: string;
  showLabels?: boolean;
  interactive?: boolean;
  onSideClick?: (side: "top" | "right" | "bottom" | "left") => void;
}

/**
 * BoxModelVisualizer - Visual representation of CSS box model
 * Features:
 * - Visual display of margin and padding
 * - Color-coded layers
 * - Optional interactive mode for clicking sides
 * - Responsive sizing
 */
export const BoxModelVisualizer: React.FC<BoxModelVisualizerProps> = React.memo(
  ({
    margin = { top: "", right: "", bottom: "", left: "" },
    padding = { top: "", right: "", bottom: "", left: "" },
    className,
    showLabels = true,
    interactive = false,
    onSideClick,
  }) => {
    // Convert margin values to pixels for visualization
    const marginValues = useMemo(() => {
      const parseValue = (val: string) => {
        const num = parseInt(val);
        return isNaN(num) ? 4 : Math.min(Math.max(num / 2, 2), 24);
      };
      return {
        top: parseValue(margin.top),
        right: parseValue(margin.right),
        bottom: parseValue(margin.bottom),
        left: parseValue(margin.left),
      };
    }, [margin]);

    const paddingValues = useMemo(() => {
      const parseValue = (val: string) => {
        const num = parseInt(val);
        return isNaN(num) ? 4 : Math.min(Math.max(num / 2, 2), 24);
      };
      return {
        top: parseValue(padding.top),
        right: parseValue(padding.right),
        bottom: parseValue(padding.bottom),
        left: parseValue(padding.left),
      };
    }, [padding]);

    return (
      <div
        className={cn(
          "flex items-center justify-center p-4 rounded-xl bg-[#1e1e20] border border-white/5",
          className,
        )}
      >
        {/* Margin Layer */}
        <div
          className={cn("border-2 border-dashed border-orange-500/40", {
            "cursor-pointer hover:border-orange-500/60": interactive,
          })}
          style={{
            padding: `${marginValues.top}px ${marginValues.right}px ${marginValues.bottom}px ${marginValues.left}px`,
          }}
          onClick={
            interactive && onSideClick ? () => onSideClick("top") : undefined
          }
        >
          {/* Padding Layer */}
          <div
            className={cn(
              "relative border-2 border-dashed border-blue-500/40",
              {
                "cursor-pointer hover:border-blue-500/60": interactive,
              },
            )}
            style={{
              padding: `${paddingValues.top}px ${paddingValues.right}px ${paddingValues.bottom}px ${paddingValues.left}px`,
            }}
          >
            {/* Content Box */}
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 border border-primary/50 rounded-md flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary text-center">
                Content
              </span>
            </div>

            {/* Labels */}
            {showLabels && (
              <>
                {/* Margin Labels */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-[8px] text-orange-500/60 font-bold">
                  {margin.top || "-"}
                </div>
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 text-[8px] text-orange-500/60 font-bold">
                  {margin.right || "-"}
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[8px] text-orange-500/60 font-bold">
                  {margin.bottom || "-"}
                </div>
                <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 text-[8px] text-orange-500/60 font-bold">
                  {margin.left || "-"}
                </div>

                {/* Padding Labels */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-[8px] text-blue-500/60 font-bold">
                    {padding.top || "-"}
                  </div>
                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-[8px] text-blue-500/60 font-bold">
                    {padding.right || "-"}
                  </div>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-[8px] text-blue-500/60 font-bold">
                    {padding.bottom || "-"}
                  </div>
                  <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-[8px] text-blue-500/60 font-bold">
                    {padding.left || "-"}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
);

BoxModelVisualizer.displayName = "BoxModelVisualizer";
