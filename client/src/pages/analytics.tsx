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
  AlertCircle,
  Brain 
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

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
          <Card className="card-polish animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Progress</p>
                  <p className="text-3xl font-bold text-gray-900">{userStats.totalProgress || 87.3}%</p>
                  <p className="text-xs text-green-600 mt-1">+12% this month</p>
                </div>
                <div className="relative">
                  <CheckCircle className="h-10 w-10 text-success" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-polish animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-gray-900">{userStats.monthlyHours || 42.5}h</p>
                  <p className="text-xs text-primary mt-1">+8h from last month</p>
                </div>
                <Clock className="h-10 w-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-polish animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lessons Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{userStats.lessonsCompleted || 184}</p>
                  <p className="text-xs text-accent mt-1">+23 this week</p>
                </div>
                <Book className="h-10 w-10 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-polish animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Points Earned</p>
                  <p className="text-3xl font-bold text-gray-900">{userStats.totalPoints || 1247}</p>
                  <p className="text-xs text-secondary mt-1">+156 this week</p>
                </div>
                <Award className="h-10 w-10 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Activity Chart */}
          <Card className="card-polish animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Weekly Learning Activity
                </span>
                <Badge variant="secondary" className="text-xs">This Week</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { day: 'Mon', hours: 2.5, tasks: 4 },
                  { day: 'Tue', hours: 3.2, tasks: 6 },
                  { day: 'Wed', hours: 1.8, tasks: 3 },
                  { day: 'Thu', hours: 4.1, tasks: 8 },
                  { day: 'Fri', hours: 2.9, tasks: 5 },
                  { day: 'Sat', hours: 3.8, tasks: 7 },
                  { day: 'Sun', hours: 2.2, tasks: 4 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#1e40af" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="tasks" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span className="text-xs text-gray-600">Study Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded"></div>
                  <span className="text-xs text-gray-600">Tasks Completed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skill Progress Radar Chart */}
          <Card className="card-polish animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Skill Area Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={[
                  { skill: 'Mathematics', current: 85, target: 90 },
                  { skill: 'Science', current: 78, target: 85 },
                  { skill: 'Programming', current: 92, target: 95 },
                  { skill: 'Language Arts', current: 76, target: 80 },
                  { skill: 'History', current: 82, target: 85 }
                ]}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Current" dataKey="current" stroke="#1e40af" fill="#1e40af" fillOpacity={0.6} />
                  <Radar name="Target" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
              
              {/* Skill Progress List */}
              <div className="space-y-3 mt-4">
                {[
                  { name: 'Mathematics', progress: 85, change: '+5%' },
                  { name: 'Science', progress: 78, change: '+3%' },
                  { name: 'Programming', progress: 92, change: '+8%' },
                  { name: 'Language Arts', progress: 76, change: '+2%' },
                  { name: 'History', progress: 82, change: '+4%' }
                ].map((skill, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-gray-500">{skill.progress}% {skill.change}</span>
                    </div>
                    <div className="progress-enhanced h-2">
                      <div
                        className="progress-bar h-full rounded-full transition-all duration-500"
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Insights */}
          <Card className="card-polish animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Peak Learning Time</span>
                  <Badge variant="outline" className="text-xs">AI Analysis</Badge>
                </div>
                <p className="text-lg font-bold text-blue-900">2:00 PM - 4:00 PM</p>
                <p className="text-xs text-blue-700 mt-1">You're most productive during afternoon hours</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-900">Accuracy Rate</span>
                  <span className="text-lg font-bold text-green-900">94.2%</span>
                </div>
                <p className="text-xs text-green-700">Excellent problem-solving consistency</p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-900">Learning Streak</span>
                  <span className="text-lg font-bold text-orange-900">15 days</span>
                </div>
                <p className="text-xs text-orange-700">Keep up the momentum!</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-900">Peer Ranking</span>
                  <span className="text-lg font-bold text-purple-900">Top 10%</span>
                </div>
                <p className="text-xs text-purple-700">Among learners in your cohort</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="card-polish animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Math Wizard', time: 'Today', points: 100, icon: '🧙' },
                { name: 'Problem Solver', time: 'Yesterday', points: 75, icon: '💡' },
                { name: 'Study Streak', time: '2 days ago', points: 50, icon: '🔥' },
                { name: 'Quick Learner', time: '3 days ago', points: 80, icon: '⚡' }
              ].map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{achievement.name}</p>
                      <p className="text-xs text-gray-500">{achievement.time}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    +{achievement.points} pts
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Monthly Goals */}
          <Card className="card-polish animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Monthly Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Study Hours</span>
                  <span className="text-xs text-gray-500">42.5 / 60h</span>
                </div>
                <div className="progress-enhanced h-3">
                  <div className="progress-bar h-full rounded-full" style={{ width: '71%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Lessons Completed</span>
                  <span className="text-xs text-gray-500">184 / 200</span>
                </div>
                <div className="progress-enhanced h-3">
                  <div className="progress-bar h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Skill Assessments</span>
                  <span className="text-xs text-gray-500">8 / 10</span>
                </div>
                <div className="progress-enhanced h-3">
                  <div className="progress-bar h-full rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">Keep going! You're doing great!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
