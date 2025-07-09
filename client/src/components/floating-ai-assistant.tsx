import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, X, MessageCircle, Lightbulb, HelpCircle } from "lucide-react";
import { Link } from "wouter";

export default function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const quickHelp = [
    {
      icon: Lightbulb,
      title: "Get Study Tips",
      description: "Personalized learning strategies",
      action: "tips"
    },
    {
      icon: HelpCircle,
      title: "Ask Questions",
      description: "Get help with any topic",
      action: "help"
    },
    {
      icon: MessageCircle,
      title: "Start Chat",
      description: "Full conversation mode",
      action: "chat"
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <Card className="mb-4 w-80 shadow-lg animate-in slide-in-from-bottom-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Bot className="h-5 w-5 text-primary mr-2" />
                AI Assistant
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary font-medium mb-1">
                  👋 Hi there! I'm your AI learning assistant.
                </p>
                <p className="text-xs text-gray-600">
                  How can I help you with your learning today?
                </p>
              </div>
              
              {quickHelp.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link key={index} href="/ai-tutor">
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-3 h-auto"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-4 w-4 mr-3 text-primary" />
                      <div className="text-left">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Button>
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-4 pt-3 border-t">
              <Badge variant="secondary" className="text-xs">
                Available 24/7
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Button
        size="lg"
        className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Bot className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
