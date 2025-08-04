import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import { useUser } from "@/contexts/UserContext";
// @ts-ignore
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, MessageCircle } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const { isOnboardingComplete } = useUser();

  useEffect(() => {
    if (isOnboardingComplete) {
      navigate("/chat");
    }
  }, [isOnboardingComplete, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
        {/* Logo/Brand */}
        <div className="relative">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-8 h-8 text-primary animate-bounce" />
            <Sparkles className="w-6 h-6 text-secondary animate-pulse" />
          </div>
          <h1 className="text-6xl font-display font-bold gradient-text mb-4">
            VibeMate
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Your Emotional AI Companion
          </p>
        </div>

        {/* Welcome, Card */}
        <div className="vibemate-card max-w-lg mx-auto space-y-6 animate-slide-up">
          <div className="flex justify-center">
            <MessageCircle className="w-16 h-16 text-primary opacity-80" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-semibold">
              Welcome to your personal AI companion! 🧡
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Create, customize, and chat with an AI friend who understands you. 
              VibeMate learns your personality, remembers your conversations, 
              and becomes the perfect companion for any mood.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => navigate("/onboarding")}
              className="vibemate-button w-full text-lg py-4"
            >
              Get Started
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Takes just 2 minutes to set up your perfect AI companion
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12 animate-bounce-in">
          <FeatureCard 
            icon="🤖"
            title="Personalized AI"
            description="Customize personality, voice, and role to match your needs"
          />
          <FeatureCard 
            icon="💭"
            title="Smart Memory"
            description="Remembers your conversations and grows with you"
          />
          <FeatureCard 
            icon="🎨"
            title="Rich Interactions"
            description="Voice chat, file uploads, and image understanding"
          />
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="vibemate-card text-center space-y-3 hover:scale-105 transition-transform duration-200">
    <div className="text-3xl mb-2">{icon}</div>
    <h3 className="font-display font-semibold text-lg">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Welcome;