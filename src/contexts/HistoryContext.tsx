import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { Interaction } from "../models/MissionModels";

// Types for the context
export interface HistoryState {
  interactions: Interaction[];
  playerInputOld: string;
  llmOutput: string;
  playerInput: string;
}

export interface HistoryActions {
  setInteractions: (interactions: Interaction[]) => void;
  setPlayerInputOld: (value: string) => void;
  setLlmOutput: (value: string) => void;
  setPlayerInput: (value: string) => void;
  loadHistoryData: (data: {
    interactions: Interaction[];
    lastPlayerInput: string;
    lastLlmOutput: string;
  }) => void;
  clearHistory: () => void;
  hydrateFromStorage: () => void;
}

export interface HistoryContextType extends HistoryState, HistoryActions {}

// Create the context
const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

// Custom hook to use the context
export const useHistoryContext = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistoryContext must be used within a HistoryProvider");
  }
  return context;
};

// Provider component
interface HistoryProviderProps {
  children: ReactNode;
}

export const HistoryProvider: React.FC<HistoryProviderProps> = ({
  children,
}) => {
  // Initialize state from localStorage
  const [interactions, setInteractions] = useState<Interaction[]>(() => {
    return JSON.parse(localStorage.getItem("interactions") || "[]");
  });

  const [playerInputOld, setPlayerInputOld] = useState<string>(() => {
    return localStorage.getItem("playerInputOld") || "";
  });

  const [llmOutput, setLlmOutput] = useState<string>(() => {
    return localStorage.getItem("llmOutput") || "";
  });

  const [playerInput, setPlayerInput] = useState<string>(() => {
    return localStorage.getItem("playerInput") || "";
  });

  // Persist to localStorage whenever state changes
  React.useEffect(() => {
    localStorage.setItem("interactions", JSON.stringify(interactions));
  }, [interactions]);

  React.useEffect(() => {
    localStorage.setItem("playerInputOld", playerInputOld);
  }, [playerInputOld]);

  React.useEffect(() => {
    localStorage.setItem("llmOutput", llmOutput);
  }, [llmOutput]);

  React.useEffect(() => {
    localStorage.setItem("playerInput", playerInput);
  }, [playerInput]);

  // Action functions
  const loadHistoryData = useCallback(
    (data: {
      interactions: Interaction[];
      lastPlayerInput: string;
      lastLlmOutput: string;
    }) => {
      setInteractions(data.interactions);
      setPlayerInputOld(data.lastPlayerInput);
      setLlmOutput(data.lastLlmOutput);
      setPlayerInput("");
    },
    []
  );

  const clearHistory = useCallback(() => {
    setInteractions([]);
    setPlayerInputOld("");
    setLlmOutput("");
    setPlayerInput("");
  }, []);

  const hydrateFromStorage = useCallback(() => {
    // Force re-read from localStorage (useful for page refresh scenarios)
    setInteractions(JSON.parse(localStorage.getItem("interactions") || "[]"));
    setPlayerInputOld(localStorage.getItem("playerInputOld") || "");
    setLlmOutput(localStorage.getItem("llmOutput") || "");
    setPlayerInput(localStorage.getItem("playerInput") || "");
  }, []);

  // Memoize the context value to prevent unnecessary rerenders
  const contextValue: HistoryContextType = useMemo(
    () => ({
      // State
      interactions,
      playerInputOld,
      llmOutput,
      playerInput,
      // Actions
      setInteractions,
      setPlayerInputOld,
      setLlmOutput,
      setPlayerInput,
      loadHistoryData,
      clearHistory,
      hydrateFromStorage,
    }),
    [
      interactions,
      playerInputOld,
      llmOutput,
      playerInput,
      setInteractions,
      setPlayerInputOld,
      setLlmOutput,
      setPlayerInput,
      loadHistoryData,
      clearHistory,
      hydrateFromStorage,
    ]
  );

  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
};
