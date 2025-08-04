// @ts-ignore
import { Toaster } from "@/components/ui/toaster";
// @ts-ignore
import { Toaster as Sonner } from "@/components/ui/sonner";
// @ts-ignore
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// @ts-ignore
import { UserProvider } from "@/contexts/UserContext";
import OnboardingFlow from "./pages/OnboardingFlow.tsx";
import Chat from "./pages/Chat.tsx";
import Settings from "./pages/Settings.tsx";
import Welcome from "./pages/Welcome.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/onboarding/*" element={<OnboardingFlow />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;