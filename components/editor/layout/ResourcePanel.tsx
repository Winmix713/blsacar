import React from "react";
import { Sparkles } from "lucide-react";
import { AIPrompt } from "@/components/editor/AIPrompt";

interface ResourcePanelProps {
  onAIApply: (prompt: string) => Promise<void>;
}

/**
 * ResourcePanel - displays resources and AI assistant
 * Contains the AI prompt section extracted from Sidebar
 */
export const ResourcePanel: React.FC<ResourcePanelProps> = React.memo(
  ({ onAIApply }) => {
    return (
      <div className="mt-auto border-t border-white/5 bg-[#121214]">
        <div className="p-4 pb-0 flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Nexus Assistant
          </span>
        </div>
        <AIPrompt onApply={onAIApply} />
      </div>
    );
  },
);

ResourcePanel.displayName = "ResourcePanel";
