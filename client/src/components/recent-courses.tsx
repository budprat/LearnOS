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
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors card-hover"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {userCourse.course?.title || "Course Title"}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {userCourse.course?.skillLevel || "Beginner"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                    {userCourse.course?.description || "Learn modern programming concepts and techniques"}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {userCourse.course?.estimatedDuration || 45} min
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${userCourse.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        {Math.round(userCourse.progress || 0)}%
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <Play className="h-4 w-4 mr-1" />
                  Continue
                </Button>
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
