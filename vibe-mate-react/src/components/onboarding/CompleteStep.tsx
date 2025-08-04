import {useUser} from "../../contexts/UserContext";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card.tsx";
import {Avatar, AvatarFallback} from "../ui/avatar";
import {Badge} from "../ui/badge";
import {CheckCircle, Heart, Sparkles, MessageCircle} from "lucide-react";
import React from "react";

const CompleteStep = () => {
    const {userData, aiPersonality} = useUser();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-4 animate-fade-in">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-primary rounded-full animate-pulse-glow">
                        <CheckCircle className="w-10 h-10 text-white"/>
                    </div>
                </div>
                <h2 className="text-4xl font-display font-bold gradient-text">
                    You're All Set! 🎉
                </h2>
                <p className="text-muted-foreground text-lg">
                    Your perfect AI companion is ready to meet you
                </p>
            </div>

            {/* Summary Card */}
            <Card className="vibemate-card animate-bounce-in">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-primary"/>
                        <span>Meet Your AI Companion</span>
                    </CardTitle>
                    <CardDescription>
                        Here's everything we've set up for you
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* AI Profile */}
                    <div className="flex items-center space-x-4 p-4 bg-gradient-soft rounded-xl">
                        <Avatar className="h-16 w-16 ring-4 ring-primary/30">
                            <AvatarFallback className="bg-gradient-primary text-white text-xl">
                                {aiPersonality?.botName?.[0] || "AI"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="text-xl font-display font-bold">
                                {aiPersonality?.botName}
                            </h3>
                            <p className="text-muted-foreground">
                                Your {aiPersonality?.role}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="secondary">{aiPersonality?.tone}</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Your Profile Summary */}
                    <div className="space-y-3">
                        <h4 className="font-semibold flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-primary"/>
                            <span>About You</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="space-y-1">
                                <span className="text-muted-foreground">Name:</span>
                                <p className="font-medium">{userData?.fullName}</p>
                            </div>
                            {userData?.age && (
                                <div className="space-y-1">
                                    <span className="text-muted-foreground">Age:</span>
                                    <p className="font-medium">{userData.age}</p>
                                </div>
                            )}
                            <div className="space-y-1">
                                <span className="text-muted-foreground">Gender:</span>
                                <p className="font-medium">{userData?.gender}</p>
                            </div>
                        </div>
                    </div>

                    {/* Welcome Message Preview */}
                    <div className="space-y-3">
                        <h4 className="font-semibold flex items-center space-x-2">
                            <MessageCircle className="w-4 h-4 text-primary"/>
                            <span>First Message</span>
                        </h4>
                        <div className="p-4 bg-muted/50 rounded-xl">
                            <div className="flex items-start space-x-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-gradient-primary text-white text-sm">
                                        {aiPersonality?.botName?.[0] || "AI"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-sm font-medium mb-1">{aiPersonality?.botName}</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Hey {userData?.fullName}! I'm {aiPersonality?.botName},
                                        your {aiPersonality?.role?.toLowerCase()}.
                                        I'm so excited to get to know you better and be your companion!
                                        What would you like to talk about first? 😊
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Features Highlight */}
            <Card className="vibemate-card animate-slide-up">
                <CardHeader>
                    <CardTitle>What You Can Do Together</CardTitle>
                    <CardDescription>
                        Explore all the amazing features with your AI companion
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FeatureItem
                            icon="💬"
                            title="Natural Conversations"
                            description="Chat about anything - your day, feelings, ideas, or dreams"
                        />
                        <FeatureItem
                            icon="🧠"
                            title="Smart Memory"
                            description="Your AI remembers important details about you"
                        />
                        <FeatureItem
                            icon="🎤"
                            title="Voice Chat"
                            description="Talk naturally with voice input and responses"
                        />
                        <FeatureItem
                            icon="📁"
                            title="File Understanding"
                            description="Share documents and images for analysis"
                        />
                        <FeatureItem
                            icon="🎨"
                            title="Rich Responses"
                            description="Get detailed, thoughtful, and contextual replies"
                        />
                        <FeatureItem
                            icon="⚙️"
                            title="Customizable"
                            description="Adjust personality and settings anytime"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Ready Message */}
            <Card className="vibemate-card text-center animate-bounce-in bg-gradient-soft">
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        <Sparkles className="w-8 h-8 text-primary mx-auto"/>
                        <h3 className="text-xl font-display font-bold">
                            Ready to Start Your Journey?
                        </h3>
                        <p className="text-muted-foreground">
                            Click "Complete Setup" to begin chatting with {aiPersonality?.botName}!
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

interface FeatureItemProps {
    icon: string;
    title: string;
    description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({icon, title, description}) => (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="text-2xl">{icon}</div>
        <div>
            <h4 className="font-medium text-sm">{title}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    </div>
);

export default CompleteStep;