'use client';

import * as React from "react";
import { useCallback } from "react";
import { Undo2, Redo2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInspector } from "@/hooks/use-inspector";
import { BreakpointSelector } from "./panels/BreakpointSelector";
import { TabsContainer, type TabType } from "./panels/TabsContainer";
import { EditTab } from "./panels/EditTab";
import { PromptTab } from "./panels/PromptTab";
import { CodeTab } from "./panels/CodeTab";
import { BreakpointValue } from "./core/useBreakpointConfig";

/**
 * PropertiesPanel - Enhanced Inspector Panel with Tab System
 * Features:
 * - Three-tab interface: Edit, AI Prompt, Code
 * - Complete property editing with organized sections
 * - Real-time code generation and preview
 * - AI-powered design suggestions (FASE 1 structure)
 * - Full undo/redo and reset capabilities
 */
export const PropertiesPanel: React.FC = () => {
  const { state, updateState, undo, redo, canUndo, canRedo, resetState } = useInspector();

  const handleBreakpointChange = useCallback(
    (value: BreakpointValue) => {
      updateState("breakpoint", value);
    },
    [updateState],
  );

  const handleTabChange = useCallback((_tab: TabType) => {
    // Can be used for analytics or other side effects
  }, []);

  return (
    <div className="w-80 border-l border-white/5 bg-[#121214] h-full overflow-y-auto hidden lg:flex flex-col select-none">
      {/* HEADER */}
      <div className="border-b border-white/5 bg-[#121214] z-10">
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">
              Properties
            </span>
            <h3 className="text-xs font-bold tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {state.elementTag.toUpperCase()}{" "}
              <span className="text-muted-foreground font-normal">
                #{state.elementId.slice(0, 8)}
              </span>
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={undo}
              disabled={!canUndo}
              aria-label="Undo last change"
              title="Undo"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={redo}
              disabled={!canRedo}
              aria-label="Redo last change"
              title="Redo"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={resetState}
              aria-label="Reset to defaults"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* BREAKPOINT SELECTOR - Always visible in header */}
        <div className="px-4 py-3 border-b border-white/5">
          <BreakpointSelector
            currentBreakpoint={state.breakpoint}
            onChange={handleBreakpointChange}
          />
        </div>
      </div>

      {/* TABS CONTAINER with scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <TabsContainer
          defaultTab="edit"
          onTabChange={handleTabChange}
          editTabContent={<EditTab />}
          promptTabContent={<PromptTab />}
          codeTabContent={<CodeTab />}
        />
      </div>
    </div>
  );
};

export default PropertiesPanel;
