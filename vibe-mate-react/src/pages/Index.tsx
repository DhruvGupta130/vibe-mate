import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import { useUser } from "@/contexts/UserContext";
import Welcome from "./Welcome.tsx";

const Index = () => {
  const navigate = useNavigate();
  const { isOnboardingComplete } = useUser();

  useEffect(() => {
    if (isOnboardingComplete) {
      navigate("/chat");
    }
  }, [isOnboardingComplete, navigate]);

  return <Welcome />;
};

export default Index;
