import { Card } from "@/components/ui/card";
import { Flame, Trophy } from "lucide-react";

interface WelcomeHeroProps {
  user: any;
}

export default function WelcomeHero({ user }: WelcomeHeroProps) {
  return (
    <Card className="mb-8 bg-gradient-to-r from-primary to-secondary p-8 text-white border-0">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName || "Learner"}!
          </h1>
          <p className="text-lg opacity-90 mb-4">
            Continue your learning journey with AI-powered personalization
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Flame className="h-5 w-5 text-amber-300 mr-2" />
              <span className="text-sm">{user?.currentStreak || 0} day streak</span>
            </div>
            <div className="flex items-center">
              <Trophy className="h-5 w-5 text-yellow-300 mr-2" />
              <span className="text-sm">Level {user?.level || 1}</span>
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="w-32 h-24 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white/80 text-sm">Learning</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
