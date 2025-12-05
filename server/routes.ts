import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import { storage } from "./storage";
import { supabase } from "./supabase";
import {
  generatePersonalizedRecommendations,
  generateAiTutorResponse,
  generateLearningPathSuggestions,
  analyzeUserProgress,
  detectLearningStyle,
  analyzeSentiment,
  generateAdaptiveQuestions,
  predictLearningIntervention,
  mapCompetencies
} from "./openai";
import {
  insertCourseSchema,
  insertLearningPathSchema,
  insertUserCourseSchema,
  insertAssessmentSchema,
  insertStudyGroupSchema,
  insertAiTutorSessionSchema,
  lessons
} from "@shared/schema";
import { db } from "./db";
import {
  zodValidate,
  schemas,
  sanitizeContent
} from "./validation";

// WebSocket client tracking
interface WebSocketClient extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

// Map to track connected clients
const connectedClients = new Map<string, WebSocketClient>();

// Middleware to check authentication
const isAuthenticated = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No authorization header" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

// Rate limiting middleware for AI endpoints
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: {
    message: "Too many AI requests from this IP, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    message: "Too many requests from this IP, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware helper
const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply general rate limiting to all API routes
  app.use('/api/', generalRateLimiter);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      let user = await storage.getUser(userId);
      
      // Create user profile if it doesn't exist
      if (!user) {
        user = await storage.upsertUser({
          id: userId,
          email: req.user.email,
          firstName: req.user.user_metadata?.first_name || null,
          lastName: req.user.user_metadata?.last_name || null,
          profileImageUrl: req.user.user_metadata?.avatar_url || null,
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Seed lessons API endpoint
  app.post('/api/seed/lessons', isAuthenticated, async (req, res) => {
    try {
      const sampleLessons = [
        {
          title: "Introduction to Machine Learning",
          description: "Learn the fundamentals of machine learning and its applications",
          content: "Machine learning is a subset of artificial intelligence (AI) that enables computers to learn and make decisions without being explicitly programmed. In this lesson, we'll explore the core concepts and applications of machine learning.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: 45,
          difficulty: "beginner",
          topics: ["AI", "Machine Learning", "Data Science"],
          prerequisites: ["Basic Programming", "Statistics"],
          learningObjectives: ["Understand ML concepts", "Learn ML types", "Explore applications"],
          interactiveElements: {
            exercises: [
              { type: "multiple-choice", question: "What is machine learning?", options: ["A subset of AI", "A programming language", "A database"] }
            ]
          },
          assessments: {
            quiz: [
              { type: "multiple-choice", question: "What is supervised learning?", options: ["Learning with labeled data", "Learning without data", "Learning with unlabeled data"] }
            ]
          },
          resources: {
            links: ["https://example.com/ml-intro", "https://example.com/ml-guide"],
            books: ["Machine Learning Yearning", "Pattern Recognition"]
          }
        },
        {
          title: "Data Structures and Algorithms",
          description: "Master essential data structures and algorithms for programming",
          content: "Data structures and algorithms form the foundation of computer science and programming. This lesson covers arrays, linked lists, stacks, queues, trees, and graphs, along with sorting and searching algorithms.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: 60,
          difficulty: "intermediate",
          topics: ["Data Structures", "Algorithms", "Programming"],
          prerequisites: ["Programming Fundamentals", "Basic Math"],
          learningObjectives: ["Understand data structures", "Implement algorithms", "Analyze complexity"],
          interactiveElements: {
            exercises: [
              { type: "coding", question: "Implement a binary search algorithm", template: "function binarySearch(arr, target) { // Your code here }" }
            ]
          },
          assessments: {
            quiz: [
              { type: "multiple-choice", question: "What is the time complexity of binary search?", options: ["O(log n)", "O(n)", "O(n²)"] }
            ]
          },
          resources: {
            links: ["https://example.com/dsa-guide", "https://example.com/algorithms"],
            books: ["Introduction to Algorithms", "Data Structures and Algorithms"]
          }
        },
        {
          title: "Web Development with React",
          description: "Build modern web applications using React framework",
          content: "React is a popular JavaScript library for building user interfaces. In this lesson, we'll learn React fundamentals including components, props, state, and hooks to create interactive web applications.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: 90,
          difficulty: "intermediate",
          topics: ["React", "JavaScript", "Web Development"],
          prerequisites: ["HTML", "CSS", "JavaScript"],
          learningObjectives: ["Create React components", "Manage state", "Build interactive UIs"],
          interactiveElements: {
            exercises: [
              { type: "coding", question: "Create a React component", template: "import React from 'react'; function MyComponent() { // Your code here }" }
            ]
          },
          assessments: {
            quiz: [
              { type: "multiple-choice", question: "What is JSX?", options: ["JavaScript XML", "Java Syntax Extension", "JSON XML"] }
            ]
          },
          resources: {
            links: ["https://reactjs.org/docs", "https://example.com/react-guide"],
            books: ["Learning React", "React: The Complete Guide"]
          }
        }
      ];

      // Insert lessons using direct database queries
      for (const lesson of sampleLessons) {
        await db.insert(lessons).values(lesson);
      }

      res.json({ message: "Sample lessons created successfully", count: sampleLessons.length });
    } catch (error) {
      console.error("Error seeding lessons:", error);
      res.status(500).json({ message: "Failed to seed lessons" });
    }
  });

  // Dashboard data endpoint
  app.get('/api/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const [
        userCourses,
        learningPaths,
        assessments,
        recommendations,
        studyGroups,
        aiTutorSessions
      ] = await Promise.all([
        storage.getUserCourses(userId),
        storage.getUserLearningPaths(userId),
        storage.getUserAssessments(userId),
        storage.getUserRecommendations(userId),
        storage.getUserStudyGroups(userId),
        storage.getUserAiTutorSessions(userId)
      ]);

      res.json({
        user,
        userCourses: userCourses.slice(0, 3), // Recent courses
        learningPaths,
        assessments: assessments.filter(a => !a.isCompleted).slice(0, 5), // Upcoming assessments
        recommendations: recommendations.slice(0, 4),
        studyGroups: studyGroups.slice(0, 3),
        aiTutorSessions: aiTutorSessions.slice(0, 1) // Latest session
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Courses endpoints
  app.get('/api/courses', async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.post('/api/courses', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(400).json({ message: "Failed to create course" });
    }
  });

  app.get('/api/courses/:id', async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // User courses endpoints
  app.get('/api/user/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userCourses = await storage.getUserCourses(userId);
      res.json(userCourses);
    } catch (error) {
      console.error("Error fetching user courses:", error);
      res.status(500).json({ message: "Failed to fetch user courses" });
    }
  });

  app.post('/api/user/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertUserCourseSchema.parse({
        ...req.body,
        userId
      });
      const userCourse = await storage.createUserCourse(validatedData);
      res.status(201).json(userCourse);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      res.status(400).json({ message: "Failed to enroll in course" });
    }
  });

  app.patch('/api/user/courses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const userCourse = await storage.updateUserCourse(courseId, req.body);
      res.json(userCourse);
    } catch (error) {
      console.error("Error updating course progress:", error);
      res.status(400).json({ message: "Failed to update course progress" });
    }
  });

  // Learning paths endpoints
  app.get('/api/learning-paths', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const paths = await storage.getUserLearningPaths(userId);
      res.json(paths);
    } catch (error) {
      console.error("Error fetching learning paths:", error);
      res.status(500).json({ message: "Failed to fetch learning paths" });
    }
  });

  app.post('/api/learning-paths', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertLearningPathSchema.parse({
        ...req.body,
        userId
      });
      const path = await storage.createLearningPath(validatedData);
      res.status(201).json(path);
    } catch (error) {
      console.error("Error creating learning path:", error);
      res.status(400).json({ message: "Failed to create learning path" });
    }
  });

  app.patch('/api/learning-paths/:id', isAuthenticated, async (req: any, res) => {
    try {
      const pathId = parseInt(req.params.id);
      const path = await storage.updateLearningPath(pathId, req.body);
      res.json(path);
    } catch (error) {
      console.error("Error updating learning path:", error);
      res.status(400).json({ message: "Failed to update learning path" });
    }
  });

  // AI recommendations endpoint
  app.get('/api/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const recommendations = await storage.getUserRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.post('/api/recommendations/generate', aiRateLimiter, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      const userCourses = await storage.getUserCourses(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const aiRecommendations = await generatePersonalizedRecommendations(
        userId,
        userCourses,
        userCourses.filter(uc => uc.isCompleted),
        user.skillLevel || "Beginner"
      );

      // Store recommendations in database
      const storedRecommendations = await Promise.all(
        aiRecommendations.recommendations.map(rec => 
          storage.createRecommendation({
            userId,
            title: rec.title,
            description: rec.description,
            reason: rec.reason,
            priority: rec.priority,
            estimatedDuration: rec.estimatedDuration
          })
        )
      );

      res.json(storedRecommendations);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  // Assessments endpoints
  app.get('/api/assessments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const assessments = await storage.getUserAssessments(userId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  app.post('/api/assessments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertAssessmentSchema.parse({
        ...req.body,
        userId
      });
      const assessment = await storage.createAssessment(validatedData);
      res.status(201).json(assessment);
    } catch (error) {
      console.error("Error creating assessment:", error);
      res.status(400).json({ message: "Failed to create assessment" });
    }
  });

  // Study groups endpoints
  app.get('/api/study-groups', async (req, res) => {
    try {
      const studyGroups = await storage.getStudyGroups();
      res.json(studyGroups);
    } catch (error) {
      console.error("Error fetching study groups:", error);
      res.status(500).json({ message: "Failed to fetch study groups" });
    }
  });

  app.post('/api/study-groups', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertStudyGroupSchema.parse(req.body);
      const group = await storage.createStudyGroup(validatedData);
      res.status(201).json(group);
    } catch (error) {
      console.error("Error creating study group:", error);
      res.status(400).json({ message: "Failed to create study group" });
    }
  });

  app.post('/api/study-groups/:id/join', isAuthenticated, async (req: any, res) => {
    try {
      const groupId = parseInt(req.params.id);
      const userId = req.user.id;
      const member = await storage.joinStudyGroup(groupId, userId);
      res.status(201).json(member);
    } catch (error) {
      console.error("Error joining study group:", error);
      res.status(400).json({ message: "Failed to join study group" });
    }
  });

  // AI tutor endpoints
  app.get('/api/ai-tutor/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const sessions = await storage.getUserAiTutorSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching AI tutor sessions:", error);
      res.status(500).json({ message: "Failed to fetch AI tutor sessions" });
    }
  });

  app.post('/api/ai-tutor/chat',
    aiRateLimiter,
    isAuthenticated,
    [
      body('message').isString().trim().isLength({ min: 1, max: 2000 }).withMessage('Message must be between 1 and 2000 characters'),
      body('sessionId').optional().isString()
    ],
    validateRequest,
    async (req: any, res: any) => {
    try {
      const userId = req.user.id;
      const { message, sessionId } = req.body;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let session;
      if (sessionId) {
        const sessions = await storage.getUserAiTutorSessions(userId);
        session = sessions.find(s => s.id === sessionId);
      }

      const messages = session?.messages as any[] || [];
      messages.push({ role: "user", content: message });

      const aiResponse = await generateAiTutorResponse(messages, {
        skillLevel: user.skillLevel,
        learningProgress: await storage.getUserCourses(userId)
      });

      messages.push({ role: "assistant", content: aiResponse });

      if (session) {
        session = await storage.updateAiTutorSession(session.id, {
          messages
        });
      } else {
        session = await storage.createAiTutorSession({
          userId,
          messages,
          topic: message.substring(0, 100)
        });
      }

      res.json({ 
        response: aiResponse, 
        sessionId: session.id 
      });
    } catch (error) {
      console.error("Error in AI tutor chat:", error);
      res.status(500).json({ message: "Failed to process AI tutor request" });
    }
  });

  // Analytics endpoint
  app.get('/api/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      const userCourses = await storage.getUserCourses(userId);
      const assessments = await storage.getUserAssessments(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const analysis = await analyzeUserProgress(
        userId,
        {
          completedCourses: userCourses.filter(uc => uc.isCompleted).length,
          totalCourses: userCourses.length,
          averageProgress: userCourses.reduce((acc, uc) => acc + (uc.progress || 0), 0) / userCourses.length,
          learningHours: user.totalLearningHours,
          currentStreak: user.currentStreak
        },
        assessments
      );

      res.json({
        ...analysis,
        userStats: {
          completedCourses: userCourses.filter(uc => uc.isCompleted).length,
          totalCourses: userCourses.length,
          learningHours: user.totalLearningHours,
          currentStreak: user.currentStreak,
          level: user.level,
          skillLevel: user.skillLevel
        }
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Advanced AI endpoints with validation
  app.post("/api/ai/detect-learning-style",
    aiRateLimiter,
    isAuthenticated,
    zodValidate(schemas.detectLearningStyle, "body"),
    async (req: any, res) => {
      try {
        const userId = req.user.id;
        const { interactionHistory, coursePreferences } = req.validatedBody;

        const learningStyle = await detectLearningStyle(userId, interactionHistory, coursePreferences);

        res.json({ learningStyle });
      } catch (error) {
        console.error("Error detecting learning style:", error);
        res.status(500).json({ message: "Failed to detect learning style" });
      }
    }
  );

  app.post("/api/ai/analyze-sentiment",
    aiRateLimiter,
    isAuthenticated,
    zodValidate(schemas.analyzeSentiment, "body"),
    async (req: any, res) => {
      try {
        const { messages, context } = req.validatedBody;

        const emotionalState = await analyzeSentiment(messages, context);

        res.json({ emotionalState });
      } catch (error) {
        console.error("Error analyzing sentiment:", error);
        res.status(500).json({ message: "Failed to analyze sentiment" });
      }
    }
  );

  app.post("/api/ai/generate-adaptive-questions",
    aiRateLimiter,
    isAuthenticated,
    zodValidate(schemas.generateAdaptiveQuestions, "body"),
    async (req: any, res) => {
      try {
        const { topic, userLevel, previousAnswers, learningObjectives } = req.validatedBody;

        const questions = await generateAdaptiveQuestions(topic, userLevel, previousAnswers, learningObjectives);

        res.json(questions);
      } catch (error) {
        console.error("Error generating adaptive questions:", error);
        res.status(500).json({ message: "Failed to generate questions" });
      }
    }
  );

  app.post("/api/ai/predict-intervention",
    aiRateLimiter,
    isAuthenticated,
    zodValidate(schemas.predictIntervention, "body"),
    async (req: any, res) => {
      try {
        const userId = req.user.id;
        const { progressData, engagementMetrics, assessmentHistory } = req.validatedBody;

        const intervention = await predictLearningIntervention(userId, progressData, engagementMetrics, assessmentHistory);

        res.json(intervention);
      } catch (error) {
        console.error("Error predicting intervention:", error);
        res.status(500).json({ message: "Failed to predict intervention" });
      }
    }
  );

  app.get("/api/ai/competency-map",
    aiRateLimiter,
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.id;
        const targetRole = req.query.targetRole as string;

        const userCourses = await storage.getUserCourses(userId);
        const assessments = await storage.getUserAssessments(userId);
        const completedCourses = userCourses
          .filter(uc => uc.completedAt)
          .map(uc => uc.course);

        const competencyMap = await mapCompetencies(userId, completedCourses, assessments, targetRole);

        res.json(competencyMap);
      } catch (error) {
        console.error("Error mapping competencies:", error);
        res.status(500).json({ message: "Failed to map competencies" });
      }
    }
  );

  // Gamification endpoints
  app.get("/api/gamification/achievements", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      const userCourses = await storage.getUserCourses(userId);
      const assessments = await storage.getUserAssessments(userId);
      
      // Calculate achievements based on user progress
      const achievements = [
        {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first course',
          progress: userCourses.filter(uc => uc.completedAt).length,
          total: 1,
          unlocked: userCourses.some(uc => uc.completedAt),
          rarity: 'common'
        },
        {
          id: '2',
          title: 'Dedicated Learner',
          description: 'Maintain a 7-day learning streak',
          progress: user?.currentStreak || 0,
          total: 7,
          unlocked: (user?.currentStreak || 0) >= 7,
          rarity: 'rare'
        },
        {
          id: '3',
          title: 'Knowledge Seeker',
          description: 'Complete 10 courses',
          progress: userCourses.filter(uc => uc.completedAt).length,
          total: 10,
          unlocked: userCourses.filter(uc => uc.completedAt).length >= 10,
          rarity: 'epic'
        },
        {
          id: '4',
          title: 'Master Mind',
          description: 'Achieve 90% or higher on 5 assessments',
          progress: assessments.filter(a => a.score && a.score >= 90).length,
          total: 5,
          unlocked: assessments.filter(a => a.score && a.score >= 90).length >= 5,
          rarity: 'legendary'
        }
      ];
      
      res.json({
        achievements,
        streak: user?.currentStreak || 0,
        totalPoints: user?.totalXp || 0,
        level: Math.floor((user?.totalXp || 0) / 1000) + 1
      });
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Lesson routes
  app.get('/api/lessons', isAuthenticated, async (req, res) => {
    try {
      const lessons = await storage.getLessons();
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.get('/api/lessons/:id', isAuthenticated, async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  app.post('/api/lessons/:id/progress',
    isAuthenticated,
    [
      body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
      body('timeSpent').optional().isInt({ min: 0 }).withMessage('Time spent must be a positive number'),
      body('completedSections').optional().isArray().withMessage('Completed sections must be an array'),
      body('lastPosition').optional().isInt({ min: 0 }).withMessage('Last position must be a positive number')
    ],
    validateRequest,
    async (req: any, res: any) => {
    try {
      const lessonId = parseInt(req.params.id);
      const userId = req.user.id;

      // Check if progress already exists
      const existingProgress = await storage.getUserLessonProgress(userId, lessonId);
      if (existingProgress) {
        const updatedProgress = await storage.updateLessonProgress(existingProgress.id, req.body);
        res.json(updatedProgress);
      } else {
        const progress = await storage.createLessonProgress({
          ...req.body,
          userId,
          lessonId
        });
        res.status(201).json(progress);
      }
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      res.status(500).json({ message: "Failed to update lesson progress" });
    }
  });

  app.get('/api/lessons/:id/progress', isAuthenticated, async (req: any, res: any) => {
    try {
      const lessonId = parseInt(req.params.id);
      const userId = req.user.id;
      const progress = await storage.getUserLessonProgress(userId, lessonId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching lesson progress:", error);
      res.status(500).json({ message: "Failed to fetch lesson progress" });
    }
  });

  app.get('/api/lessons/:id/notes', isAuthenticated, async (req: any, res: any) => {
    try {
      const lessonId = parseInt(req.params.id);
      const userId = req.user.id;
      const notes = await storage.getUserLessonNotes(userId, lessonId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching lesson notes:", error);
      res.status(500).json({ message: "Failed to fetch lesson notes" });
    }
  });

  app.post('/api/lessons/:id/notes',
    isAuthenticated,
    [
      body('content').isString().trim().isLength({ min: 1, max: 5000 }).withMessage('Note content must be between 1 and 5000 characters'),
      body('position').optional().isInt({ min: 0 }).withMessage('Position must be a positive number'),
      body('highlighted').optional().isBoolean().withMessage('Highlighted must be a boolean')
    ],
    validateRequest,
    async (req: any, res: any) => {
    try {
      const lessonId = parseInt(req.params.id);
      const userId = req.user.id;
      const note = await storage.createLessonNote({
        ...req.body,
        userId,
        lessonId
      });
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating lesson note:", error);
      res.status(500).json({ message: "Failed to create lesson note" });
    }
  });

  app.delete('/api/lessons/:id/notes/:noteId', isAuthenticated, async (req, res) => {
    try {
      const noteId = parseInt(req.params.noteId);
      await storage.deleteLessonNote(noteId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lesson note:", error);
      res.status(500).json({ message: "Failed to delete lesson note" });
    }
  });

  app.get('/api/lessons/:id/bookmarks', isAuthenticated, async (req: any, res: any) => {
    try {
      const lessonId = parseInt(req.params.id);
      const userId = req.user.id;
      const bookmarks = await storage.getUserLessonBookmarks(userId, lessonId);
      res.json(bookmarks);
    } catch (error) {
      console.error("Error fetching lesson bookmarks:", error);
      res.status(500).json({ message: "Failed to fetch lesson bookmarks" });
    }
  });

  app.post('/api/lessons/:id/bookmarks', isAuthenticated, async (req: any, res: any) => {
    try {
      const lessonId = parseInt(req.params.id);
      const userId = req.user.id;
      const bookmark = await storage.createLessonBookmark({
        ...req.body,
        userId,
        lessonId
      });
      res.status(201).json(bookmark);
    } catch (error) {
      console.error("Error creating lesson bookmark:", error);
      res.status(500).json({ message: "Failed to create lesson bookmark" });
    }
  });

  app.delete('/api/lessons/:id/bookmarks/:bookmarkId', isAuthenticated, async (req, res) => {
    try {
      const bookmarkId = parseInt(req.params.bookmarkId);
      await storage.deleteLessonBookmark(bookmarkId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lesson bookmark:", error);
      res.status(500).json({ message: "Failed to delete lesson bookmark" });
    }
  });

  // Lesson Assessment Submission endpoint
  app.post('/api/lessons/:id/assessments/:assessmentId/submit',
    isAuthenticated,
    zodValidate(schemas.submitLessonAssessment, "body"),
    async (req: any, res: any) => {
      try {
        const lessonId = parseInt(req.params.id);
        const assessmentIdParam = req.params.assessmentId;
        const userId = req.user.id;
        const { assessmentId, score, answers, timeSpent } = req.validatedBody;

        // Get the lesson to validate assessment exists
        const lesson = await storage.getLesson(lessonId);
        if (!lesson) {
          return res.status(404).json({ message: "Lesson not found" });
        }

        // Store the assessment result
        const result = await storage.createLessonAssessmentResult({
          userId,
          lessonId,
          assessmentId: assessmentIdParam || assessmentId,
          score,
          answers,
          timeSpent
        });

        // Update user XP based on score
        const user = await storage.getUser(userId);
        if (user) {
          const xpGained = Math.round(score * 0.5); // 0.5 XP per score point
          await storage.updateUserStats(userId, {
            totalXp: (user.totalXp || 0) + xpGained
          });
        }

        // Broadcast score update via WebSocket if client is connected
        const client = connectedClients.get(userId);
        if (client && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'assessment-completed',
            lessonId,
            assessmentId: assessmentIdParam || assessmentId,
            score,
            xpGained: Math.round(score * 0.5)
          }));
        }

        res.status(201).json({
          ...result,
          passed: score >= 70, // 70% passing threshold
          xpGained: Math.round(score * 0.5)
        });
      } catch (error) {
        console.error("Error submitting lesson assessment:", error);
        res.status(500).json({ message: "Failed to submit assessment" });
      }
    }
  );

  // Get lesson assessment results
  app.get('/api/lessons/:id/assessments/results', isAuthenticated, async (req: any, res: any) => {
    try {
      const lessonId = parseInt(req.params.id);
      const userId = req.user.id;
      const results = await storage.getUserLessonAssessmentResults(userId, lessonId);
      res.json(results);
    } catch (error) {
      console.error("Error fetching assessment results:", error);
      res.status(500).json({ message: "Failed to fetch assessment results" });
    }
  });

  const httpServer = createServer(app);

  // ============================================
  // COMPLETE WEBSOCKET IMPLEMENTATION
  // ============================================
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Heartbeat interval to detect dead connections
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const client = ws as WebSocketClient;
      if (client.isAlive === false) {
        // Remove from connected clients
        if (client.userId) {
          connectedClients.delete(client.userId);
        }
        return client.terminate();
      }
      client.isAlive = false;
      client.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  wss.on('connection', async (ws: WebSocket, req) => {
    const client = ws as WebSocketClient;
    client.isAlive = true;

    console.log('New WebSocket connection established');

    // Handle pong response for heartbeat
    client.on('pong', () => {
      client.isAlive = true;
    });

    client.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());

        switch (data.type) {
          case 'authenticate': {
            // Authenticate the WebSocket connection
            const { token } = data;
            if (!token) {
              client.send(JSON.stringify({
                type: 'error',
                message: 'Authentication token required'
              }));
              return;
            }

            try {
              const { data: { user }, error } = await supabase.auth.getUser(token);
              if (error || !user) {
                client.send(JSON.stringify({
                  type: 'error',
                  message: 'Invalid authentication token'
                }));
                return;
              }

              client.userId = user.id;
              connectedClients.set(user.id, client);

              client.send(JSON.stringify({
                type: 'authenticated',
                userId: user.id,
                message: 'Successfully connected'
              }));

              console.log(`User ${user.id} authenticated via WebSocket`);
            } catch (authError) {
              client.send(JSON.stringify({
                type: 'error',
                message: 'Authentication failed'
              }));
            }
            break;
          }

          case 'ai-tutor-message': {
            // Handle real-time AI tutor messages
            if (!client.userId) {
              client.send(JSON.stringify({
                type: 'error',
                message: 'Not authenticated'
              }));
              return;
            }

            const { message: userMessage, sessionId } = data;

            // Send processing indicator
            client.send(JSON.stringify({
              type: 'ai-tutor-typing',
              isTyping: true
            }));

            try {
              const user = await storage.getUser(client.userId);
              if (!user) {
                throw new Error('User not found');
              }

              // Get or create session
              let session;
              if (sessionId) {
                const sessions = await storage.getUserAiTutorSessions(client.userId);
                session = sessions.find(s => s.id === parseInt(sessionId));
              }

              const messages = session?.messages as any[] || [];
              messages.push({ role: "user", content: userMessage });

              // Generate AI response
              const aiResponse = await generateAiTutorResponse(messages, {
                skillLevel: user.skillLevel,
                learningProgress: await storage.getUserCourses(client.userId)
              });

              messages.push({ role: "assistant", content: aiResponse });

              // Save session
              if (session) {
                session = await storage.updateAiTutorSession(session.id, { messages });
              } else {
                session = await storage.createAiTutorSession({
                  userId: client.userId,
                  messages,
                  topic: userMessage.substring(0, 100)
                });
              }

              // Send response
              client.send(JSON.stringify({
                type: 'ai-tutor-response',
                response: aiResponse,
                sessionId: session.id
              }));

              // Stop typing indicator
              client.send(JSON.stringify({
                type: 'ai-tutor-typing',
                isTyping: false
              }));

            } catch (aiError) {
              console.error('AI tutor error:', aiError);
              client.send(JSON.stringify({
                type: 'ai-tutor-error',
                message: 'Failed to process your request. Please try again.'
              }));
              client.send(JSON.stringify({
                type: 'ai-tutor-typing',
                isTyping: false
              }));
            }
            break;
          }

          case 'lesson-progress': {
            // Handle real-time lesson progress updates
            if (!client.userId) {
              client.send(JSON.stringify({
                type: 'error',
                message: 'Not authenticated'
              }));
              return;
            }

            const { lessonId, progress, timeSpent, lastPosition } = data;

            try {
              const existingProgress = await storage.getUserLessonProgress(client.userId, lessonId);

              if (existingProgress) {
                await storage.updateLessonProgress(existingProgress.id, {
                  progress,
                  timeSpent: (existingProgress.timeSpent || 0) + (timeSpent || 0),
                  lastPosition
                });
              } else {
                await storage.createLessonProgress({
                  userId: client.userId,
                  lessonId,
                  progress,
                  timeSpent,
                  lastPosition
                });
              }

              client.send(JSON.stringify({
                type: 'progress-saved',
                lessonId,
                progress
              }));
            } catch (progressError) {
              console.error('Progress save error:', progressError);
            }
            break;
          }

          case 'study-group-message': {
            // Handle study group real-time messaging
            if (!client.userId) {
              client.send(JSON.stringify({
                type: 'error',
                message: 'Not authenticated'
              }));
              return;
            }

            const { groupId, message: groupMessage } = data;

            // Broadcast to all connected members of the study group
            // Note: In production, you'd want to track group memberships
            wss.clients.forEach((wsClient) => {
              const c = wsClient as WebSocketClient;
              if (c.readyState === WebSocket.OPEN && c.userId) {
                c.send(JSON.stringify({
                  type: 'study-group-message',
                  groupId,
                  senderId: client.userId,
                  message: sanitizeContent(groupMessage),
                  timestamp: new Date().toISOString()
                }));
              }
            });
            break;
          }

          case 'ping': {
            // Handle ping for connection check
            client.send(JSON.stringify({ type: 'pong' }));
            break;
          }

          default: {
            client.send(JSON.stringify({
              type: 'error',
              message: `Unknown message type: ${data.type}`
            }));
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        client.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message'
        }));
      }
    });

    client.on('close', () => {
      console.log('WebSocket connection closed');
      if (client.userId) {
        connectedClients.delete(client.userId);
        console.log(`User ${client.userId} disconnected`);
      }
    });

    client.on('error', (error) => {
      console.error('WebSocket error:', error);
      if (client.userId) {
        connectedClients.delete(client.userId);
      }
    });
  });

  // Helper function to send notifications to specific user
  (app as any).sendNotification = (userId: string, notification: any) => {
    const client = connectedClients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'notification',
        ...notification
      }));
    }
  };

  return httpServer;
}
