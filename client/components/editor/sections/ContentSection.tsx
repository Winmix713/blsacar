import React, { useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { ElementTag } from "@/hooks/use-inspector";
import { DebouncedInput } from "@/components/editor/core/DebouncedInput";

interface ContentSectionProps {
  elementTag: ElementTag;
  textContent: string;
  link: string;
  onTagChange: (tag: ElementTag) => void;
  onTextChange: (text: string) => void;
  onLinkChange: (link: string) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const AVAILABLE_TAGS: ElementTag[] = [
  "div",
  "section",
  "article",
  "header",
  "footer",
  "nav",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "button",
  "a",
  "ul",
  "ol",
  "li",
];

/**
 * ContentSection - Manage element tag, text content, and links
 * Features:
 * - Dropdown tag selector with all semantic HTML tags
 * - Text content input
 * - Optional link (href) input
 * - Accordion collapsible interface
 */
export const ContentSection: React.FC<ContentSectionProps> = React.memo(
  ({
    elementTag,
    textContent,
    link,
    onTagChange,
    onTextChange,
    onLinkChange,
    expanded = false,
    onToggleExpand,
  }) => {
    const handleTagChange = useCallback(
      (value: string) => {
        onTagChange(value as ElementTag);
      },
      [onTagChange],
    );

    return (
      <Accordion
        type="single"
        value={expanded ? "content" : ""}
        onValueChange={() => onToggleExpand?.()}
      >
        <AccordionItem
          value="content"
          className="border border-white/5 rounded-lg bg-[#1a1a1c]"
        >
          <AccordionTrigger
            className="px-3 py-2 hover:no-underline text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            onClick={onToggleExpand}
          >
            Content
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-3">
            {/* Tag Selector */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-muted-foreground block">
                Element Tag
              </label>
              <Select value={elementTag} onValueChange={handleTagChange}>
                <SelectTrigger
                  className="h-8 text-xs bg-[#1e1e20]"
                  aria-label="Element tag"
                >
                  <SelectValue placeholder="Select tag..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1c] border-white/10">
                  {AVAILABLE_TAGS.map((tag) => (
                    <SelectItem key={tag} value={tag} className="text-xs">
                      &lt;{tag}&gt;
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Text Content Input */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-muted-foreground block">
                Text Content
              </label>
              <DebouncedInput
                value={textContent}
                onChange={onTextChange}
                placeholder="Enter text..."
                className="h-8 text-xs bg-[#1e1e20]"
                aria-label="Element text content"
              />
            </div>

            {/* Link Input (optional) */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-muted-foreground block">
                Link (href){" "}
                <span className="text-muted-foreground/50">optional</span>
              </label>
              <DebouncedInput
                value={link}
                onChange={onLinkChange}
                placeholder="https://example.com"
                className="h-8 text-xs bg-[#1e1e20]"
                aria-label="Element link URL"
              />
              {link && (
                <div className="text-[8px] text-muted-foreground">
                  Element will be wrapped in &lt;a&gt; tag
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
);

ContentSection.displayName = "ContentSection";
