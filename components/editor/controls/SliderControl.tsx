import React, { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/editor/core/Slider";
import { cn } from "@/lib/utils";

interface SliderControlProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  className?: string;
  "aria-label"?: string;
  showInput?: boolean;
  precision?: number;
}

/**
 * SliderControl - Enhanced slider with numeric input
 * Features:
 * - Integrated slider and number input
 * - Real-time synchronization
 * - Unit display
 * - Customizable precision
 * - Accessibility support
 */
export const SliderControl: React.FC<SliderControlProps> = React.memo(
  ({
    label,
    value,
    min = 0,
    max = 100,
    step = 1,
    unit = "",
    onChange,
    className,
    "aria-label": ariaLabel,
    showInput = true,
    precision = 0,
  }) => {
    const [inputValue, setInputValue] = useState(value.toString());

    const handleSliderChange = useCallback(
      (newValue: number) => {
        setInputValue(newValue.toString());
        onChange(newValue);
      },
      [onChange],
    );

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        const numValue = parseFloat(newValue);
        if (!isNaN(numValue)) {
          // Clamp value within min/max
          const clampedValue = Math.min(Math.max(numValue, min), max);
          onChange(clampedValue);
        }
      },
      [onChange, min, max],
    );

    const handleInputBlur = useCallback(() => {
      const numValue = parseFloat(inputValue);
      if (isNaN(numValue)) {
        setInputValue(value.toString());
      } else {
        const clampedValue = Math.min(Math.max(numValue, min), max);
        setInputValue(clampedValue.toString());
        onChange(clampedValue);
      }
    }, [inputValue, value, min, max, onChange]);

    const displayValue =
      precision > 0 ? value.toFixed(precision) : Math.round(value);

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-bold text-muted-foreground block">
            {label}
          </label>
          <span className="text-[9px] text-muted-foreground">
            {displayValue}
            {unit}
          </span>
        </div>

        {/* Slider */}
        <Slider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleSliderChange}
          label=""
          unit={unit}
        />

        {/* Number Input */}
        {showInput && (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              min={min}
              max={max}
              step={step}
              className="h-8 text-xs bg-[#1e1e20] w-16"
              aria-label={ariaLabel ? `${ariaLabel} input` : `${label} input`}
            />
            <span className="text-[9px] text-muted-foreground">{unit}</span>
          </div>
        )}
      </div>
    );
  },
);

SliderControl.displayName = "SliderControl";
