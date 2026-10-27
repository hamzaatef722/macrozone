import {
  DEFAULT_GOALS,
  getGoals,
  Goals,
  saveGoals,
} from "@/storage/profile";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type GoalsContextValue = {
  goals: Goals;
  setGoals: (goals: Goals) => Promise<void>;
  isLoaded: boolean;
};

const GoalsContext = createContext<GoalsContextValue | null>(null);

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoalsState] = useState<Goals>(DEFAULT_GOALS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getGoals().then((saved) => {
      setGoalsState(saved);
      setIsLoaded(true);
    });
  }, []);

  const setGoals = useCallback(async (next: Goals) => {
    setGoalsState(next); 
    await saveGoals(next); 
  }, []);

  const value = useMemo(
    () => ({ goals, setGoals, isLoaded }),
    [goals, setGoals, isLoaded],
  );

  return (
    <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (!context) throw new Error("useGoals must be used inside <GoalsProvider>");
  return context;
}