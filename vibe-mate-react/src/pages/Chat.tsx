import React, {useState, useRef, useEffect} from "react";
import {useUser} from "../contexts/UserContext";
import {useNavigate} from "react-router-dom";
import {Button} from "../components/ui/button";
import {Card} from "../components/ui/card";
import {Avatar, AvatarFallback} from "../components/ui/avatar";
import {ScrollArea} from "../components/ui/scroll-area";
import {
    Send,
    Mic,
    Paperclip,
    Settings,
    Menu
} from "lucide-react";
import {useToast} from "../hooks/use-toast";
import {BACKEND_URL} from "../config/api.ts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import {Textarea} from "../components/ui/textarea.tsx";

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
    type?: "text" | "image" | "file";
}

const Chat = () => {
        const navigate = useNavigate();
        const {userData, aiPersonality, isOnboardingComplete} = useUser();
        const {toast} = useToast();
        const [messages, setMessages] = useState<Message[]>([]);
        const [inputValue, setInputValue] = useState("");
        const [isTyping, setIsTyping] = useState(false);
        const messagesEndRef = useRef<HTMLDivElement>(null);
        const inputRef = useRef<HTMLTextAreaElement>(null);
        const fileInputRef = useRef<HTMLInputElement>(null);
        const [uploadedFile, setUploadedFile] = useState<File | null>(null);
        const [previewUrl, setPreviewUrl] = useState<string | null>(null);


        useEffect(() => {
            if (!isOnboardingComplete || !userData?.userId) {
                navigate("/");
                return;
            }

            if (messages.length === 0) {
                const welcomeMessage: Message = {
                    id: "welcome",
                    text: `Hey ${userData?.fullName}! I'm ${aiPersonality?.botName}, your ${aiPersonality?.role}. I'm here to chat, help, and be your friend. What's on your mind today? 😊`,
                    sender: "ai",
                    timestamp: new Date(),
                };
                setMessages([welcomeMessage]);
            }
        }, [isOnboardingComplete, navigate, userData, aiPersonality, messages.length]);

        useEffect(() => {
            scrollToBottom();
        }, [messages]);

        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
        };

        const streamAIResponse = async (
            response: Response,
            setMessages: React.Dispatch<React.SetStateAction<Message[]>>
        ) => {
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let aiText = "";

            while (true) {
                const {value, done} = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, {stream: true});
                aiText += chunk;

                // Update the last AI message live as chunks arrive
                setMessages((prev) => {
                    const others = prev.filter((m) => m.id !== "stream");
                    return [
                        ...others,
                        {
                            id: "stream",
                            text: aiText,
                            sender: "ai",
                            timestamp: new Date(),
                        },
                    ];
                });
            }
        };

        const handleSend = async () => {
            if (!inputValue.trim() && !uploadedFile) return;

            const userMessage: Message = {
                id: Date.now().toString(),
                text: inputValue.trim(),
                sender: "user",
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, userMessage]);
            setInputValue("");
            setIsTyping(true);

            try {
                let response;
                if (uploadedFile) {
                    const formData = new FormData();
                    formData.append("file", uploadedFile);
                    formData.append("userId", userData?.userId || "");
                    formData.append("message", userMessage.text);

                    const endpoint = uploadedFile.type.startsWith("image/")
                        ? `${BACKEND_URL}/api/chat/vision`
                        : `${BACKEND_URL}/api/chat/upload`;

                    setUploadedFile(null);
                    setPreviewUrl(null);

                    response = await fetch(endpoint, {
                        method: "POST",
                        body: formData,
                    });
                } else {
                    response = await fetch(`${BACKEND_URL}/api/chat`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "text/markdown",
                        },
                        body: JSON.stringify({
                            userId: userData?.userId,
                            message: userMessage.text,
                        }),
                    });
                }
                await streamAIResponse(response, setMessages);
            } catch (err) {
                console.error("Streaming error:", err);
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        text: "❌ Something went wrong. Please try again.",
                        sender: "ai",
                        timestamp: new Date(),
                    },
                ]);
            } finally {
                setIsTyping(false);
            }
        };


        const handleKeyPress = (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend().then();
            }
        };

        const handleVoiceInput = () => {
            toast({
                title: "Voice Input",
                description: "Voice input feature coming soon!",
            });
        };

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                setUploadedFile(file);
                const isImage = file.type.startsWith("image/");
                if (isImage) {
                    const url = URL.createObjectURL(file);
                    setPreviewUrl(url);
                } else {
                    setPreviewUrl(null);
                }
            }
            e.target.value = "";
        };

        useEffect(() => {
            return () => {
                if (previewUrl) URL.revokeObjectURL(previewUrl);
            };
        }, [previewUrl]);

        if (!isOnboardingComplete) {
            return null;
        }

        return (
            <div className="h-screen flex flex-col bg-gradient-background">
                {/* Header */}
                <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                                <AvatarFallback className="bg-gradient-primary text-white">
                                    {aiPersonality?.botName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="font-display font-semibold text-lg">
                                    {aiPersonality?.botName}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {aiPersonality?.role} • Online
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                            >
                                <Menu className="h-5 w-5"/>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/settings")}
                                className="rounded-full"
                            >
                                <Settings className="h-5 w-5"/>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message}/>
                        ))}

                        {isTyping && (
                            <div className="flex items-start space-x-3 animate-fade-in">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-gradient-primary text-white text-sm">
                                        {aiPersonality?.botName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <Card className="p-3 bg-muted/50">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                        <div
                                            className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                                        <div
                                            className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        <div ref={messagesEndRef}/>
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t border-border/50 p-4 bg-card/80 backdrop-blur-sm">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col w-full space-y-2">
                            {/* Textarea + Icons */}
                            <div className="flex items-end w-full gap-2">
                                <div className="flex-1 relative">
                                    <Textarea
                                        ref={inputRef}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder={`Message ${aiPersonality?.botName}...`}
                                        className="vibemate-input resize-none pr-24 min-h-[50px] max-h-[150px] rounded-lg"
                                        disabled={isTyping}
                                    />

                                    <div className="absolute right-2 top-2 flex items-center space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <Paperclip className="h-4 w-4"/>
                                        </Button>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.rtf,.txt,.html,.xml,.csv,.json,.epub,.zip,.tar,.gz,.rar,.7z,.png,.jpg,.jpeg,.tiff,.gif"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleVoiceInput}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <Mic className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isTyping}
                                    className="vibemate-button h-[50px] px-6"
                                >
                                    <Send className="h-4 w-4"/>
                                </Button>
                            </div>

                            {/* File Preview */}
                            {uploadedFile && (
                                <div className="flex items-center gap-2 mt-1 ml-1">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="h-20 rounded border shadow"
                                        />
                                    ) : (
                                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                                            📄 {uploadedFile.name}
                                        </div>
                                    )}
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => {
                                            setUploadedFile(null);
                                            setPreviewUrl(null);
                                        }}
                                    >
                                        ❌
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
;

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({message}) => {
    const {aiPersonality} = useUser();
    const isAI = message.sender === "ai";

    return (
        <div className={`flex items-start space-x-3 animate-fade-in ${
            isAI ? "" : "flex-row-reverse space-x-reverse"
        }`}>
            {isAI && (
                <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-primary text-white text-sm">
                        {aiPersonality?.botName?.[0]}
                    </AvatarFallback>
                </Avatar>
            )}

            <div className={`max-w-xs md:max-w-md lg:max-w-lg ${
                isAI ? "" : "flex flex-col items-end"
            }`}>
                <Card className={`p-3 ${
                    isAI
                        ? "bg-muted/50"
                        : "bg-gradient-primary text-primary-foreground"
                }`}>
                    <div className="prose whitespace-pre-wrap max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            skipHtml={false}
                        >
                            {message.text}
                        </ReactMarkdown>
                    </div>
                </Card>

                <p className="text-xs text-muted-foreground mt-1 px-1">
                    {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>
        </div>
    );
};

export default Chat;