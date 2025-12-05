import { useEffect, useState, useRef, useCallback } from "react";
import { useRoute } from "wouter";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  BookOpen,
  FileText,
  CheckCircle,
  Circle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Volume2,
  VolumeX,
  Settings,
  PenTool,
  MessageCircle,
  Star,
  Clock,
  Target,
  Award,
  Brain,
  Lightbulb,
  HelpCircle,
  CheckSquare,
  XCircle,
  AlertCircle,
  RefreshCw,
  Maximize,
  Minimize,
  RotateCcw,
  Timer,
  Trophy
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface LessonContent {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  prerequisites: string[];
  learningObjectives: string[];
  interactiveElements: InteractiveElement[];
  assessments: Assessment[];
  resources: Resource[];
}

interface InteractiveElement {
  id: string;
  type: 'quiz' | 'coding' | 'drag-drop' | 'matching' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hints: string[];
  position: number; // Position in content
}

interface Assessment {
  id: string;
  type: 'quiz' | 'assignment' | 'project';
  title: string;
  questions: Question[];
  timeLimit?: number;
  attempts: number;
  passingScore: number;
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'code';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'video' | 'article';
  url: string;
  description: string;
}

interface UserProgress {
  lessonId: string;
  userId: string;
  progress: number;
  timeSpent: number;
  completedSections: string[];
  notes: Note[];
  bookmarks: Bookmark[];
  lastPosition: number;
  assessmentResults: AssessmentResult[];
}

interface Note {
  id: string;
  content: string;
  position: number;
  timestamp: Date;
  highlighted: boolean;
}

interface Bookmark {
  id: string;
  position: number;
  title: string;
  timestamp: Date;
}

interface AssessmentResult {
  assessmentId: string;
  score: number;
  answers: { [questionId: string]: string };
  completedAt: Date;
  timeSpent: number;
}

export default function Lesson() {
  const [match, params] = useRoute("/lesson/:id");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const [activeTab, setActiveTab] = useState("content");
  const [currentNote, setCurrentNote] = useState("");
  const [highlightedText, setHighlightedText] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<{ [key: string]: string }>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult | null>(null);
  const [assessmentTimer, setAssessmentTimer] = useState<number | null>(null);
  const [assessmentStartTime, setAssessmentStartTime] = useState<number | null>(null);
  const [showHints, setShowHints] = useState<{ [key: string]: boolean }>({});

  // Helper function to format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Assessment timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (currentAssessment && currentAssessment.timeLimit && assessmentStartTime && !assessmentSubmitted) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - assessmentStartTime) / 1000);
        const remaining = (currentAssessment.timeLimit! * 60) - elapsed;
        setAssessmentTimer(Math.max(0, remaining));

        if (remaining <= 0) {
          handleSubmitAssessment();
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentAssessment, assessmentStartTime, assessmentSubmitted]);

  // Fetch lesson content
  const { data: lesson, isLoading: lessonLoading } = useQuery<LessonContent>({
    queryKey: [`/api/lessons/${params?.id}`],
    enabled: !!params?.id,
  });

  // Fetch user progress
  const { data: progress, isLoading: progressLoading } = useQuery<UserProgress>({
    queryKey: [`/api/lessons/${params?.id}/progress`],
    enabled: !!params?.id && !!user,
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (progressData: Partial<UserProgress>) => {
      const res = await apiRequest("PUT", `/api/lessons/${params?.id}/progress`, progressData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/${params?.id}/progress`] });
    },
  });

  // Save note mutation
  const saveNoteMutation = useMutation({
    mutationFn: async (note: Omit<Note, 'id'>) => {
      const res = await apiRequest("POST", `/api/lessons/${params?.id}/notes`, note);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/${params?.id}/progress`] });
      setCurrentNote("");
      setHighlightedText("");
      toast({
        title: "Note saved",
        description: "Your note has been saved successfully.",
      });
    },
  });

  // Save bookmark mutation
  const saveBookmarkMutation = useMutation({
    mutationFn: async (bookmark: Omit<Bookmark, 'id'>) => {
      const res = await apiRequest("POST", `/api/lessons/${params?.id}/bookmarks`, bookmark);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/${params?.id}/progress`] });
      toast({
        title: "Bookmark saved",
        description: "Position bookmarked successfully.",
      });
    },
  });

  // Submit assessment mutation
  const submitAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: { assessmentId: string; score: number; answers: { [key: string]: string }; timeSpent: number }) => {
      const res = await apiRequest("POST", `/api/lessons/${params?.id}/assessments/${assessmentData.assessmentId}/submit`, assessmentData);
      return res.json();
    },
    onSuccess: (result: AssessmentResult) => {
      setAssessmentResults(result);
      setAssessmentSubmitted(true);
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/${params?.id}/progress`] });
      toast({
        title: "Assessment submitted",
        description: `Score: ${result.score}%`,
      });
    },
  });

  // Update progress every 30 seconds
  useEffect(() => {
    if (!lesson || !user) return;

    const interval = setInterval(() => {
      const progressData = {
        progress: Math.min(100, (currentTime / duration) * 100),
        timeSpent: (progress?.timeSpent || 0) + 30,
        lastPosition: currentTime,
      };
      updateProgressMutation.mutate(progressData);
    }, 30000);

    return () => clearInterval(interval);
  }, [lesson, user, currentTime, duration, progress?.timeSpent]);

  const handleSaveNote = () => {
    if (!currentNote.trim()) return;

    const note: Omit<Note, 'id'> = {
      content: currentNote,
      position: currentTime,
      timestamp: new Date(),
      highlighted: !!highlightedText,
    };

    saveNoteMutation.mutate(note);
  };

  const handleSaveBookmark = () => {
    const bookmark: Omit<Bookmark, 'id'> = {
      position: currentTime,
      title: `Bookmark at ${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}`,
      timestamp: new Date(),
    };

    saveBookmarkMutation.mutate(bookmark);
  };

  const handleStartAssessment = (assessment: Assessment) => {
    setCurrentAssessment(assessment);
    setAssessmentAnswers({});
    setAssessmentSubmitted(false);
    setAssessmentResults(null);
    setShowHints({});
    setAssessmentStartTime(Date.now());
    if (assessment.timeLimit) {
      setAssessmentTimer(assessment.timeLimit * 60);
    }
  };

  const handleSubmitAssessment = useCallback(() => {
    if (!currentAssessment || !assessmentStartTime) return;

    const timeSpent = Math.floor((Date.now() - assessmentStartTime) / 1000);

    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;

    currentAssessment.questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = assessmentAnswers[question.id];
      if (userAnswer) {
        // Check if answer is correct
        if (Array.isArray(question.correctAnswer)) {
          if (question.correctAnswer.includes(userAnswer)) {
            earnedPoints += question.points;
          }
        } else if (userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
          earnedPoints += question.points;
        }
      }
    });

    const score = Math.round((earnedPoints / totalPoints) * 100);

    submitAssessmentMutation.mutate({
      assessmentId: currentAssessment.id,
      score,
      answers: assessmentAnswers,
      timeSpent,
    });
  }, [currentAssessment, assessmentStartTime, assessmentAnswers, submitAssessmentMutation]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const toggleHint = (questionId: string) => {
    setShowHints(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const resetAssessment = () => {
    setCurrentAssessment(null);
    setAssessmentAnswers({});
    setAssessmentSubmitted(false);
    setAssessmentResults(null);
    setAssessmentTimer(null);
    setAssessmentStartTime(null);
    setShowHints({});
  };

  if (lessonLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading lesson content...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Found</h1>
          <p className="text-gray-600">The lesson you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{lesson.title}</h1>
                <p className="text-sm text-gray-600">{lesson.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={lesson.difficulty === 'beginner' ? 'default' : 
                          lesson.difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
                {lesson.difficulty}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleSaveBookmark}>
                <Bookmark className="h-4 w-4 mr-2" />
                Bookmark
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress?.progress || 0)}% Complete</span>
          </div>
          <Progress value={progress?.progress || 0} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardContent className="p-0">
                {lesson.videoUrl && (
                  <div className="aspect-video bg-black rounded-t-lg relative group">
                    <ReactPlayer
                      url={lesson.videoUrl}
                      width="100%"
                      height="100%"
                      playing={isPlaying}
                      volume={isMuted ? 0 : volume}
                      playbackRate={playbackSpeed}
                      onProgress={(state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
                        setCurrentTime(state.playedSeconds);
                        // Auto-save progress every 10 seconds
                        if (Math.floor(state.playedSeconds) % 10 === 0) {
                          updateProgressMutation.mutate({
                            progress: Math.min(100, (state.playedSeconds / duration) * 100),
                            lastPosition: Math.floor(state.playedSeconds),
                          });
                        }
                      }}
                      onDuration={(dur: number) => setDuration(dur)}
                      onEnded={() => {
                        setIsPlaying(false);
                        updateProgressMutation.mutate({
                          progress: 100,
                          lastPosition: Math.floor(duration),
                        });
                        toast({
                          title: "Lesson completed!",
                          description: "Great job! You've finished watching this lesson.",
                        });
                      }}
                      config={{
                        file: {
                          attributes: {
                            controlsList: 'nodownload'
                          }
                        }
                      }}
                      className="rounded-t-lg"
                    />
                    {/* Custom Video Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <Slider
                          value={[currentTime]}
                          max={duration || 100}
                          step={1}
                          onValueChange={(value) => setCurrentTime(value[0])}
                          className="cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-white/80 mt-1">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                      {/* Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                            onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                          >
                            <SkipBack className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                            onClick={() => setIsPlaying(!isPlaying)}
                          >
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                            onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                          >
                            <SkipForward className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                            onClick={() => setIsMuted(!isMuted)}
                          >
                            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </Button>
                          <div className="w-20">
                            <Slider
                              value={[volume * 100]}
                              max={100}
                              step={1}
                              onValueChange={(value) => setVolume(value[0] / 100)}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={playbackSpeed}
                            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                            className="bg-transparent text-white text-sm border border-white/30 rounded px-2 py-1"
                          >
                            <option value="0.5" className="text-black">0.5x</option>
                            <option value="0.75" className="text-black">0.75x</option>
                            <option value="1" className="text-black">1x</option>
                            <option value="1.25" className="text-black">1.25x</option>
                            <option value="1.5" className="text-black">1.5x</option>
                            <option value="2" className="text-black">2x</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{lesson.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{lesson.topics.length} topics</span>
                    </div>
                  </div>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                      <TabsTrigger value="resources">Resources</TabsTrigger>
                      <TabsTrigger value="assessment">Assessment</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="mt-6">
                      <div className="prose max-w-none">
                        <h3 className="text-lg font-semibold mb-4">Learning Objectives</h3>
                        <ul className="space-y-2 mb-6">
                          {lesson.learningObjectives.map((objective, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                              <span className="text-sm">{objective}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                          {lesson.content}
                        </div>

                        {/* Interactive Elements */}
                        {lesson.interactiveElements.map((element, index) => (
                          <Card key={element.id} className="my-6 border-blue-200 bg-blue-50">
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Brain className="h-5 w-5 text-blue-600" />
                                Interactive Exercise {index + 1}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="mb-4">{element.question}</p>
                              {element.options && (
                                <div className="space-y-2">
                                  {element.options.map((option, optionIndex) => (
                                    <Button
                                      key={optionIndex}
                                      variant="outline"
                                      className="w-full justify-start"
                                      onClick={() => {
                                        toast({
                                          title: "Answer submitted",
                                          description: element.explanation,
                                        });
                                      }}
                                    >
                                      {option}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="notes" className="mt-6">
                      <div className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Add Note</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <Textarea
                                placeholder="Write your note here..."
                                value={currentNote}
                                onChange={(e) => setCurrentNote(e.target.value)}
                                className="min-h-[100px]"
                              />
                              <Button onClick={handleSaveNote} disabled={!currentNote.trim()}>
                                <PenTool className="h-4 w-4 mr-2" />
                                Save Note
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <div className="space-y-3">
                          {progress?.notes?.map((note) => (
                            <Card key={note.id}>
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-700">{note.content}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                      {Math.floor(note.position / 60)}:{String(Math.floor(note.position % 60)).padStart(2, '0')}
                                    </p>
                                  </div>
                                  {note.highlighted && (
                                    <Star className="h-4 w-4 text-yellow-500" />
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="resources" className="mt-6">
                      <div className="space-y-4">
                        {lesson.resources.map((resource) => (
                          <Card key={resource.id}>
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium">{resource.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                                  <Badge variant="outline" className="mt-2">
                                    {resource.type}
                                  </Badge>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    View
                                  </a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="assessment" className="mt-6">
                      {!currentAssessment ? (
                        <div className="space-y-4">
                          {lesson.assessments.map((assessment) => (
                            <Card key={assessment.id}>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Award className="h-5 w-5 text-yellow-500" />
                                  {assessment.title}
                                </CardTitle>
                                <CardDescription>
                                  {assessment.questions.length} questions • {assessment.timeLimit} minutes
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-gray-600">
                                    <p>Passing Score: {assessment.passingScore}%</p>
                                    <p>Attempts: {assessment.attempts}</p>
                                  </div>
                                  <Button onClick={() => handleStartAssessment(assessment)}>
                                    Start Assessment
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card className="border-2">
                          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  <Award className="h-5 w-5 text-yellow-500" />
                                  {currentAssessment.title}
                                </CardTitle>
                                <CardDescription>
                                  {currentAssessment.questions.length} questions • Passing score: {currentAssessment.passingScore}%
                                </CardDescription>
                              </div>
                              {assessmentTimer !== null && !assessmentSubmitted && (
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                  assessmentTimer < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  <Timer className="h-4 w-4" />
                                  <span className="font-mono font-bold">
                                    {formatTime(assessmentTimer)}
                                  </span>
                                </div>
                              )}
                            </div>
                            {!assessmentSubmitted && (
                              <div className="mt-3">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                  <span>Progress</span>
                                  <span>{Object.keys(assessmentAnswers).length} / {currentAssessment.questions.length} answered</span>
                                </div>
                                <Progress
                                  value={(Object.keys(assessmentAnswers).length / currentAssessment.questions.length) * 100}
                                  className="h-2"
                                />
                              </div>
                            )}
                          </CardHeader>
                          <CardContent className="pt-6">
                            {!assessmentSubmitted ? (
                              <div className="space-y-8">
                                {currentAssessment.questions.map((question, index) => (
                                  <div key={question.id} className="p-4 rounded-lg bg-gray-50 border">
                                    <div className="flex items-start justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                          assessmentAnswers[question.id]
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-300 text-gray-600'
                                        }`}>
                                          {index + 1}
                                        </div>
                                        <div>
                                          <h4 className="font-medium">{question.question}</h4>
                                          <span className="text-xs text-gray-500">{question.points} points • {question.type}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {question.type === 'multiple-choice' && question.options && (
                                      <div className="space-y-3 ml-11">
                                        {question.options.map((option, optionIndex) => (
                                          <label
                                            key={optionIndex}
                                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                              assessmentAnswers[question.id] === option
                                                ? 'bg-blue-100 border-2 border-blue-500'
                                                : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                                            }`}
                                          >
                                            <input
                                              type="radio"
                                              name={question.id}
                                              value={option}
                                              checked={assessmentAnswers[question.id] === option}
                                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                              className="h-4 w-4 text-blue-600"
                                            />
                                            <span className="text-sm">{option}</span>
                                          </label>
                                        ))}
                                      </div>
                                    )}

                                    {question.type === 'true-false' && (
                                      <div className="flex gap-4 ml-11">
                                        {['True', 'False'].map((option) => (
                                          <label
                                            key={option}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer transition-all ${
                                              assessmentAnswers[question.id] === option
                                                ? 'bg-blue-100 border-2 border-blue-500'
                                                : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                                            }`}
                                          >
                                            <input
                                              type="radio"
                                              name={question.id}
                                              value={option}
                                              checked={assessmentAnswers[question.id] === option}
                                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                              className="h-4 w-4 text-blue-600"
                                            />
                                            <span>{option}</span>
                                          </label>
                                        ))}
                                      </div>
                                    )}

                                    {(question.type === 'short-answer' || question.type === 'essay') && (
                                      <div className="ml-11">
                                        <Textarea
                                          placeholder="Type your answer here..."
                                          value={assessmentAnswers[question.id] || ''}
                                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                          className={question.type === 'essay' ? 'min-h-[150px]' : 'min-h-[80px]'}
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}

                                <div className="flex gap-4 pt-4">
                                  <Button
                                    variant="outline"
                                    onClick={resetAssessment}
                                    className="flex-1"
                                  >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleSubmitAssessment}
                                    className="flex-1"
                                    disabled={Object.keys(assessmentAnswers).length < currentAssessment.questions.length}
                                  >
                                    <CheckSquare className="h-4 w-4 mr-2" />
                                    Submit Assessment
                                  </Button>
                                </div>
                              </div>
                            ) : assessmentResults && (
                              <div className="text-center space-y-6 py-8">
                                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                                  assessmentResults.score >= currentAssessment.passingScore
                                    ? 'bg-green-100'
                                    : 'bg-red-100'
                                }`}>
                                  {assessmentResults.score >= currentAssessment.passingScore ? (
                                    <Trophy className="h-12 w-12 text-green-600" />
                                  ) : (
                                    <XCircle className="h-12 w-12 text-red-600" />
                                  )}
                                </div>

                                <div>
                                  <div className={`text-5xl font-bold ${
                                    assessmentResults.score >= currentAssessment.passingScore
                                      ? 'text-green-600'
                                      : 'text-red-600'
                                  }`}>
                                    {assessmentResults.score}%
                                  </div>
                                  <p className="text-gray-600 mt-2">
                                    {assessmentResults.score >= currentAssessment.passingScore
                                      ? "Excellent work! You passed the assessment!"
                                      : `You need ${currentAssessment.passingScore}% to pass. Keep learning and try again!`}
                                  </p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-700">
                                      {Object.keys(assessmentAnswers).length}
                                    </div>
                                    <div className="text-xs text-gray-500">Questions</div>
                                  </div>
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-700">
                                      {assessmentResults.timeSpent ? formatTime(assessmentResults.timeSpent) : '--:--'}
                                    </div>
                                    <div className="text-xs text-gray-500">Time Spent</div>
                                  </div>
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                      +{Math.round(assessmentResults.score * 0.5)}
                                    </div>
                                    <div className="text-xs text-gray-500">XP Earned</div>
                                  </div>
                                </div>

                                {/* Question Review */}
                                <div className="text-left mt-8">
                                  <h4 className="font-semibold mb-4">Question Review</h4>
                                  <div className="space-y-3">
                                    {currentAssessment.questions.map((question, index) => {
                                      const userAnswer = assessmentAnswers[question.id];
                                      const isCorrect = Array.isArray(question.correctAnswer)
                                        ? question.correctAnswer.includes(userAnswer)
                                        : userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

                                      return (
                                        <div key={question.id} className={`p-4 rounded-lg border ${
                                          isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                        }`}>
                                          <div className="flex items-start gap-3">
                                            {isCorrect ? (
                                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                            ) : (
                                              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                              <p className="font-medium text-sm">{index + 1}. {question.question}</p>
                                              <p className="text-xs mt-1">
                                                <span className="text-gray-500">Your answer: </span>
                                                <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                                                  {userAnswer || '(not answered)'}
                                                </span>
                                              </p>
                                              {!isCorrect && (
                                                <p className="text-xs mt-1">
                                                  <span className="text-gray-500">Correct answer: </span>
                                                  <span className="text-green-700">
                                                    {Array.isArray(question.correctAnswer)
                                                      ? question.correctAnswer.join(', ')
                                                      : question.correctAnswer}
                                                  </span>
                                                </p>
                                              )}
                                              <p className="text-xs text-gray-600 mt-2 italic">{question.explanation}</p>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                  <Button
                                    variant="outline"
                                    onClick={resetAssessment}
                                    className="flex-1"
                                  >
                                    Back to Assessments
                                  </Button>
                                  {assessmentResults.score < currentAssessment.passingScore && (
                                    <Button
                                      onClick={() => handleStartAssessment(currentAssessment)}
                                      className="flex-1"
                                    >
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Try Again
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Topics Covered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lesson.topics.map((topic, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{topic}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bookmarks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bookmarks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {progress?.bookmarks?.map((bookmark) => (
                      <div key={bookmark.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium">{bookmark.title}</p>
                          <p className="text-xs text-gray-500">
                            {Math.floor(bookmark.position / 60)}:
                            {String(Math.floor(bookmark.position % 60)).padStart(2, '0')}
                          </p>
                        </div>
                        <BookmarkCheck className="h-4 w-4 text-blue-500" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous Lesson
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Next Lesson
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}