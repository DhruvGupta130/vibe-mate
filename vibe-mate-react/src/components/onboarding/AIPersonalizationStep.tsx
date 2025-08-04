import {useState, useEffect} from "react";
import {useUser} from "../../contexts/UserContext";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card.tsx";
import {Button} from "../ui/button.tsx";
import {Input} from "../ui/input.tsx";
import {Label} from "../ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select.tsx";
import {Bot, Heart, Sparkles} from "lucide-react";
import type {AIPersonality} from "../../contexts/UserContext";
import {useNavigate} from "react-router-dom";

const AIPersonalizationStep = () => {
    const {userData, aiPersonality, updateAIPersonality} = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<AIPersonality>({
        botName: aiPersonality?.botName || "",
        personality: aiPersonality?.personality || "",
        userId: aiPersonality?.userId || "",
        role: aiPersonality?.role || "",
        tone: aiPersonality?.tone || "",
    });

    useEffect(() => {
        if (userData?.userId) {
            setFormData((prev: any) => ({
                ...prev,
                userId: userData.userId,
            }));
        } else navigate('/');
    }, [userData]);

    const roleOptions = [
        {value: "Best Friend", label: "Best Friend", description: "Your loyal companion for daily chats"},
        {value: "Crush", label: "Crush/Partner", description: "Romantic and caring companion"},
        {value: "Life Coach", label: "Life Coach", description: "Motivational and goal-oriented"},
        {value: "Therapist", label: "Therapist", description: "Supportive and understanding"},
        {value: "Study Buddy", label: "Study Buddy", description: "Helpful with learning and academics"},
        {value: "Coding Mentor", label: "Coding Mentor", description: "Tech-savvy programming assistant"},
        {value: "Motivator", label: "Motivator", description: "Energetic and encouraging"},
    ];

    const toneOptions = [
        {value: "Calm & Caring", label: "Calm & Caring", emoji: "🌸"},
        {value: "Funny & Sarcastic", label: "Funny & Sarcastic", emoji: "😄"},
        {value: "Professional & Direct", label: "Professional & Direct", emoji: "💼"},
        {value: "Supportive & Encouraging", label: "Supportive & Encouraging", emoji: "💪"},
        {value: "Playful & Bubbly", label: "Playful & Bubbly", emoji: "🎉"},
    ];
    useEffect(() => {
        console.log("AI details changed", formData);
        if (formData.userId && formData.role && formData.tone && formData.botName && formData.personality) {
            console.log("AI Data: Updating AI data with valid form");
            updateAIPersonality(formData).then();
        } else {
            console.log("AI Data: Form data incomplete", {
                hasName: !!formData.botName,
                hasRole: !!formData.role,
                hasUserId: !!formData.userId,
                hasTone: !!formData.tone,
                hasPersonality: !!formData.personality
            });
        }
    }, [formData, updateAIPersonality]);

    const generatePreviewMessage = () => {
        const fullName = userData?.fullName || "there";
        const botName = formData.botName || "your AI companion";

        if (formData.tone === "Calm & Caring") {
            return `Hi ${fullName}, I'm ${botName}. I'm here to listen and support you through anything. How are you feeling today? 🌸`;
        } else if (formData.tone === "Funny & Sarcastic") {
            return `Hey ${fullName}! I'm ${botName}, your delightfully sarcastic companion. Ready to roast life together? 😄`;
        } else if (formData.tone === "Professional & Direct") {
            return `Hello ${fullName}. I'm ${botName}, your efficient AI assistant. Let's accomplish great things together. 💼`;
        } else if (formData.tone === "Supportive & Encouraging") {
            return `Hi ${fullName}! I'm ${botName} and I believe in you completely! You've got this! 💪`;
        } else if (formData.tone === "Playful & Bubbly") {
            return `Hey ${fullName}! I'm ${botName} and I'm SO excited to be your friend! This is going to be amazing! 🎉`;
        }
        return `Hi ${fullName}! I'm ${botName}, your ${formData.role?.toLowerCase() || "AI companion"}. Ready to chat?`;
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-2 animate-fade-in">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-primary rounded-full">
                        <Bot className="w-8 h-8 text-white"/>
                    </div>
                </div>
                <h2 className="text-3xl font-display font-bold gradient-text">
                    Design Your Perfect AI Companion 🤖
                </h2>
                <p className="text-muted-foreground text-lg">
                    Customize every aspect of your AI friend's personality
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuration */}
                <div className="space-y-6">
                    <Card className="vibemate-card animate-slide-up">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Sparkles className="w-5 h-5 text-primary"/>
                                <span>Name</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="aiName" className="text-base font-medium">
                                    AI Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="aiName"
                                    value={formData.botName}
                                    onChange={(e: { target: { value: any; }; }) => setFormData((prev: any) => ({
                                        ...prev,
                                        botName: e.target.value
                                    }))}
                                    className="vibemate-input"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Basic Settings */}
                    <Card className="vibemate-card animate-slide-up delay-100">
                        <CardHeader>
                            <CardTitle>Personality Basics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            {/* Role */}
                            <div className="space-y-2">
                                <Label className="text-base font-medium">
                                    Role & Relationship <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            role: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="vibemate-input">
                                        <SelectValue placeholder="What kind of companion?"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roleOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                <div className="flex flex-col">
                                                    <span>{option.label}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {option.description}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Personality Description */}
                            <div className="space-y-2">
                                <Label htmlFor="personality" className="text-base font-medium">
                                    Personality Description <span className="text-destructive">*</span>
                                </Label>
                                <textarea
                                    id="personality"
                                    className="w-full rounded-md border p-2 resize-none vibemate-input"
                                    rows={4}
                                    value={formData.personality}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, personality: e.target.value }))
                                    }
                                    placeholder="Describe how your AI should behave (e.g., optimistic, empathetic, witty)..."
                                />
                            </div>

                            {/* Tone */}
                            <div className="space-y-2">
                                <Label className="text-base font-medium">
                                    Voice & Tone Style <span className="text-destructive">*</span>
                                </Label>
                                <div className="grid grid-cols-1 gap-2">
                                    {toneOptions.map((option) => (
                                        <Button
                                            key={option.value}
                                            variant={formData.tone === option.value ? "default" : "outline"}
                                            onClick={() => setFormData((prev: any) => ({...prev, tone: option.value}))}
                                            className={`text-left justify-start h-auto p-3 ${
                                                formData.tone === option.value
                                                    ? "bg-gradient-primary text-white"
                                                    : ""
                                            }`}
                                        >
                                            <span className="mr-2">{option.emoji}</span>
                                            {option.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Live Preview */}
                <div className="space-y-6">
                    <Card className="vibemate-card animate-bounce-in sticky top-6">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Heart className="w-5 h-5 text-primary"/>
                                <span>Live Preview</span>
                            </CardTitle>
                            <CardDescription>
                                See how your AI companion will interact with you
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Message Preview */}
                            {formData.tone && (
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">
                                        How {formData.botName || "your AI"} will greet you:
                                    </Label>
                                    <div className="p-3 bg-gradient-soft rounded-lg">
                                        <p className="text-sm leading-relaxed">
                                            {generatePreviewMessage()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Validation Message */}
            {(!formData.personality || !formData.role || !formData.tone || !formData.botName || !formData.userId) && (
                <Card className="border-primary/50 bg-primary/5 animate-fade-in">
                    <CardContent className="pt-6">
                        <p className="text-sm text-primary text-center">
                            Please complete all required fields to continue
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AIPersonalizationStep;