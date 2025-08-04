import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  User, 
  Bot, 
  Trash2, 
  Download, 
  RefreshCw,
  Heart,
  Settings as SettingsIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { userData, aiPersonality, resetData, isOnboardingComplete } = useUser();
  const { toast } = useToast();

  if (!isOnboardingComplete) {
    navigate("/");
    return null;
  }

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
      resetData();
      toast({
        title: "Data Reset",
        description: "All data has been cleared. Redirecting to welcome page...",
      });
      setTimeout(() => navigate("/"), 1000);
    }
  };

  const handleExportData = () => {
    const exportData = {
      userData,
      aiPersonality,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vibemate-data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Your VibeMate data has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/chat")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your VibeMate experience</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* User Profile */}
        <Card className="vibemate-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Your Profile</span>
            </CardTitle>
            <CardDescription>
              Your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="font-medium">{userData?.name}</p>
              </div>
              {userData?.age && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Age</label>
                  <p className="font-medium">{userData.age}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <p className="font-medium">{userData?.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Language</label>
                <p className="font-medium">{userData?.language}</p>
              </div>
            </div>
            
            {userData?.interests && userData.interests.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {userData.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Companion */}
        <Card className="vibemate-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>AI Companion</span>
            </CardTitle>
            <CardDescription>
              Your personalized AI friend's settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarImage src={aiPersonality?.avatar} />
                <AvatarFallback className="bg-gradient-primary text-white">
                  {aiPersonality?.name?.[0] || "AI"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{aiPersonality?.name}</h3>
                <p className="text-muted-foreground">{aiPersonality?.role}</p>
                <Badge variant="outline" className="mt-1">
                  {aiPersonality?.tone}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <p className="font-medium">{aiPersonality?.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Memory</label>
                <p className="font-medium">
                  {aiPersonality?.memoryEnabled ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>

            {aiPersonality?.wakeWord && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Wake Word</label>
                <p className="font-medium">{aiPersonality.wakeWord}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="vibemate-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5" />
              <span>App Settings</span>
            </CardTitle>
            <CardDescription>
              Customize your VibeMate experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Voice Responses</label>
                <p className="text-sm text-muted-foreground">
                  Enable text-to-speech for AI responses
                </p>
              </div>
              <Switch />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">File Understanding</label>
                <p className="text-sm text-muted-foreground">
                  Allow AI to read and analyze uploaded files
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Image Analysis</label>
                <p className="text-sm text-muted-foreground">
                  Enable AI to describe and analyze images
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="vibemate-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5" />
              <span>Data Management</span>
            </CardTitle>
            <CardDescription>
              Export or reset your VibeMate data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleExportData}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate("/onboarding")}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reconfigure AI</span>
              </Button>
              
              <Button
                variant="destructive"
                onClick={handleResetData}
                className="flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Reset All Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;