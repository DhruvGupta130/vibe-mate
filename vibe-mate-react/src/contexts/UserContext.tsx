import axios from "../config/api.ts";
import { createContext, useContext, useState, type ReactNode } from "react";

export interface UserData {
  userId: string,
  fullName: string;
  age?: number;
  gender: string;
}

export interface AIPersonality {
  userId: string;
  botName : string;
  personality: string;
  tone: string;
  role: string;
}

interface UserContextType {
  userData: UserData | null;
  aiPersonality: AIPersonality | null;
  isOnboardingComplete: boolean;
  updateUserData: (data: UserData) => Promise<void>;
  updateAIPersonality: (personality: AIPersonality) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetData: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(() => {
    const saved = localStorage.getItem("vibemate-user-data");
    return saved ? JSON.parse(saved) : null;
  });

  const [aiPersonality, setAIPersonality] = useState<AIPersonality | null>(() => {
    const saved = localStorage.getItem("vibemate-ai-personality");
    return saved ? JSON.parse(saved) : null;
  });

  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => {
    return localStorage.getItem("vibemate-onboarding-complete") === "true";
  });

  const updateUserData = async (data: UserData) => {
    try {
      const response = await axios.post("/api/user/info", data);
      const userDetails = response.data.data;
      setUserData(userDetails);
      localStorage.setItem("userId", userDetails.userId);
      localStorage.setItem("vibemate-user-data", JSON.stringify(userDetails));
    } catch (error) {
      console.error("❌ Failed to save user data:", error);
      throw new Error("Failed to save user info. Please try again.");
    }
  };

  const updateAIPersonality = async (personality: AIPersonality) => {
    try {
      const response = await axios.post("/api/user/bot", personality);
      const aiDetails = response.data.data;
      setAIPersonality(aiDetails);
      localStorage.setItem("vibemate-ai-personality", JSON.stringify(aiDetails));
    } catch (error) {
      console.error("❌ Failed to save bot config:", error);
      throw new Error("Failed to save AI personality. Please try again.");
    }
  };

  const completeOnboarding = async () => {
    try {
      if (userData) {
        await axios.post("/api/user/info", userData);
      }
      if (aiPersonality) {
        await axios.post("/api/user/bot", aiPersonality);
      }
      setIsOnboardingComplete(true);
      localStorage.setItem("vibemate-onboarding-complete", "true");
    } catch (error) {
      console.error("❌ Failed to complete onboarding:", error);
      throw new Error("Failed to complete onboarding. Please try again.");
    }
  };

  const resetData = () => {
    setUserData(null);
    setAIPersonality(null);
    setIsOnboardingComplete(false);
    localStorage.removeItem("vibemate-user-data");
    localStorage.removeItem("vibemate-ai-personality");
    localStorage.removeItem("vibemate-onboarding-complete");
  };

  return (
      <UserContext.Provider
          value={{
            userData,
            aiPersonality,
            isOnboardingComplete,
            updateUserData,
            updateAIPersonality,
            completeOnboarding,
            resetData,
          }}
      >
        {children}
      </UserContext.Provider>
  );
};