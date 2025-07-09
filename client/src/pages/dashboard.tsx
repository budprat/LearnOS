import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import WelcomeHero from "@/components/welcome-hero";
import LearningPath from "@/components/learning-path";
import AiRecommendations from "@/components/ai-recommendations";
import RecentCourses from "@/components/recent-courses";
import AiTutorWidget from "@/components/ai-tutor-widget";
import ProgressStats from "@/components/progress-stats";
import UpcomingAssessments from "@/components/upcoming-assessments";
import StudyGroup from "@/components/study-group";
import QuickAccess from "@/components/quick-access";
import FloatingAiAssistant from "@/components/floating-ai-assistant";
import { Skeleton } from "@/components/ui/skeleton";
import GamificationBadges from "@/components/gamification-badges";
import LearningProgressVisualization from "@/components/learning-progress-visualization";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
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

  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    retry: false,
  });

  const { data: gamificationData, isLoading: isGamificationLoading } = useQuery({
    queryKey: ['/api/gamification/achievements'],
    retry: false,
  });

  if (isLoading || !isAuthenticated || isDashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-96 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
              <div className="space-y-8">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Unable to load dashboard
            </h2>
            <p className="text-gray-600">
              Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeHero user={dashboardData.user} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Visualization */}
            <LearningProgressVisualization 
              overallProgress={
                dashboardData.userCourses.length > 0 
                  ? Math.round(dashboardData.userCourses.reduce((acc: number, uc: any) => acc + (uc.progress || 0), 0) / dashboardData.userCourses.length)
                  : 0
              }
            />
            
            {/* Gamification */}
            {gamificationData && (
              <GamificationBadges 
                achievements={gamificationData.achievements}
                streak={gamificationData.streak}
                totalPoints={gamificationData.totalPoints}
                level={gamificationData.level}
              />
            )}
            
            <LearningPath learningPaths={dashboardData.learningPaths} />
            <AiRecommendations recommendations={dashboardData.recommendations} />
            <RecentCourses userCourses={dashboardData.userCourses} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <AiTutorWidget />
            <ProgressStats user={dashboardData.user} />
            <UpcomingAssessments assessments={dashboardData.assessments} />
            <StudyGroup studyGroups={dashboardData.studyGroups} />
          </div>
        </div>

        <QuickAccess />
      </div>

      <FloatingAiAssistant />
    </div>
  );
}
