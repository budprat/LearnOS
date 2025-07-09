import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Award, Target } from "lucide-react";

interface ProgressStatsProps {
  user: any;
}

export default function ProgressStats({ user }: ProgressStatsProps) {
  const stats = [
    {
      label: "Courses Completed",
      value: user?.completedCourses || 12,
      icon: Award
    },
    {
      label: "Learning Hours",
      value: `${user?.totalLearningHours || 87}h`,
      icon: Clock
    },
    {
      label: "Current Streak",
      value: `${user?.currentStreak || 7} days`,
      icon: TrendingUp
    },
    {
      label: "Skill Level",
      value: user?.skillLevel || "Intermediate",
      icon: Target,
      isStatus: true
    }
  ];

  const weeklyProgress = 71; // 5h out of 7h weekly goal
  const weeklyGoal = user?.weeklyGoalHours || 7;
  const currentHours = Math.round(weeklyProgress / 100 * weeklyGoal);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
              {stat.isStatus ? (
                <Badge variant="secondary" className="text-success">
                  {stat.value}
                </Badge>
              ) : (
                <span className="text-sm font-semibold text-gray-900">
                  {stat.value}
                </span>
              )}
            </div>
          );
        })}
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Weekly Goal</span>
            </div>
            <span className="text-sm text-gray-500">
              {currentHours}h / {weeklyGoal}h
            </span>
          </div>
          <Progress value={weeklyProgress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
