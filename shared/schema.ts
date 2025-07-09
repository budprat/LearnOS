import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table extends Supabase auth.users, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(), // UUID from Supabase auth.users
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  currentStreak: integer("current_streak").default(0),
  totalLearningHours: integer("total_learning_hours").default(0),
  level: integer("level").default(1),
  skillLevel: varchar("skill_level").default("Beginner"),
  weeklyGoalHours: integer("weekly_goal_hours").default(7),
  totalXp: integer("total_xp").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  thumbnailUrl: varchar("thumbnail_url"),
  estimatedDuration: integer("estimated_duration"), // in minutes
  skillLevel: varchar("skill_level").notNull(),
  category: varchar("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  currentStep: integer("current_step").default(0),
  totalSteps: integer("total_steps").notNull(),
  progress: real("progress").default(0), // percentage
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userCourses = pgTable("user_courses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  progress: real("progress").default(0), // percentage
  isCompleted: boolean("is_completed").default(false),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // quiz, project, etc.
  dueDate: timestamp("due_date"),
  isCompleted: boolean("is_completed").default(false),
  score: real("score"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id),
  title: varchar("title").notNull(),
  description: text("description"),
  thumbnailUrl: varchar("thumbnail_url"),
  estimatedDuration: integer("estimated_duration"),
  reason: text("reason"), // AI explanation for recommendation
  priority: integer("priority").default(1),
  isViewed: boolean("is_viewed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const studyGroups = pgTable("study_groups", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  courseId: integer("course_id").references(() => courses.id),
  memberCount: integer("member_count").default(0),
  maxMembers: integer("max_members").default(50),
  createdAt: timestamp("created_at").defaultNow(),
});

export const studyGroupMembers = pgTable("study_group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").references(() => studyGroups.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: varchar("role").default("member"), // member, admin
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const aiTutorSessions = pgTable("ai_tutor_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  messages: jsonb("messages").notNull(), // array of messages
  topic: varchar("topic"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  videoUrl: varchar("video_url"),
  duration: integer("duration").notNull(), // in minutes
  difficulty: varchar("difficulty").notNull(), // beginner, intermediate, advanced
  topics: jsonb("topics").$type<string[]>(),
  prerequisites: jsonb("prerequisites").$type<string[]>(),
  learningObjectives: jsonb("learning_objectives").$type<string[]>(),
  interactiveElements: jsonb("interactive_elements"),
  assessments: jsonb("assessments"),
  resources: jsonb("resources"),
  courseId: integer("course_id").references(() => courses.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const lessonProgress = pgTable("lesson_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  progress: integer("progress").default(0), // percentage
  timeSpent: integer("time_spent").default(0), // in seconds
  completedSections: jsonb("completed_sections").$type<string[]>(),
  lastPosition: integer("last_position").default(0), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const lessonNotes = pgTable("lesson_notes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  content: text("content").notNull(),
  position: integer("position").notNull(), // position in video/content
  highlighted: boolean("highlighted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const lessonBookmarks = pgTable("lesson_bookmarks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  title: varchar("title").notNull(),
  position: integer("position").notNull(), // position in video/content
  createdAt: timestamp("created_at").defaultNow(),
});

export const lessonAssessmentResults = pgTable("lesson_assessment_results", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  assessmentId: varchar("assessment_id").notNull(),
  score: integer("score").notNull(),
  answers: jsonb("answers"),
  timeSpent: integer("time_spent").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userCourses: many(userCourses),
  learningPaths: many(learningPaths),
  assessments: many(assessments),
  recommendations: many(recommendations),
  studyGroupMembers: many(studyGroupMembers),
  aiTutorSessions: many(aiTutorSessions),
  lessonProgress: many(lessonProgress),
  lessonNotes: many(lessonNotes),
  lessonBookmarks: many(lessonBookmarks),
  lessonAssessmentResults: many(lessonAssessmentResults),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  userCourses: many(userCourses),
  assessments: many(assessments),
  recommendations: many(recommendations),
  studyGroups: many(studyGroups),
  lessons: many(lessons),
}));

export const learningPathsRelations = relations(learningPaths, ({ one }) => ({
  user: one(users, {
    fields: [learningPaths.userId],
    references: [users.id],
  }),
}));

export const userCoursesRelations = relations(userCourses, ({ one }) => ({
  user: one(users, {
    fields: [userCourses.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [userCourses.courseId],
    references: [courses.id],
  }),
}));

export const assessmentsRelations = relations(assessments, ({ one }) => ({
  user: one(users, {
    fields: [assessments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [assessments.courseId],
    references: [courses.id],
  }),
}));

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  user: one(users, {
    fields: [recommendations.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [recommendations.courseId],
    references: [courses.id],
  }),
}));

export const studyGroupsRelations = relations(studyGroups, ({ one, many }) => ({
  course: one(courses, {
    fields: [studyGroups.courseId],
    references: [courses.id],
  }),
  members: many(studyGroupMembers),
}));

export const studyGroupMembersRelations = relations(studyGroupMembers, ({ one }) => ({
  group: one(studyGroups, {
    fields: [studyGroupMembers.groupId],
    references: [studyGroups.id],
  }),
  user: one(users, {
    fields: [studyGroupMembers.userId],
    references: [users.id],
  }),
}));

export const aiTutorSessionsRelations = relations(aiTutorSessions, ({ one }) => ({
  user: one(users, {
    fields: [aiTutorSessions.userId],
    references: [users.id],
  }),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  lessonProgress: many(lessonProgress),
  lessonNotes: many(lessonNotes),
  lessonBookmarks: many(lessonBookmarks),
  lessonAssessmentResults: many(lessonAssessmentResults),
}));

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  user: one(users, {
    fields: [lessonProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [lessonProgress.lessonId],
    references: [lessons.id],
  }),
}));

export const lessonNotesRelations = relations(lessonNotes, ({ one }) => ({
  user: one(users, {
    fields: [lessonNotes.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [lessonNotes.lessonId],
    references: [lessons.id],
  }),
}));

export const lessonBookmarksRelations = relations(lessonBookmarks, ({ one }) => ({
  user: one(users, {
    fields: [lessonBookmarks.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [lessonBookmarks.lessonId],
    references: [lessons.id],
  }),
}));

export const lessonAssessmentResultsRelations = relations(lessonAssessmentResults, ({ one }) => ({
  user: one(users, {
    fields: [lessonAssessmentResults.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [lessonAssessmentResults.lessonId],
    references: [lessons.id],
  }),
}));

// Export schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserCourseSchema = createInsertSchema(userCourses).omit({
  id: true,
  startedAt: true,
  lastAccessedAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

export const insertStudyGroupSchema = createInsertSchema(studyGroups).omit({
  id: true,
  createdAt: true,
});

export const insertStudyGroupMemberSchema = createInsertSchema(studyGroupMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertAiTutorSessionSchema = createInsertSchema(aiTutorSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLessonProgressSchema = createInsertSchema(lessonProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLessonNoteSchema = createInsertSchema(lessonNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLessonBookmarkSchema = createInsertSchema(lessonBookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertLessonAssessmentResultSchema = createInsertSchema(lessonAssessmentResults).omit({
  id: true,
  createdAt: true,
});

// Export types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type UserCourse = typeof userCourses.$inferSelect;
export type InsertUserCourse = z.infer<typeof insertUserCourseSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type StudyGroup = typeof studyGroups.$inferSelect;
export type InsertStudyGroup = z.infer<typeof insertStudyGroupSchema>;
export type StudyGroupMember = typeof studyGroupMembers.$inferSelect;
export type InsertStudyGroupMember = z.infer<typeof insertStudyGroupMemberSchema>;
export type AiTutorSession = typeof aiTutorSessions.$inferSelect;
export type InsertAiTutorSession = z.infer<typeof insertAiTutorSessionSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type LessonProgress = typeof lessonProgress.$inferSelect;
export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;

export type LessonNote = typeof lessonNotes.$inferSelect;
export type InsertLessonNote = z.infer<typeof insertLessonNoteSchema>;

export type LessonBookmark = typeof lessonBookmarks.$inferSelect;
export type InsertLessonBookmark = z.infer<typeof insertLessonBookmarkSchema>;

export type LessonAssessmentResult = typeof lessonAssessmentResults.$inferSelect;
export type InsertLessonAssessmentResult = z.infer<typeof insertLessonAssessmentResultSchema>;
