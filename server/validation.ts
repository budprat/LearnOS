import { z } from "zod";

// ============================================
// VALIDATION SCHEMAS FOR ALL API ENDPOINTS
// ============================================

// Base schemas for reusable types
const uuidSchema = z.string().uuid("Invalid UUID format");
const positiveIntSchema = z.number().int().positive("Must be a positive integer");
const percentageSchema = z.number().min(0).max(100, "Must be between 0 and 100");
const nonEmptyString = z.string().min(1, "Cannot be empty");

// ============================================
// USER SCHEMAS
// ============================================

export const userProfileSchema = z.object({
  firstName: z.string().max(100).optional().nullable(),
  lastName: z.string().max(100).optional().nullable(),
  profileImageUrl: z.string().url().optional().nullable(),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional(),
  weeklyGoalHours: z.number().int().min(1).max(168).optional(),
});

export const updateUserStatsSchema = z.object({
  currentStreak: z.number().int().min(0).optional(),
  totalLearningHours: z.number().int().min(0).optional(),
  level: z.number().int().min(1).optional(),
  totalXp: z.number().int().min(0).optional(),
});

// ============================================
// COURSE SCHEMAS
// ============================================

export const createCourseSchema = z.object({
  title: nonEmptyString.max(200, "Title must be 200 characters or less"),
  description: z.string().max(5000, "Description must be 5000 characters or less").optional().nullable(),
  thumbnailUrl: z.string().url("Invalid thumbnail URL").optional().nullable(),
  estimatedDuration: positiveIntSchema.max(10000, "Duration too long").optional().nullable(),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  category: nonEmptyString.max(100, "Category must be 100 characters or less"),
});

export const updateCourseSchema = createCourseSchema.partial();

export const courseIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Course ID must be a number").transform(Number),
});

// ============================================
// USER COURSE SCHEMAS
// ============================================

export const enrollCourseSchema = z.object({
  courseId: positiveIntSchema,
});

export const updateUserCourseSchema = z.object({
  progress: percentageSchema.optional(),
  isCompleted: z.boolean().optional(),
  completedAt: z.string().datetime().optional().nullable(),
});

// ============================================
// LEARNING PATH SCHEMAS
// ============================================

export const createLearningPathSchema = z.object({
  title: nonEmptyString.max(200, "Title must be 200 characters or less"),
  description: z.string().max(2000, "Description must be 2000 characters or less").optional().nullable(),
  totalSteps: positiveIntSchema.max(100, "Too many steps"),
  currentStep: z.number().int().min(0).default(0),
  progress: percentageSchema.default(0),
});

export const updateLearningPathSchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  currentStep: z.number().int().min(0).optional(),
  progress: percentageSchema.optional(),
});

// ============================================
// ASSESSMENT SCHEMAS
// ============================================

export const createAssessmentSchema = z.object({
  courseId: positiveIntSchema.optional().nullable(),
  title: nonEmptyString.max(200, "Title must be 200 characters or less"),
  description: z.string().max(2000, "Description must be 2000 characters or less").optional().nullable(),
  type: z.enum(["quiz", "project", "assignment", "exam"]),
  dueDate: z.string().datetime().optional().nullable(),
});

export const updateAssessmentSchema = z.object({
  isCompleted: z.boolean().optional(),
  score: percentageSchema.optional().nullable(),
});

export const submitAssessmentSchema = z.object({
  answers: z.record(z.string(), z.string()).refine(
    (obj) => Object.keys(obj).length > 0,
    "At least one answer is required"
  ),
  timeSpent: positiveIntSchema.optional(),
});

// ============================================
// STUDY GROUP SCHEMAS
// ============================================

export const createStudyGroupSchema = z.object({
  name: nonEmptyString.max(100, "Name must be 100 characters or less"),
  description: z.string().max(1000, "Description must be 1000 characters or less").optional().nullable(),
  courseId: positiveIntSchema.optional().nullable(),
  maxMembers: z.number().int().min(2).max(100).default(50),
});

export const studyGroupIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Study group ID must be a number").transform(Number),
});

// ============================================
// AI TUTOR SCHEMAS
// ============================================

export const aiTutorChatSchema = z.object({
  message: nonEmptyString
    .max(2000, "Message must be 2000 characters or less")
    .refine((msg) => msg.trim().length > 0, "Message cannot be only whitespace"),
  sessionId: z.string().optional(),
});

export const createAiTutorSessionSchema = z.object({
  topic: z.string().max(200, "Topic must be 200 characters or less").optional(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })
  ).default([]),
});

// ============================================
// AI ENDPOINT SCHEMAS
// ============================================

export const generateRecommendationsSchema = z.object({
  // Optional body params for customization
  forceRefresh: z.boolean().default(false),
});

export const detectLearningStyleSchema = z.object({
  interactionHistory: z.array(z.any()).default([]),
  coursePreferences: z.array(z.any()).default([]),
});

export const analyzeSentimentSchema = z.object({
  messages: z.array(z.string()).min(1, "At least one message is required"),
  context: z.record(z.string(), z.any()).default({}),
});

export const generateAdaptiveQuestionsSchema = z.object({
  topic: nonEmptyString.max(200, "Topic must be 200 characters or less"),
  userLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  previousAnswers: z.array(z.any()).default([]),
  learningObjectives: z.array(z.string()).default([]),
});

export const predictInterventionSchema = z.object({
  progressData: z.record(z.string(), z.any()).default({}),
  engagementMetrics: z.record(z.string(), z.any()).default({}),
  assessmentHistory: z.array(z.any()).default([]),
});

export const competencyMapQuerySchema = z.object({
  targetRole: z.string().max(100).optional(),
});

// ============================================
// LESSON SCHEMAS
// ============================================

export const lessonIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Lesson ID must be a number").transform(Number),
});

export const createLessonSchema = z.object({
  title: nonEmptyString.max(200, "Title must be 200 characters or less"),
  description: z.string().max(2000, "Description must be 2000 characters or less").optional().nullable(),
  content: nonEmptyString.max(100000, "Content too long"),
  videoUrl: z.string().url("Invalid video URL").optional().nullable(),
  duration: positiveIntSchema.max(600, "Duration must be 600 minutes or less"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  topics: z.array(z.string().max(100)).max(20).default([]),
  prerequisites: z.array(z.string().max(100)).max(10).default([]),
  learningObjectives: z.array(z.string().max(500)).max(20).default([]),
  interactiveElements: z.any().optional(),
  assessments: z.any().optional(),
  resources: z.any().optional(),
  courseId: positiveIntSchema.optional().nullable(),
});

export const updateLessonProgressSchema = z.object({
  progress: percentageSchema.optional(),
  timeSpent: z.number().int().min(0).max(86400).optional(), // Max 24 hours in seconds
  completedSections: z.array(z.string()).optional(),
  lastPosition: z.number().int().min(0).optional(),
});

export const createLessonNoteSchema = z.object({
  content: nonEmptyString.max(5000, "Note content must be 5000 characters or less"),
  position: z.number().int().min(0).default(0),
  highlighted: z.boolean().default(false),
});

export const updateLessonNoteSchema = z.object({
  content: z.string().max(5000).optional(),
  highlighted: z.boolean().optional(),
});

export const createLessonBookmarkSchema = z.object({
  title: nonEmptyString.max(200, "Bookmark title must be 200 characters or less"),
  position: z.number().int().min(0),
});

export const noteIdParamSchema = z.object({
  noteId: z.string().regex(/^\d+$/, "Note ID must be a number").transform(Number),
});

export const bookmarkIdParamSchema = z.object({
  bookmarkId: z.string().regex(/^\d+$/, "Bookmark ID must be a number").transform(Number),
});

// ============================================
// LESSON ASSESSMENT RESULT SCHEMAS
// ============================================

export const submitLessonAssessmentSchema = z.object({
  assessmentId: nonEmptyString.max(100),
  score: z.number().int().min(0).max(100),
  answers: z.record(z.string(), z.any()).optional(),
  timeSpent: positiveIntSchema,
});

// ============================================
// SEED SCHEMAS
// ============================================

export const seedLessonsSchema = z.object({
  // No body required, but validate it's empty or has expected structure
}).optional();

// ============================================
// VALIDATION HELPER FUNCTIONS
// ============================================

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: z.ZodError };

export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): ValidationResult<T> {
  const result = schema.safeParse(body);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

export function validateParams<T>(schema: z.ZodSchema<T>, params: unknown): ValidationResult<T> {
  const result = schema.safeParse(params);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

export function validateQuery<T>(schema: z.ZodSchema<T>, query: unknown): ValidationResult<T> {
  const result = schema.safeParse(query);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

// Express middleware for Zod validation
export function zodValidate<T>(
  schema: z.ZodSchema<T>,
  source: "body" | "params" | "query" = "body"
) {
  return (req: any, res: any, next: any) => {
    const data = source === "body" ? req.body : source === "params" ? req.params : req.query;
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    // Attach validated data to request
    if (source === "body") {
      req.validatedBody = result.data;
    } else if (source === "params") {
      req.validatedParams = result.data;
    } else {
      req.validatedQuery = result.data;
    }

    next();
  };
}

// Sanitize HTML content to prevent XSS
export function sanitizeContent(content: string): string {
  // Basic sanitization - remove script tags and event handlers
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

// Export all schemas for use in routes
export const schemas = {
  // User
  userProfile: userProfileSchema,
  updateUserStats: updateUserStatsSchema,

  // Course
  createCourse: createCourseSchema,
  updateCourse: updateCourseSchema,
  courseIdParam: courseIdParamSchema,

  // User Course
  enrollCourse: enrollCourseSchema,
  updateUserCourse: updateUserCourseSchema,

  // Learning Path
  createLearningPath: createLearningPathSchema,
  updateLearningPath: updateLearningPathSchema,

  // Assessment
  createAssessment: createAssessmentSchema,
  updateAssessment: updateAssessmentSchema,
  submitAssessment: submitAssessmentSchema,

  // Study Group
  createStudyGroup: createStudyGroupSchema,
  studyGroupIdParam: studyGroupIdParamSchema,

  // AI Tutor
  aiTutorChat: aiTutorChatSchema,
  createAiTutorSession: createAiTutorSessionSchema,

  // AI Endpoints
  generateRecommendations: generateRecommendationsSchema,
  detectLearningStyle: detectLearningStyleSchema,
  analyzeSentiment: analyzeSentimentSchema,
  generateAdaptiveQuestions: generateAdaptiveQuestionsSchema,
  predictIntervention: predictInterventionSchema,
  competencyMapQuery: competencyMapQuerySchema,

  // Lesson
  lessonIdParam: lessonIdParamSchema,
  createLesson: createLessonSchema,
  updateLessonProgress: updateLessonProgressSchema,
  createLessonNote: createLessonNoteSchema,
  updateLessonNote: updateLessonNoteSchema,
  createLessonBookmark: createLessonBookmarkSchema,
  noteIdParam: noteIdParamSchema,
  bookmarkIdParam: bookmarkIdParamSchema,

  // Lesson Assessment
  submitLessonAssessment: submitLessonAssessmentSchema,
};
