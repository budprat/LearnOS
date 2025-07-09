import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Brain, TrendingUp, Users, BarChart3, Clock, Award, CheckCircle, ArrowRight, Sparkles, Shield, Target, Globe, Zap } from "lucide-react";
import HeroIllustration from "@/components/hero-illustration";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
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
            <Button onClick={() => window.location.href = '/api/login'}>
              Get Started
            </Button>
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
                onClick={() => window.location.href = '/api/login'}
              >
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
            <div className="relative glass-effect rounded-2xl p-8">
              <HeroIllustration />
            </div>
          </div>
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
