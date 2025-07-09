import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Play } from "lucide-react";

interface RecentCoursesProps {
  userCourses: any[];
}

export default function RecentCourses({ userCourses }: RecentCoursesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Learning</CardTitle>
      </CardHeader>
      <CardContent>
        {userCourses && userCourses.length > 0 ? (
          <div className="space-y-4">
            {userCourses.map((userCourse: any) => (
              <div
                key={userCourse.id}
                className="p-5 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 card-polish animate-fade-in"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {userCourse.course?.title || "Course Title"}
                      </h3>
                      <Badge 
                        variant={userCourse.course?.skillLevel === 'Advanced' ? 'default' : 
                                userCourse.course?.skillLevel === 'Intermediate' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {userCourse.course?.skillLevel || "Beginner"}
                      </Badge>
                    </div>
                    
                    {/* Progress bar with enhanced styling */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">
                          {userCourse.completedLessons || 14} of {userCourse.totalLessons || 32} lessons
                        </span>
                        <span className="text-xs font-medium text-primary">
                          {Math.round(userCourse.progress || 45)}% complete
                        </span>
                      </div>
                      <div className="progress-enhanced h-2">
                        <div
                          className="progress-bar h-full rounded-full transition-all duration-500"
                          style={{ width: `${userCourse.progress || 45}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Next lesson preview */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-xs text-gray-500 mb-1">Next lesson:</p>
                      <p className="text-sm font-medium text-gray-900">
                        {userCourse.nextLesson || "Introduction to Advanced Concepts"}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {userCourse.nextLessonDuration || 45} min
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses in progress
            </h3>
            <p className="text-gray-600 mb-4">
              Browse our course catalog to start your learning journey!
            </p>
            <Button>
              Browse Courses
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
