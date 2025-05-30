import { createContext, useState, useContext, type ReactNode } from "react";

interface AppContextType {
  tokenId: string;
  setTokenId: (id: string) => void;
  avatarTransitioned: boolean;
  setAvatarTransitioned: (transitioned: boolean) => void;
  step: number;
  setStep: (step: number) => void;
  slideOpen: boolean;
  setSlideOpen: (state: boolean) => void;
}

// Create context with a meaningful default or null + type assertion
const AppContext = createContext<AppContextType | null>(null);

// Custom hook for consuming the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useIdContext must be used within an IdProvider");
  }
  return context;
}

// Provider component
export function AppContextProvider({ children }: { children: ReactNode }) {
  const [tokenId, setTokenId] = useState("");
  const [avatarTransitioned, setAvatarTransitioned] = useState(false);
  const [step, setStep] = useState(1);
  const [slideOpen, setSlideOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        tokenId,
        setTokenId: (id) => setTokenId(id),
        avatarTransitioned,
        setAvatarTransitioned: (transitioned) =>
          setAvatarTransitioned(transitioned),
        step,
        setStep(sTep) {
          setStep(sTep);
        },
        slideOpen,
        setSlideOpen(state) {
          setSlideOpen(state);
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
