import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Code, FileText, AlertCircle } from "lucide-react";

interface UpcomingAssessmentsProps {
  assessments: any[];
}

export default function UpcomingAssessments({ assessments }: UpcomingAssessmentsProps) {
  const getAssessmentIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return FileText;
      case "project":
        return Code;
      default:
        return FileText;
    }
  };

  const getAssessmentColor = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const daysDiff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 2) return "amber";
    if (daysDiff <= 5) return "blue";
    return "gray";
  };

  const formatDueDate = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const daysDiff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return "Due today";
    if (daysDiff === 1) return "Due tomorrow";
    if (daysDiff < 7) return `Due in ${daysDiff} days`;
    return due.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assessments</CardTitle>
      </CardHeader>
      <CardContent>
        {assessments && assessments.length > 0 ? (
          <div className="space-y-3">
            {assessments.map((assessment: any) => {
              const Icon = getAssessmentIcon(assessment.type);
              const colorScheme = getAssessmentColor(assessment.dueDate);
              
              return (
                <div
                  key={assessment.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    colorScheme === "amber" 
                      ? "bg-amber-50 border-amber-200" 
                      : colorScheme === "blue"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${
                      colorScheme === "amber" 
                        ? "text-amber-500" 
                        : colorScheme === "blue"
                          ? "text-blue-500"
                          : "text-gray-500"
                    }`} />
                    <div>
                      <p className={`text-sm font-medium ${
                        colorScheme === "amber" 
                          ? "text-amber-800" 
                          : colorScheme === "blue"
                            ? "text-blue-800"
                            : "text-gray-800"
                      }`}>
                        {assessment.title}
                      </p>
                      <p className={`text-xs ${
                        colorScheme === "amber" 
                          ? "text-amber-600" 
                          : colorScheme === "blue"
                            ? "text-blue-600"
                            : "text-gray-600"
                      }`}>
                        {formatDueDate(assessment.dueDate)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {assessment.type}
                  </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              No upcoming assessments
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
