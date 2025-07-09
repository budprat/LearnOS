import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams, useLocation } from "wouter";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  Bookmark, 
  BookmarkCheck,
  StickyNote,
  Download,
  CheckCircle,
  Circle,
  Clock,
  FileText,
  Video,
  Code,
  MessageSquare,
  Share2,
  Save
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function Lesson() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const { courseId, lessonId } = useParams();
  const [, navigate] = useLocation();
  const [notes, setNotes] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: lessonData, isLoading: isLessonLoading } = useQuery({
    queryKey: ['/api/courses', courseId, 'lessons', lessonId],
    enabled: !!(courseId && lessonId),
    retry: false,
  });

  const { data: courseData } = useQuery({
    queryKey: ['/api/courses', courseId],
    enabled: !!courseId,
    retry: false,
  });

  const notesMutation = useMutation({
    mutationFn: async (notes: string) => {
      await apiRequest(`/api/lessons/${lessonId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Notes saved",
        description: "Your notes have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      });
    },
  });

  const progressMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      await apiRequest(`/api/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId] });
    },
  });

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Save bookmark state to backend
  };

  const handleNextLesson = () => {
    if (lessonData?.nextLessonId) {
      navigate(`/courses/${courseId}/lessons/${lessonData.nextLessonId}`);
    }
  };

  const handlePreviousLesson = () => {
    if (lessonData?.previousLessonId) {
      navigate(`/courses/${courseId}/lessons/${lessonData.previousLessonId}`);
    }
  };

  const handleCompleteLesson = () => {
    progressMutation.mutate(true);
    if (lessonData?.nextLessonId) {
      handleNextLesson();
    } else {
      toast({
        title: "Course completed!",
        description: "Congratulations on completing this course!",
      });
      navigate(`/courses/${courseId}`);
    }
  };

  if (isLoading || !isAuthenticated || isLessonLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full rounded-xl mb-4" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/courses/${courseId}`)}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {lessonData?.title || 'Loading...'}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <Badge variant="outline">{courseData?.category}</Badge>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {lessonData?.duration || 30} min
                </span>
                <span className="flex items-center">
                  {lessonData?.type === 'video' && <Video className="h-4 w-4 mr-1" />}
                  {lessonData?.type === 'text' && <FileText className="h-4 w-4 mr-1" />}
                  {lessonData?.type === 'interactive' && <Code className="h-4 w-4 mr-1" />}
                  {lessonData?.type || 'Video'} Lesson
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleBookmark}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video/Content Area */}
            <Card className="card-polish">
              <CardContent className="p-0">
                {lessonData?.type === 'video' ? (
                  <div className="aspect-video bg-black rounded-t-lg relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        size="lg"
                        variant="secondary"
                        className="rounded-full"
                        onClick={() => setVideoPlaying(!videoPlaying)}
                      >
                        {videoPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Progress value={35} className="h-1" />
                    </div>
                  </div>
                ) : (
                  <div className="p-6 prose prose-gray max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                      __html: lessonData?.content || '<p>Content loading...</p>' 
                    }} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lesson Tabs */}
            <Card className="card-polish">
              <CardContent className="p-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">What you'll learn</h3>
                        <ul className="space-y-2">
                          {lessonData?.objectives?.map((objective: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                              <span className="text-gray-700">{objective}</span>
                            </li>
                          )) || (
                            <>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                <span className="text-gray-700">Core concepts and fundamentals</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                <span className="text-gray-700">Practical applications and examples</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                <span className="text-gray-700">Best practices and tips</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resources" className="mt-4">
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Download Slides (PDF)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Exercise Files
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Code className="h-4 w-4 mr-2" />
                        Code Examples
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes" className="mt-4">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Take notes here..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[200px]"
                      />
                      <Button 
                        onClick={() => notesMutation.mutate(notes)}
                        disabled={notesMutation.isPending}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Notes
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="discussion" className="mt-4">
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No discussions yet</p>
                      <Button className="mt-4">Start Discussion</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousLesson}
                disabled={!lessonData?.previousLessonId}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Lesson
              </Button>
              
              <Button
                onClick={handleCompleteLesson}
                disabled={progressMutation.isPending}
              >
                {lessonData?.nextLessonId ? (
                  <>
                    Next Lesson
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Complete Course
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Progress */}
            <Card className="card-polish">
              <CardHeader>
                <CardTitle className="text-lg">Course Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="font-medium">{courseData?.progress || 0}%</span>
                    </div>
                    <Progress value={courseData?.progress || 0} />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Course Outline</h4>
                    <ScrollArea className="h-64">
                      <div className="space-y-1 pr-4">
                        {courseData?.lessons?.map((lesson: any, index: number) => (
                          <button
                            key={lesson.id}
                            onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)}
                            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                              lesson.id === lessonId 
                                ? 'bg-primary text-white' 
                                : lesson.completed
                                ? 'bg-gray-100 hover:bg-gray-200'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            {lesson.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : lesson.id === lessonId ? (
                              <Circle className="h-4 w-4" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-400" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium line-clamp-1">
                                {index + 1}. {lesson.title}
                              </p>
                              <p className="text-xs opacity-75">{lesson.duration} min</p>
                            </div>
                          </button>
                        )) || (
                          <div className="text-center py-4 text-gray-500">
                            Loading lessons...
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Lessons */}
            <Card className="card-polish">
              <CardHeader>
                <CardTitle className="text-lg">Up Next</CardTitle>
              </CardHeader>
              <CardContent>
                {lessonData?.relatedLessons?.length > 0 ? (
                  <div className="space-y-3">
                    {lessonData.relatedLessons.map((lesson: any) => (
                      <div key={lesson.id} className="flex items-center gap-3">
                        <div className="w-20 h-14 bg-gray-200 rounded flex items-center justify-center">
                          <Play className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-1">{lesson.title}</p>
                          <p className="text-xs text-gray-500">{lesson.duration} min</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No related lessons</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}