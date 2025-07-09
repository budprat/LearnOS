import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Brain, TrendingUp, Users, BarChart3, Clock, Award, CheckCircle, ArrowRight, Sparkles, Shield, Target, Globe, Zap, Calendar, MessageSquare, BookOpen, Play, Volume2, Mic, Send, ChevronRight, Star, Trophy, Target as TargetIcon } from "lucide-react";
import PlatformScreenshot from "@/components/platform-screenshot";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Landing() {
  const [aiMessage, setAiMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  
  // Mock data for previews
  const weeklyActivity = [
    { day: 'Mon', hours: 2.5, lessons: 3 },
    { day: 'Tue', hours: 3.2, lessons: 4 },
    { day: 'Wed', hours: 1.8, lessons: 2 },
    { day: 'Thu', hours: 4.1, lessons: 5 },
    { day: 'Fri', hours: 3.5, lessons: 4 },
    { day: 'Sat', hours: 2.8, lessons: 3 },
    { day: 'Sun', hours: 1.5, lessons: 2 }
  ];

  const analyticsData = [
    { subject: 'Math', progress: 85, trend: 'up' },
    { subject: 'Science', progress: 78, trend: 'up' },
    { subject: 'English', progress: 92, trend: 'stable' },
    { subject: 'History', progress: 67, trend: 'down' }
  ];

  const aiQuestions = [
    "Explain quantum physics in simple terms",
    "Help me solve this algebra problem",
    "What's the best way to study for exams?",
    "How do I improve my writing skills?"
  ];

  const handleAiDemo = (question: string) => {
    setAiMessage(question);
    setAiResponse("I'd be happy to help you with that! Let me provide a personalized explanation based on your learning style and current progress...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary mr-3" />
              <span className="text-xl font-bold text-gray-900">LearnAI</span>
            </div>
            <Link href="/auth">
              <Button>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <Badge variant="secondary" className="mb-4 animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Learning Platform
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Learn Smarter with
              <br />
              <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Personalized AI
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform your learning journey with intelligent tutoring, adaptive content delivery, 
              and comprehensive analytics. Experience education that adapts to your unique needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button 
                size="lg" 
                className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all group"
                asChild
              >
                <Link href="/auth">
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-3 group"
              >
                <Zap className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-6 flex-wrap justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Enterprise-grade Security</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="h-4 w-4 text-blue-600" />
                <span>Available Worldwide</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target className="h-4 w-4 text-purple-600" />
                <span>Goal-oriented Learning</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-primary">100K+</p>
                <p className="text-sm text-gray-600">Active Learners</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-primary">95%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-primary">24/7</p>
                <p className="text-sm text-gray-600">AI Support</p>
              </div>
            </div>
          </div>
          
          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl"></div>
            <div className="relative">
              <PlatformScreenshot />
            </div>
          </div>
        </div>
      </div>

      {/* Platform Preview Sections */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Live Preview</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Experience the Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how our AI-powered features adapt to your learning style
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Today's Learning */}
            <Card className="card-polish animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TargetIcon className="h-5 w-5 text-primary" />
                  Today's Learning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Daily Goal</span>
                    <span className="text-sm text-gray-600">3 of 5 lessons</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">JavaScript Fundamentals</p>
                      <p className="text-xs text-gray-500">Completed 30 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <Play className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">React Components</p>
                      <p className="text-xs text-gray-500">In progress • 15 min left</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">State Management</p>
                      <p className="text-xs text-gray-500">Next • 25 min</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card className="card-polish animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-primary">18.4 hrs</p>
                    <p className="text-gray-600">This week</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-green-600">+2.1 hrs</p>
                    <p className="text-gray-600">vs last week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="card-polish animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">AI Tutoring Session</p>
                    <p className="text-xs text-gray-500">2:00 PM • 60 min</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Study Group</p>
                    <p className="text-xs text-gray-500">4:00 PM • 90 min</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Award className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Math Assessment</p>
                    <p className="text-xs text-gray-500">Tomorrow • 120 min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Insights & Analytics */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* AI Insights */}
            <div className="animate-fade-in">
              <Badge variant="outline" className="mb-4">AI Insights</Badge>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Personalized Learning Recommendations
              </h3>
              <p className="text-gray-600 mb-6">
                Our AI analyzes your learning patterns and suggests personalized content
              </p>
              <Card className="card-polish">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Brain className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Based on your progress in JavaScript...</p>
                        <p className="text-sm text-gray-600 mt-1">
                          I recommend focusing on React fundamentals. You've mastered the basics, 
                          and this is the perfect next step for your web development journey.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Your learning velocity is excellent!</p>
                        <p className="text-sm text-gray-600 mt-1">
                          You're 23% faster than average learners. Consider challenging yourself 
                          with advanced topics or helping peers in study groups.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Learning Analytics */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Badge variant="outline" className="mb-4">Learning Analytics</Badge>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Track Your Progress
              </h3>
              <p className="text-gray-600 mb-6">
                Comprehensive analytics to understand your learning journey
              </p>
              <Card className="card-polish">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {analyticsData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span className="font-medium">{item.subject}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{item.progress}%</span>
                          <TrendingUp className={`h-4 w-4 ${
                            item.trend === 'up' ? 'text-green-500' : 
                            item.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tutor Demo */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">AI Tutor Demo</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Try Our AI Tutor
            </h2>
            <p className="text-xl text-gray-600">
              Ask anything and see how our AI adapts to your learning style
            </p>
          </div>

          <Card className="card-polish animate-fade-in">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Quick Actions */}
                <div>
                  <h4 className="font-medium mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {aiQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start text-left h-auto py-3 px-4"
                        onClick={() => handleAiDemo(question)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">{question}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Input
                      placeholder="Ask me anything about your learning..."
                      value={aiMessage}
                      onChange={(e) => setAiMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>

                  {aiResponse && (
                    <div className="bg-primary/5 rounded-lg p-4 animate-fade-in">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Brain className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-primary mb-1">AI Tutor</p>
                          <p className="text-gray-700">{aiResponse}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven educational methodologies 
              to deliver personalized learning experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="card-polish card-hover animate-fade-in">
              <CardHeader>
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>AI-Powered Tutoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get personalized guidance from our intelligent tutoring system that adapts to your learning style and pace.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-polish card-hover animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle>Adaptive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Experience content that adjusts difficulty and pacing based on your performance and understanding.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-polish card-hover animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Collaborative Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Join study groups and collaborate with peers in real-time workspaces designed for learning.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-polish card-hover animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Progress Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track your learning journey with comprehensive analytics and insights to optimize your progress.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Process</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and see results in days
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up & Assessment</h3>
              <p className="text-gray-600">
                Create your account and complete our AI-powered assessment to understand your learning style and goals.
              </p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Path</h3>
              <p className="text-gray-600">
                Receive a customized learning path tailored to your skills, interests, and career objectives.
              </p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn & Achieve</h3>
              <p className="text-gray-600">
                Engage with adaptive content, track your progress, and achieve your learning goals with AI support.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by Learners Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Software Developer",
                content: "The AI tutor helped me master React in just 3 weeks. The personalized approach made all the difference!",
                rating: 5
              },
              {
                name: "Michael Torres",
                role: "Data Scientist",
                content: "Best learning platform I've used. The adaptive content keeps me engaged and challenged at the perfect level.",
                rating: 5
              },
              {
                name: "Emily Johnson",
                role: "Product Manager",
                content: "The analytics features help me track my progress and identify areas for improvement. Highly recommended!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="card-polish animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Award key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/80">
            Join thousands of learners who are already experiencing the future of education.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 py-3"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
}
