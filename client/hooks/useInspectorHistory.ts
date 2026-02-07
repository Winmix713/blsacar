import { useState, useCallback, useMemo } from "react";
import type { InspectorState } from "./use-inspector";

interface HistoryState {
  past: InspectorState[];
  present: InspectorState;
  future: InspectorState[];
}

const MAX_HISTORY = 20;

/**
 * useInspectorHistory - Manages full undo/redo stack
 * Provides better history management with forward navigation support
 * (Currently used by use-inspector, but available for standalone use)
 */
export const useInspectorHistory = (initialState: InspectorState) => {
  const [historyState, setHistoryState] = useState<HistoryState>({
    past: [],
    present: initialState,
    future: [],
  });

  /**
   * Add a new state to history (clears future stack)
   */
  const pushHistory = useCallback((newState: InspectorState) => {
    setHistoryState((prev) => ({
      past: [...prev.past.slice(-(MAX_HISTORY - 1)), prev.present],
      present: newState,
      future: [], // Clear redo stack when new change is made
    }));
  }, []);

  /**
   * Undo to previous state
   */
  const undo = useCallback(() => {
    setHistoryState((prev) => {
      if (prev.past.length === 0) return prev;
      const newPast = prev.past.slice(0, -1);
      const newPresent = prev.past[prev.past.length - 1];
      return {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  /**
   * Redo to next state (forward navigation)
   */
  const redo = useCallback(() => {
    setHistoryState((prev) => {
      if (prev.future.length === 0) return prev;
      const newFuture = prev.future.slice(1);
      const newPresent = prev.future[0];
      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistoryState((prev) => ({
      past: [],
      present: prev.present,
      future: [],
    }));
  }, []);

  /**
   * Reset to initial state
   */
  const reset = useCallback((newInitialState: InspectorState) => {
    setHistoryState({
      past: [],
      present: newInitialState,
      future: [],
    });
  }, []);

  // Compute whether undo/redo is available
  const canUndo = useMemo(
    () => historyState.past.length > 0,
    [historyState.past.length],
  );
  const canRedo = useMemo(
    () => historyState.future.length > 0,
    [historyState.future.length],
  );

  return {
    state: historyState.present,
    pushHistory,
    undo,
    redo,
    clearHistory,
    reset,
    canUndo,
    canRedo,
    history: {
      past: historyState.past,
      future: historyState.future,
    },
  };
};
