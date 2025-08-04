import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card.tsx";
import { Input } from "../ui/input.tsx";
import { Label } from "../ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select.tsx";
import { Heart, User } from "lucide-react";
import type {UserData} from "../../contexts/UserContext";

const UserInfoStep = () => {
  const { userData, updateUserData } = useUser();
  
  const [formData, setFormData] = useState<UserData>({
    userId: userData?.userId || "",
    fullName: userData?.fullName || "",
    age: userData?.age || undefined,
    gender: userData?.gender || "",
  });

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Prefer not to say", label: "Prefer not to say" },
  ];

  useEffect(() => {
    console.log("UserInfoStep: Form data changed:", formData);
    if (!localStorage.getItem("vibemate-user-data")) {
      if (formData.fullName && formData.gender && formData.age) {
        console.log("UserInfoStep: Updating user data with valid form");
        updateUserData(formData).then();
      } else {
        console.log("UserInfoStep: Form data incomplete", {
          hasName: !!formData.fullName,
          hasGender: !!formData.gender,
          hasAge: !!formData.age
        });
      }
    }
  }, [formData, updateUserData]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-primary rounded-full">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-display font-bold gradient-text">
          Hey! Let's know a bit about you first 🧡
        </h2>
        <p className="text-muted-foreground text-lg">
          This helps us create the perfect AI companion just for you
        </p>
      </div>

      {/* Form */}
      <Card className="vibemate-card animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-primary" />
            <span>About You</span>
          </CardTitle>
          <CardDescription>
            Tell us about yourself so we can personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium">
              What's your name? <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.fullName}
              onChange={(e: { target: { value: any; }; }) => setFormData((prev: any) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Enter your name"
              className="vibemate-input text-lg"
              required
            />
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age" className="text-base font-medium">
              Age <span className="text-destructive">*</span>
            </Label>
            <Input
              id="age"
              type="number"
              value={formData.age || ""}
              onChange={(e: { target: { value: string; }; }) => setFormData((prev: any) => ({
                ...prev,
                age: e.target.value ? parseInt(e.target.value) : undefined
              }))}
              placeholder="Your age"
              className="vibemate-input"
              min="13"
              max="120"
              required
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Gender <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value: any) => setFormData((prev: any) => ({ ...prev, gender: value }))}
            >
              <SelectTrigger className="vibemate-input">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserInfoStep;