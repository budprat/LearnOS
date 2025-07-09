import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, MessageSquare, Book, Plus, User, Calendar, Award, TrendingUp, Clock, Star } from "lucide-react";

export default function Community() {
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

  const { data: studyGroups, isLoading: isStudyGroupsLoading } = useQuery({
    queryKey: ['/api/study-groups'],
    retry: false,
  });

  if (isLoading || !isAuthenticated || isStudyGroupsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Community</h1>
            <p className="text-gray-600">
              Connect with fellow learners and join study groups to enhance your learning experience.
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-polish animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Groups</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-polish animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">1,248</p>
                </div>
                <User className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-polish animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Discussions</p>
                  <p className="text-2xl font-bold text-gray-900">3,847</p>
                </div>
                <MessageSquare className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-polish animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Study Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
                <Calendar className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Study Groups */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-polish animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Featured Study Groups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group p-4 border rounded-lg hover:shadow-lg transition-all card-polish">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">JavaScript</Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        15 members
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      JavaScript Fundamentals
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Learn JavaScript basics together with daily challenges and group discussions.
                    </p>
                    <div className="flex items-center mb-3">
                      <div className="flex -space-x-2 mr-3">
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">J</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs bg-green-100 text-green-700">M</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs bg-purple-100 text-purple-700">S</AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-xs text-gray-500">+12 others</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span>Active now</span>
                      </div>
                      <Button size="sm" className="group-hover:bg-primary group-hover:text-white">
                        Join Group
                      </Button>
                    </div>
                  </div>

                  <div className="group p-4 border rounded-lg hover:shadow-lg transition-all card-polish">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">React</Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        22 members
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      React Study Circle
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Advanced React concepts and best practices with hands-on projects.
                    </p>
                    <div className="flex items-center mb-3">
                      <div className="flex -space-x-2 mr-3">
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs bg-orange-100 text-orange-700">A</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs bg-pink-100 text-pink-700">B</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">C</AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-xs text-gray-500">+19 others</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>Popular</span>
                      </div>
                      <Button size="sm" className="group-hover:bg-primary group-hover:text-white">
                        Join Group
                      </Button>
                    </div>
                  </div>

                  <div className="group p-4 border rounded-lg hover:shadow-lg transition-all card-polish">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">Python</Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        18 members
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      Python for Data Science
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Learn Python for data analysis and machine learning applications.
                    </p>
                    <div className="flex items-center mb-3">
                      <div className="flex -space-x-2 mr-3">
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs bg-red-100 text-red-700">D</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs bg-teal-100 text-teal-700">E</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs bg-cyan-100 text-cyan-700">F</AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-xs text-gray-500">+15 others</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3 text-blue-500" />
                        <span>Next session: Today</span>
                      </div>
                      <Button size="sm" className="group-hover:bg-primary group-hover:text-white">
                        Join Group
                      </Button>
                    </div>
                  </div>

                  <div className="group p-4 border rounded-lg hover:shadow-lg transition-all card-polish">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">Math</Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        12 members
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      Calculus Preparation
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Master calculus concepts with practice problems and peer support.
                    </p>
                    <div className="flex items-center mb-3">
                      <div className="flex -space-x-2 mr-3">
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs bg-amber-100 text-amber-700">G</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs bg-lime-100 text-lime-700">H</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs bg-yellow-100 text-yellow-700">I</AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-xs text-gray-500">+9 others</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Award className="h-3 w-3 text-purple-500" />
                        <span>New group</span>
                      </div>
                      <Button size="sm" className="group-hover:bg-primary group-hover:text-white">
                        Join Group
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card className="card-polish animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  This Week's Top Learners
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Sarah Johnson', points: 1450, change: '+120', rank: 1 },
                  { name: 'Mike Chen', points: 1380, change: '+95', rank: 2 },
                  { name: 'Emma Davis', points: 1290, change: '+80', rank: 3 },
                  { name: 'Alex Kim', points: 1220, change: '+75', rank: 4 },
                  { name: 'You', points: 1150, change: '+65', rank: 5, isCurrentUser: true }
                ].map((learner, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      learner.isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        learner.rank === 1 ? 'bg-yellow-400 text-white' :
                        learner.rank === 2 ? 'bg-gray-300 text-gray-700' :
                        learner.rank === 3 ? 'bg-orange-400 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {learner.rank}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{learner.name}</p>
                        <p className="text-xs text-gray-500">{learner.points} points</p>
                      </div>
                    </div>
                    <span className="text-xs text-green-600 font-medium">{learner.change}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="card-polish animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: 'JavaScript Q&A', time: 'Today, 3:00 PM', group: 'JS Fundamentals' },
                  { title: 'React Hooks Workshop', time: 'Tomorrow, 2:00 PM', group: 'React Circle' },
                  { title: 'Python Study Group', time: 'Wed, 4:00 PM', group: 'Python DS' },
                  { title: 'Math Problem Solving', time: 'Thu, 5:00 PM', group: 'Calculus Prep' }
                ].map((event, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                    <p className="text-xs text-primary mt-1">{event.group}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
