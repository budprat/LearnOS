import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  Clock, 
  Award, 
  Target, 
  Book, 
  BarChart3, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";

export default function Analytics() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['/api/analytics'],
    retry: false,
  });

  if (isLoading || !isAuthenticated || isAnalyticsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="h-96 w-full rounded-xl" />
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Unable to load analytics
            </h2>
            <p className="text-gray-600">
              Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { userStats, analysis } = analytics;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Analytics</h1>
          <p className="text-gray-600">
            Track your progress and discover insights about your learning journey.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Courses Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.completedCourses}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Learning Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.learningHours}h</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.currentStreak} days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Level</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.level}</p>
                </div>
                <Award className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strengths & Weaknesses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  Strengths
                </h3>
                <div className="space-y-2">
                  {analysis.strengths.length > 0 ? (
                    analysis.strengths.map((strength: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <Badge variant="secondary" className="mr-2">✓</Badge>
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Complete more courses to see your strengths</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-warning" />
                  Areas for Improvement
                </h3>
                <div className="space-y-2">
                  {analysis.weaknesses.length > 0 ? (
                    analysis.weaknesses.map((weakness: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <Badge variant="outline" className="mr-2">!</Badge>
                        <span className="text-sm">{weakness}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No areas for improvement identified</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations & Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">AI Recommendations</h3>
                <div className="space-y-2">
                  {analysis.recommendations.length > 0 ? (
                    analysis.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">{rec}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No recommendations available</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Next Steps</h3>
                <div className="space-y-2">
                  {analysis.nextSteps.length > 0 ? (
                    analysis.nextSteps.map((step: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <Badge variant="outline" className="mr-2 text-xs">
                          {index + 1}
                        </Badge>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Complete assessments to see next steps</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Message */}
        {analysis.motivationalMessage && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Keep Going! 🎉
                </h3>
                <p className="text-gray-600">{analysis.motivationalMessage}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
