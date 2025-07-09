import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock, Users, Star, Filter, Search, TrendingUp, Award, BarChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function Courses() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  const { data: courses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ['/api/courses'],
    retry: false,
  });

  if (isLoading || !isAuthenticated || isCoursesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
              <p className="text-gray-600">
                Explore our comprehensive collection of courses designed to help you achieve your learning goals.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                New: 5 courses added
              </Badge>
            </div>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4 mt-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="space-y-6">
            <Card className="card-polish animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: 'All Courses', count: courses?.length || 0, value: 'all' },
                  { name: 'Programming', count: 12, value: 'programming' },
                  { name: 'Data Science', count: 8, value: 'data-science' },
                  { name: 'Mathematics', count: 6, value: 'mathematics' },
                  { name: 'Language Arts', count: 5, value: 'language' },
                  { name: 'Science', count: 7, value: 'science' }
                ].map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === category.value 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                    <Badge 
                      variant={selectedCategory === category.value ? "secondary" : "outline"} 
                      className="text-xs"
                    >
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
            
            <Card className="card-polish animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Learning Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Enrolled Courses</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">3</span>
                </div>
                <Progress value={62.5} className="mt-4" />
                <p className="text-xs text-gray-500 text-center">62.5% Overall Completion</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Course Grid */}
          <div className="lg:col-span-3">
            {courses && courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course: any, index: number) => (
                  <Card key={course.id} className="card-polish card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader className="pb-4">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <BookOpen className="h-16 w-16 text-primary relative z-10" />
                        {course.isNew && (
                          <Badge className="absolute top-3 right-3 z-10">New</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{course.category}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {course.skillLevel}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{course.estimatedDuration || 45}m</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>2.1k</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          <span>4.8</span>
                        </div>
                      </div>
                      
                      {course.userEnrolled ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{course.progress || 0}%</span>
                          </div>
                          <Progress value={course.progress || 0} className="h-2" />
                          <Button className="w-full" variant="outline">
                            Continue Learning
                          </Button>
                        </div>
                      ) : (
                        <Button className="w-full group">
                          <span className="group-hover:scale-105 transition-transform">Enroll Now</span>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No courses available</h2>
                <p className="text-gray-600">
                  Check back later for new courses or contact support.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
