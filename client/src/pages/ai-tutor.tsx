import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, User, Send, MessageSquare, Brain, BookOpen, Code } from "lucide-react";

export default function AiTutor() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [message, setMessage] = useState("");
  const [currentSession, setCurrentSession] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: sessions, isLoading: isSessionsLoading } = useQuery({
    queryKey: ['/api/ai-tutor/sessions'],
    retry: false,
  });

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; sessionId?: number }) => {
      const response = await apiRequest('POST', '/api/ai-tutor/chat', data);
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentSession(data);
      setMessage("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    chatMutation.mutate({
      message: message.trim(),
      sessionId: currentSession?.sessionId
    });
  };

  if (isLoading || !isAuthenticated || isSessionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-96 w-full rounded-xl" />
              </div>
              <div>
                <Skeleton className="h-96 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Tutor</h1>
          <p className="text-gray-600">
            Get personalized help and guidance from your AI learning assistant.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[700px] flex flex-col card-polish animate-fade-in">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-primary" />
                    AI Tutor
                    <Badge variant="outline" className="ml-2 text-xs">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                      Online
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-500">Always here to help</p>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-4">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {!currentSession ? (
                    <div className="text-center py-8">
                      <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Hello! I'm your AI tutor.
                      </h3>
                      <p className="text-gray-600 mb-6">
                        I'm here to help you understand any concept, solve problems, and guide your learning journey. What would you like to explore today?
                      </p>
                      
                      {/* Quick Actions */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setMessage("Can you explain this concept?")}
                            className="hover:bg-primary/10"
                          >
                            <Brain className="h-4 w-4 mr-1" />
                            Explain Concept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setMessage("I need help solving a problem")}
                            className="hover:bg-primary/10"
                          >
                            <Code className="h-4 w-4 mr-1" />
                            Problem Solving
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setMessage("Can you create a practice quiz?")}
                            className="hover:bg-primary/10"
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            Practice Quiz
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setMessage("Help me create a study plan")}
                            className="hover:bg-primary/10"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Study Plan
                          </Button>
                        </div>
                      </div>
                      
                      {/* Suggested Questions */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Suggested Questions</h4>
                        <div className="space-y-2 max-w-md mx-auto">
                          {[
                            "Can you explain calculus derivatives?",
                            "Help me solve this physics problem",
                            "Create a study plan for data science",
                            "What are the key concepts in machine learning?"
                          ].map((question, index) => (
                            <button
                              key={index}
                              onClick={() => setMessage(question)}
                              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                            >
                              "{question}"
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-gray-100 rounded-lg p-3">
                          <p className="text-sm">{message}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-primary/10 rounded-lg p-3">
                          <p className="text-sm">{currentSession.response}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask me anything about your learning..."
                    className="flex-1 min-h-[60px] resize-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || chatMutation.isPending}
                    size="icon"
                    className="h-[60px] w-[60px]"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Learning Stats */}
            <Card className="card-polish animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Today's Learning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Study time</span>
                  <span className="text-lg font-semibold text-primary">2.5 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Questions asked</span>
                  <span className="text-lg font-semibold text-primary">15 questions</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="progress-bar h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-gray-500">75% of daily goal completed</p>
              </CardContent>
            </Card>
            
            <Card className="card-polish">
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 Ask specific questions about topics you're struggling with
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    🎯 Request practice problems or examples
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">
                    📚 Get explanations for complex concepts
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700">
                    🔍 Ask for learning resources and recommendations
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions && sessions.length > 0 ? (
                  <div className="space-y-3">
                    {sessions.slice(0, 5).map((session: any) => (
                      <div
                        key={session.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate flex-1">
                            {session.topic || "Untitled Session"}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No previous sessions
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
