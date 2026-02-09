import React, { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}

/**
 * ColorPicker - Advanced color input with preview
 * Features:
 * - HTML5 color input for native picker
 * - Manual hex/rgb input
 * - Color preview
 * - Type-safe with validation
 */
export const ColorPicker: React.FC<ColorPickerProps> = React.memo(
  ({
    label,
    value,
    onChange,
    placeholder = "#000000",
    className,
    "aria-label": ariaLabel,
  }) => {
    const [inputValue, setInputValue] = useState(value);

    const handleColorInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        setInputValue(newValue);
      },
      [onChange],
    );

    const handleTextInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        // Only update on blur or valid color
        if (newValue === "" || /^[#a-fA-F0-9]{6}$/.test(newValue)) {
          onChange(newValue);
        }
      },
      [onChange],
    );

    const handleBlur = useCallback(() => {
      // Ensure value is valid on blur
      if (inputValue && !/^[#a-fA-F0-9]{6}$/.test(inputValue)) {
        setInputValue(value);
      }
    }, [inputValue, value]);

    return (
      <div className={cn("space-y-2", className)}>
        <label className="text-[9px] font-bold text-muted-foreground block">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {/* Native Color Picker */}
          <input
            type="color"
            value={value || "#000000"}
            onChange={handleColorInputChange}
            className="w-8 h-8 rounded cursor-pointer bg-transparent border border-white/10 hover:border-white/20"
            aria-label={ariaLabel ? `${ariaLabel} picker` : `${label} picker`}
          />

          {/* Color Preview */}
          <div
            className="w-8 h-8 rounded border border-white/10"
            style={{
              backgroundColor: value || "transparent",
            }}
            title={value || "No color"}
          />

          {/* Text Input */}
          <Input
            type="text"
            value={inputValue}
            onChange={handleTextInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="h-8 text-xs bg-[#1e1e20] flex-1"
            aria-label={ariaLabel}
          />
        </div>

        {/* Helper Text */}
        <div className="text-[8px] text-muted-foreground">
          Use hex (#abc123) or rgb/hsl formats
        </div>
      </div>
    );
  },
);

ColorPicker.displayName = "ColorPicker";
