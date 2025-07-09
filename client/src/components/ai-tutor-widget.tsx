import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Lightbulb, HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "wouter";

export default function AiTutorWidget() {
  const suggestions = [
    {
      type: "tip",
      icon: Lightbulb,
      message: "Based on your recent performance, I recommend practicing more array manipulation problems.",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      iconColor: "text-amber-500"
    },
    {
      type: "help",
      icon: HelpCircle,
      message: "Need help with React hooks? I can provide personalized explanations!",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      iconColor: "text-blue-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="h-5 w-5 text-primary mr-2" />
          AI Tutor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <div
              key={index}
              className={`${suggestion.bgColor} rounded-lg p-3`}
            >
              <p className={`text-sm ${suggestion.textColor} flex items-start`}>
                <Icon className={`h-4 w-4 mr-2 mt-0.5 ${suggestion.iconColor} flex-shrink-0`} />
                {suggestion.message}
              </p>
            </div>
          );
        })}
        
        <Link href="/ai-tutor">
          <Button className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat with AI Tutor
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
