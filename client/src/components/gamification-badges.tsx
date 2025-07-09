import { Trophy, Star, Target, Flame, Award, Zap, Medal, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  progress: number;
  total: number;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface GamificationBadgesProps {
  achievements: Achievement[];
  streak: number;
  totalPoints: number;
  level: number;
}

const rarityColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500'
};

const defaultAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first course',
    icon: Star,
    progress: 0,
    total: 1,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: '2',
    title: 'Dedicated Learner',
    description: 'Maintain a 7-day learning streak',
    icon: Flame,
    progress: 0,
    total: 7,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: '3',
    title: 'Knowledge Seeker',
    description: 'Complete 10 courses',
    icon: Trophy,
    progress: 0,
    total: 10,
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: '4',
    title: 'Master Mind',
    description: 'Achieve 90% or higher on 5 assessments',
    icon: Crown,
    progress: 0,
    total: 5,
    unlocked: false,
    rarity: 'legendary'
  },
  {
    id: '5',
    title: 'Speed Learner',
    description: 'Complete a course in under 2 hours',
    icon: Zap,
    progress: 0,
    total: 1,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: '6',
    title: 'Perfect Score',
    description: 'Get 100% on any assessment',
    icon: Medal,
    progress: 0,
    total: 1,
    unlocked: false,
    rarity: 'epic'
  }
];

export default function GamificationBadges({ 
  achievements = defaultAchievements, 
  streak = 0, 
  totalPoints = 0, 
  level = 1 
}: GamificationBadgesProps) {
  const nextLevelPoints = level * 1000;
  const currentLevelProgress = (totalPoints % 1000) / 10;

  return (
    <div className="space-y-6">
      {/* Level and Streak Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Your Progress
          </CardTitle>
          <CardDescription>
            Track your learning journey and unlock achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Level Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Level {level}</span>
                <span className="text-sm text-muted-foreground">
                  {totalPoints} / {nextLevelPoints} XP
                </span>
              </div>
              <Progress value={currentLevelProgress} className="h-2" />
            </div>

            {/* Learning Streak */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10">
                <Flame className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{streak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>

            {/* Total Points */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Achievements
          </CardTitle>
          <CardDescription>
            Unlock badges by completing learning milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              const isUnlocked = achievement.unlocked;
              const progress = (achievement.progress / achievement.total) * 100;

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`relative overflow-hidden transition-all duration-300 ${
                      isUnlocked 
                        ? 'border-accent shadow-lg shadow-accent/20' 
                        : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    {isUnlocked && (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                    )}
                    
                    <CardContent className="p-4 relative">
                      <div className="flex items-start gap-3">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                          isUnlocked 
                            ? `${rarityColors[achievement.rarity]} text-white` 
                            : 'bg-muted'
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <h4 className="font-semibold text-sm">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {achievement.description}
                          </p>
                          
                          {!isUnlocked && (
                            <div className="space-y-1 mt-2">
                              <Progress value={progress} className="h-1.5" />
                              <p className="text-xs text-muted-foreground">
                                {achievement.progress} / {achievement.total}
                              </p>
                            </div>
                          )}
                          
                          {isUnlocked && achievement.unlockedAt && (
                            <p className="text-xs text-success mt-2">
                              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {isUnlocked && (
                        <Badge 
                          variant="secondary" 
                          className={`absolute top-2 right-2 text-xs ${rarityColors[achievement.rarity]} text-white`}
                        >
                          {achievement.rarity}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}