import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import UserInfoStep from "../components/onboarding/UserInfoStep";
import AIPersonalizationStep from "../components/onboarding/AIPersonalizationStep";
import CompleteStep from "../components/onboarding/CompleteStep";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, aiPersonality, completeOnboarding } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { path: "", title: "About You", component: UserInfoStep },
    { path: "personality", title: "AI Companion", component: AIPersonalizationStep },
    { path: "complete", title: "All Set!", component: CompleteStep },
  ];

  const getCurrentStepIndex = () => {
    const currentPath = location.pathname.split("/").pop() || "";
    const index = steps.findIndex((step) => step.path === currentPath);
    return index === -1 ? 0 : index;
  };

  const currentStepIndex = getCurrentStepIndex();
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const goNext = async () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      navigate(`/onboarding/${nextStep.path}`);
    } else {
      setIsSubmitting(true);
      try {
        await completeOnboarding();
        navigate("/chat");
      } catch (err) {
        console.error("Failed to complete onboarding", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      navigate(`/onboarding/${prevStep.path}`);
    } else {
      navigate("/");
    }
  };

  const canProceed = () => {
    switch (currentStepIndex) {
      case 0:
        return !!(userData?.fullName && userData?.gender && userData?.age);
      case 1:
        return !!(
            aiPersonality?.botName &&
            aiPersonality?.personality &&
            aiPersonality?.tone &&
            aiPersonality?.userId &&
            aiPersonality?.role
        );
      case 2:
        return true;
      default:
        return false;
    }
  };

  return (
      <div className="min-h-screen bg-gradient-background relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-display font-bold gradient-text">VibeMate Setup</h1>
              <div className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{steps[currentStepIndex]?.title}</span>
                <span className="text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="animate-fade-in">
            <Routes>
              <Route path="" element={<UserInfoStep />} />
              <Route path="personality" element={<AIPersonalizationStep />} />
              <Route path="complete" element={<CompleteStep />} />
            </Routes>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-border/50">
            <Button
                variant="outline"
                onClick={goBack}
                className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>

            <Button
                onClick={goNext}
                disabled={!canProceed() || isSubmitting}
                className="vibemate-button flex items-center space-x-2"
            >
            <span>
              {isSubmitting
                  ? "Submitting..."
                  : currentStepIndex === steps.length - 1
                      ? "Complete Setup"
                      : "Continue"}
            </span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
  );
};

export default OnboardingFlow;