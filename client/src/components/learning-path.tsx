import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Check, Lock } from "lucide-react";

interface LearningPathProps {
  learningPaths: any[];
}

export default function LearningPath({ learningPaths }: LearningPathProps) {
  const currentPath = learningPaths?.[0] || {
    title: "Getting Started",
    currentStep: 1,
    totalSteps: 4,
    progress: 25
  };

  const steps = [
    { id: 1, title: "Basics", status: "completed", icon: Check },
    { id: 2, title: "Advanced", status: "current", icon: null },
    { id: 3, title: "Expert", status: "locked", icon: Lock },
    { id: 4, title: "Master", status: "locked", icon: Lock },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Learning Path</CardTitle>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Customize
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Learning Path Visualization */}
          <div className="flex items-center space-x-4 overflow-x-auto pb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex-shrink-0 relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                    step.status === "completed" 
                      ? "bg-success" 
                      : step.status === "current" 
                        ? "bg-primary" 
                        : "bg-gray-300"
                  }`}>
                    {Icon ? <Icon className="h-5 w-5" /> : step.id}
                  </div>
                  <div className="mt-2 text-sm text-center w-20">
                    <span className="font-medium">{step.title}</span>
                    <div className="text-xs text-gray-500">
                      {step.status === "completed" 
                        ? "Completed" 
                        : step.status === "current" 
                          ? "In Progress" 
                          : "Locked"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Current Progress */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Current Progress</span>
              <span className="text-sm text-gray-500">{currentPath.progress}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="progress-bar h-2 rounded-full transition-all duration-300" 
                style={{ width: `${currentPath.progress}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
