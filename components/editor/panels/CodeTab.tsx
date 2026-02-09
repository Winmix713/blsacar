import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useInspector } from "@/hooks/use-inspector";
import { Copy, Check } from "lucide-react";

/**
 * CodeTab - View and copy generated code
 * Features:
 * - Display generated HTML code
 * - Display generated Tailwind classes
 * - Copy to clipboard functionality
 * - Real-time code updates
 */
export const CodeTab: React.FC = React.memo(() => {
  const { generatedCode, generatedTailwind } = useInspector();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = useCallback(async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  return (
    <div className="space-y-4 pb-4">
      {/* Tailwind Classes Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-bold text-muted-foreground block">
            Tailwind Classes
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(generatedTailwind, "tailwind")}
            className="h-7 px-2 text-[10px]"
          >
            {copiedSection === "tailwind" ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
        <Textarea
          value={generatedTailwind}
          readOnly
          className="min-h-[100px] text-[11px] font-mono bg-[#0a0a0b] border-white/10 text-green-400 resize-none p-3 rounded-lg"
          aria-label="Generated Tailwind classes"
        />
        <div className="text-[8px] text-muted-foreground">
          {generatedTailwind.split(" ").length} classes
        </div>
      </div>

      {/* HTML Code Section */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-bold text-muted-foreground block">
            HTML Code
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(generatedCode, "html")}
            className="h-7 px-2 text-[10px]"
          >
            {copiedSection === "html" ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
        <Textarea
          value={generatedCode}
          readOnly
          className="min-h-[150px] text-[10px] font-mono bg-[#0a0a0b] border-white/10 text-orange-300 resize-none p-3 rounded-lg"
          aria-label="Generated HTML code"
        />
      </div>

      {/* Code Preview Info */}
      <div className="bg-black/20 p-3 rounded-lg border border-white/5 space-y-2">
        <h4 className="text-[9px] font-bold text-muted-foreground">
          Code Information
        </h4>
        <ul className="text-[8px] text-muted-foreground space-y-1">
          <li>• Code updates in real-time as you modify properties</li>
          <li>• All Tailwind classes are automatically generated</li>
          <li>• Complex transforms use arbitrary values</li>
          <li>• Link wrapper added when href is set</li>
        </ul>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-500/5 p-3 rounded-lg border border-blue-500/20 space-y-2">
        <h4 className="text-[9px] font-bold text-blue-400">How to Use</h4>
        <ol className="text-[8px] text-blue-300 space-y-1">
          <li>1. Customize properties in the Edit tab</li>
          <li>2. View generated code here</li>
          <li>3. Click Copy to copy code to clipboard</li>
          <li>4. Paste in your React/HTML project</li>
        </ol>
      </div>
    </div>
  );
});

CodeTab.displayName = "CodeTab";
