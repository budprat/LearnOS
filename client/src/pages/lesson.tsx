import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  RefreshCw
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
      return apiRequest(`/api/lessons/${params?.id}/progress`, {
        method: "PUT",
        body: JSON.stringify(progressData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/${params?.id}/progress`] });
    },
  });

  // Save note mutation
  const saveNoteMutation = useMutation({
    mutationFn: async (note: Omit<Note, 'id'>) => {
      return apiRequest(`/api/lessons/${params?.id}/notes`, {
        method: "POST",
        body: JSON.stringify(note),
      });
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
      return apiRequest(`/api/lessons/${params?.id}/bookmarks`, {
        method: "POST",
        body: JSON.stringify(bookmark),
      });
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
    mutationFn: async (assessmentData: { assessmentId: string; answers: { [key: string]: string } }) => {
      return apiRequest(`/api/lessons/${params?.id}/assessments/${assessmentData.assessmentId}/submit`, {
        method: "POST",
        body: JSON.stringify(assessmentData),
      });
    },
    onSuccess: (result) => {
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
  };

  const handleSubmitAssessment = () => {
    if (!currentAssessment) return;

    submitAssessmentMutation.mutate({
      assessmentId: currentAssessment.id,
      answers: assessmentAnswers,
    });
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
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
                  <div className="aspect-video bg-black rounded-t-lg relative">
                    <video
                      className="w-full h-full rounded-t-lg"
                      controls
                      src={lesson.videoUrl}
                      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                      onDurationChange={(e) => setDuration(e.currentTarget.duration)}
                    />
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
                        <Card>
                          <CardHeader>
                            <CardTitle>{currentAssessment.title}</CardTitle>
                            <CardDescription>
                              Answer all questions to complete the assessment
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {!assessmentSubmitted ? (
                              <div className="space-y-6">
                                {currentAssessment.questions.map((question, index) => (
                                  <div key={question.id} className="border-b pb-4">
                                    <h4 className="font-medium mb-3">
                                      {index + 1}. {question.question}
                                    </h4>
                                    {question.options && (
                                      <div className="space-y-2">
                                        {question.options.map((option, optionIndex) => (
                                          <label key={optionIndex} className="flex items-center gap-2">
                                            <input
                                              type="radio"
                                              name={question.id}
                                              value={option}
                                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                              className="text-primary"
                                            />
                                            <span className="text-sm">{option}</span>
                                          </label>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                                <Button onClick={handleSubmitAssessment} className="w-full">
                                  Submit Assessment
                                </Button>
                              </div>
                            ) : assessmentResults && (
                              <div className="text-center space-y-4">
                                <div className="text-3xl font-bold text-primary">
                                  {assessmentResults.score}%
                                </div>
                                <p className="text-gray-600">
                                  {assessmentResults.score >= currentAssessment.passingScore
                                    ? "Congratulations! You passed!"
                                    : "You need to score higher to pass. Try again!"}
                                </p>
                                <Button 
                                  onClick={() => setCurrentAssessment(null)}
                                  variant="outline"
                                >
                                  Back to Assessments
                                </Button>
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