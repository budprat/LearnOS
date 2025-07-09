import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  BookOpen, 
  Clock, 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  Users,
  Award,
  CheckCircle,
  BarChart3,
  Target
} from "lucide-react";

export default function PlatformScreenshot() {
  return (
    <div className="relative">
      {/* Main Dashboard Screenshot */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">LearnAI Dashboard</h3>
              <p className="text-sm text-gray-500">Welcome back, Alex!</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <Target className="h-3 w-3 mr-1" />
            On Track
          </Badge>
        </div>

        {/* Today's Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Today's Progress</h4>
              <span className="text-sm text-gray-500">3 of 5 lessons</span>
            </div>
            <Progress value={60} className="h-2 mb-3" />
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="font-semibold text-primary">2.5hrs</p>
                <p className="text-gray-500">Time spent</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-green-600">85%</p>
                <p className="text-gray-500">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-blue-600">12</p>
                <p className="text-gray-500">XP earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Lesson */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Play className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">React Components</h4>
                <p className="text-sm text-gray-500">Interactive lesson • 15 min remaining</p>
              </div>
              <Button size="sm" className="px-6">
                Continue
              </Button>
            </div>
            <Progress value={75} className="h-2" />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Recent Activity</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">JavaScript Fundamentals</p>
                <p className="text-xs text-gray-500">Completed 30 min ago</p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200">
                100%
              </Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Brain className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">AI Tutor Session</p>
                <p className="text-xs text-gray-500">Discussed state management</p>
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                Helpful
              </Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Users className="h-5 w-5 text-purple-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Study Group</p>
                <p className="text-xs text-gray-500">Joined "React Beginners"</p>
              </div>
              <Badge variant="outline" className="text-purple-600 border-purple-200">
                Active
              </Badge>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}