import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Lock, ChevronRight, BookOpen, Brain, Code, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface Skill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  courses: number;
  icon: React.ComponentType<any>;
}

interface LearningNode {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'locked';
  progress: number;
  prerequisiteIds: string[];
  estimatedHours: number;
  skillCategory: string;
}

interface LearningProgressVisualizationProps {
  skills?: Skill[];
  learningNodes?: LearningNode[];
  overallProgress?: number;
}

const defaultSkills: Skill[] = [
  { id: '1', name: 'Critical Thinking', level: 3, maxLevel: 5, courses: 12, icon: Brain },
  { id: '2', name: 'Programming', level: 2, maxLevel: 5, courses: 8, icon: Code },
  { id: '3', name: 'Problem Solving', level: 4, maxLevel: 5, courses: 15, icon: Lightbulb },
  { id: '4', name: 'Research', level: 3, maxLevel: 5, courses: 10, icon: BookOpen },
];

const defaultLearningNodes: LearningNode[] = [
  {
    id: '1',
    title: 'Introduction to Programming',
    description: 'Learn the basics of programming concepts',
    status: 'completed',
    progress: 100,
    prerequisiteIds: [],
    estimatedHours: 10,
    skillCategory: 'Programming'
  },
  {
    id: '2',
    title: 'Data Structures',
    description: 'Master fundamental data structures',
    status: 'in-progress',
    progress: 65,
    prerequisiteIds: ['1'],
    estimatedHours: 15,
    skillCategory: 'Programming'
  },
  {
    id: '3',
    title: 'Algorithms',
    description: 'Understand algorithmic thinking',
    status: 'locked',
    progress: 0,
    prerequisiteIds: ['2'],
    estimatedHours: 20,
    skillCategory: 'Problem Solving'
  },
  {
    id: '4',
    title: 'Research Methods',
    description: 'Learn effective research techniques',
    status: 'completed',
    progress: 100,
    prerequisiteIds: [],
    estimatedHours: 8,
    skillCategory: 'Research'
  },
];

export default function LearningProgressVisualization({
  skills = defaultSkills,
  learningNodes = defaultLearningNodes,
  overallProgress = 45
}: LearningProgressVisualizationProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'in-progress':
        return <Circle className="h-5 w-5 text-primary animate-pulse" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Circle className="h-5 w-5" />;
    }
  };

  const getNodeStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-success bg-success/5';
      case 'in-progress':
        return 'border-primary bg-primary/5 ring-2 ring-primary/20';
      case 'locked':
        return 'border-muted bg-muted/5 opacity-60';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Learning Journey</CardTitle>
          <CardDescription>
            Track your progress across all learning paths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Overall Progress</span>
              <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Skills Development */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Development</CardTitle>
          <CardDescription>
            Your skill levels across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              const percentage = (skill.level / skill.maxLevel) * 100;
              
              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{skill.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {skill.courses} courses completed
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      Level {skill.level}/{skill.maxLevel}
                    </Badge>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Learning Path Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Path</CardTitle>
          <CardDescription>
            Your personalized learning journey with connected topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningNodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`transition-all duration-300 hover:shadow-md ${getNodeStyle(node.status)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getStatusIcon(node.status)}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{node.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {node.description}
                            </p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {node.estimatedHours}h
                          </Badge>
                        </div>
                        
                        {node.status === 'in-progress' && (
                          <div className="space-y-1">
                            <Progress value={node.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {node.progress}% complete
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2">
                          <Badge variant="secondary" className="text-xs">
                            {node.skillCategory}
                          </Badge>
                          
                          {node.status !== 'locked' && (
                            <Button size="sm" variant={node.status === 'completed' ? 'outline' : 'default'}>
                              {node.status === 'completed' ? 'Review' : 'Continue'}
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {index < learningNodes.length - 1 && (
                      <div className="absolute left-7 -bottom-4 w-0.5 h-8 bg-border" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}