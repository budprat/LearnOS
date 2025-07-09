import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  generatePersonalizedRecommendations, 
  generateAiTutorResponse, 
  generateLearningPathSuggestions,
  analyzeUserProgress 
} from "./openai";
import { 
  insertCourseSchema, 
  insertLearningPathSchema, 
  insertUserCourseSchema,
  insertAssessmentSchema,
  insertStudyGroupSchema,
  insertAiTutorSessionSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard data endpoint
  app.get('/api/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const userCourses = await storage.getUserCourses(userId);
      res.json(userCourses);
    } catch (error) {
      console.error("Error fetching user courses:", error);
      res.status(500).json({ message: "Failed to fetch user courses" });
    }
  });

  app.post('/api/user/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const paths = await storage.getUserLearningPaths(userId);
      res.json(paths);
    } catch (error) {
      console.error("Error fetching learning paths:", error);
      res.status(500).json({ message: "Failed to fetch learning paths" });
    }
  });

  app.post('/api/learning-paths', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const recommendations = await storage.getUserRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.post('/api/recommendations/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const assessments = await storage.getUserAssessments(userId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  app.post('/api/assessments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const sessions = await storage.getUserAiTutorSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching AI tutor sessions:", error);
      res.status(500).json({ message: "Failed to fetch AI tutor sessions" });
    }
  });

  app.post('/api/ai-tutor/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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

  const httpServer = createServer(app);

  // WebSocket setup for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'ai-tutor-message') {
          // Handle real-time AI tutor messages
          const { userId, message: userMessage } = data;
          // Process AI tutor response and send back
          ws.send(JSON.stringify({
            type: 'ai-tutor-response',
            message: 'Processing your question...'
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}
