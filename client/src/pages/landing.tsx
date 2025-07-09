import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Brain, TrendingUp, Users } from "lucide-react";

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
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered
            <br />
            <span className="text-primary">Personalized Learning</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your learning journey with intelligent tutoring, adaptive content delivery, 
            and comprehensive analytics. Experience education that adapts to your unique needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => window.location.href = '/api/login'}
            >
              Start Learning Today
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose LearnAI?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI technology with proven educational methodologies 
            to deliver personalized learning experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="card-hover">
            <CardHeader>
              <Brain className="h-12 w-12 text-primary mb-4" />
              <CardTitle>AI-Powered Tutoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get personalized guidance from our intelligent tutoring system that adapts to your learning style and pace.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-secondary mb-4" />
              <CardTitle>Adaptive Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Experience content that adjusts difficulty and pacing based on your performance and understanding.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <Users className="h-12 w-12 text-accent mb-4" />
              <CardTitle>Collaborative Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Join study groups and collaborate with peers in real-time workspaces designed for learning.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <GraduationCap className="h-12 w-12 text-primary mb-4" />
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
