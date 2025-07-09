import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, TrendingUp, Users, Settings } from "lucide-react";
import { Link } from "wouter";

export default function QuickAccess() {
  const quickActions = [
    {
      icon: Book,
      title: "Browse Courses",
      description: "Explore new learning opportunities",
      href: "/courses",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "View Analytics",
      description: "Track your learning progress",
      href: "/analytics",
      color: "text-secondary"
    },
    {
      icon: Users,
      title: "Join Community",
      description: "Connect with fellow learners",
      href: "/community",
      color: "text-accent"
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Customize your experience",
      href: "/settings",
      color: "text-gray-600"
    }
  ];

  return (
    <Card className="mt-12">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Access</h2>
          <p className="text-gray-600">
            Jump into your most important learning activities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <Button
                  variant="ghost"
                  className="h-auto p-6 flex flex-col items-center text-center border border-gray-200 hover:shadow-md transition-all duration-200 card-hover bg-white"
                >
                  <Icon className={`h-8 w-8 ${action.color} mb-3`} />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {action.description}
                  </p>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
