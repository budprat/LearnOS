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
import { Users, MessageSquare, Book, Plus, User } from "lucide-react";

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

        {/* Featured Study Groups */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Featured Study Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary">JavaScript</Badge>
                  <Badge variant="outline">15 members</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">JavaScript Fundamentals</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Learn JavaScript basics together with daily challenges and group discussions.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <Avatar className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className="text-xs">J</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className="text-xs">M</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className="text-xs">S</AvatarFallback>
                    </Avatar>
                  </div>
                  <Button size="sm" variant="outline">
                    Join Group
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="outline">22 members</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">React Study Circle</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Advanced React concepts and best practices with hands-on projects.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <Avatar className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className="text-xs">A</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className="text-xs">B</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className="text-xs">C</AvatarFallback>
                    </Avatar>
                  </div>
                  <Button size="sm" variant="outline">
                    Join Group
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary">Python</Badge>
                  <Badge variant="outline">18 members</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Python for Data Science</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Learn Python for data analysis and machine learning applications.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <Avatar className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className="text-xs">D</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className="text-xs">E</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className="text-xs">F</AvatarFallback>
                    </Avatar>
                  </div>
                  <Button size="sm" variant="outline">
                    Join Group
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Study Groups */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>All Study Groups</CardTitle>
              </CardHeader>
              <CardContent>
                {studyGroups && studyGroups.length > 0 ? (
                  <div className="space-y-4">
                    {studyGroups.map((group: any) => (
                      <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              <Users className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">{group.name}</h3>
                            <p className="text-sm text-gray-600">{group.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {group.memberCount} members
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Active
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No study groups available
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Be the first to create a study group and start learning together!
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Group
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Members</span>
                  <span className="font-semibold">2,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Groups</span>
                  <span className="font-semibold">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Daily Discussions</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Study Sessions</span>
                  <span className="font-semibold">89</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">JavaScript</Badge>
                  <span className="text-sm text-gray-500">12 groups</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">React</Badge>
                  <span className="text-sm text-gray-500">8 groups</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Python</Badge>
                  <span className="text-sm text-gray-500">6 groups</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Data Science</Badge>
                  <span className="text-sm text-gray-500">5 groups</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Machine Learning</Badge>
                  <span className="text-sm text-gray-500">4 groups</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
