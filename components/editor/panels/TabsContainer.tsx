import React, { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type TabType = "edit" | "prompt" | "code";

interface TabsContainerProps {
  defaultTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  className?: string;
  editTabContent: React.ReactNode;
  promptTabContent: React.ReactNode;
  codeTabContent: React.ReactNode;
}

/**
 * TabsContainer - Central tabs manager for Inspector Panel
 * Features:
 * - Three tabs: Edit, Prompt, Code
 * - Persistent state
 * - Custom styling for dark theme
 * - Flexible content rendering
 */
export const TabsContainer: React.FC<TabsContainerProps> = React.memo(
  ({
    defaultTab = "edit",
    onTabChange,
    className,
    editTabContent,
    promptTabContent,
    codeTabContent,
  }) => {
    const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

    const handleTabChange = useCallback(
      (tab: TabType) => {
        setActiveTab(tab);
        onTabChange?.(tab);
      },
      [onTabChange],
    );

    return (
      <Tabs
        value={activeTab}
        onValueChange={(value) => handleTabChange(value as TabType)}
        className={cn("w-full", className)}
      >
        {/* Tabs List */}
        <TabsList className="w-full bg-transparent border-b border-white/5 rounded-none h-auto p-0">
          <TabsTrigger
            value="edit"
            className={cn(
              "relative rounded-none border-b-2 border-b-transparent px-4 py-3 text-[11px] font-semibold uppercase tracking-wider transition-colors",
              "data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground",
              "data-[state=inactive]:text-muted-foreground hover:text-foreground",
            )}
          >
            Edit
          </TabsTrigger>
          <TabsTrigger
            value="prompt"
            className={cn(
              "relative rounded-none border-b-2 border-b-transparent px-4 py-3 text-[11px] font-semibold uppercase tracking-wider transition-colors",
              "data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground",
              "data-[state=inactive]:text-muted-foreground hover:text-foreground",
            )}
          >
            AI Prompt
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className={cn(
              "relative rounded-none border-b-2 border-b-transparent px-4 py-3 text-[11px] font-semibold uppercase tracking-wider transition-colors",
              "data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground",
              "data-[state=inactive]:text-muted-foreground hover:text-foreground",
            )}
          >
            Code
          </TabsTrigger>
        </TabsList>

        {/* Edit Tab */}
        <TabsContent value="edit" className="p-4 space-y-4">
          {editTabContent}
        </TabsContent>

        {/* Prompt Tab */}
        <TabsContent value="prompt" className="p-4 space-y-4">
          {promptTabContent}
        </TabsContent>

        {/* Code Tab */}
        <TabsContent value="code" className="p-4 space-y-4">
          {codeTabContent}
        </TabsContent>
      </Tabs>
    );
  },
);

TabsContainer.displayName = "TabsContainer";
