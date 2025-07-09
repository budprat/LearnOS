import {
  users,
  courses,
  learningPaths,
  userCourses,
  assessments,
  recommendations,
  studyGroups,
  studyGroupMembers,
  aiTutorSessions,
  lessons,
  lessonProgress,
  lessonNotes,
  lessonBookmarks,
  lessonAssessmentResults,
  type User,
  type UpsertUser,
  type Course,
  type InsertCourse,
  type LearningPath,
  type InsertLearningPath,
  type UserCourse,
  type InsertUserCourse,
  type Assessment,
  type InsertAssessment,
  type Recommendation,
  type InsertRecommendation,
  type StudyGroup,
  type InsertStudyGroup,
  type StudyGroupMember,
  type InsertStudyGroupMember,
  type AiTutorSession,
  type InsertAiTutorSession,
  type Lesson,
  type InsertLesson,
  type LessonProgress,
  type InsertLessonProgress,
  type LessonNote,
  type InsertLessonNote,
  type LessonBookmark,
  type InsertLessonBookmark,
  type LessonAssessmentResult,
  type InsertLessonAssessmentResult,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStats(userId: string, stats: Partial<User>): Promise<User>;
  
  // Course operations
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Learning path operations
  getUserLearningPaths(userId: string): Promise<LearningPath[]>;
  createLearningPath(path: InsertLearningPath): Promise<LearningPath>;
  updateLearningPath(id: number, updates: Partial<LearningPath>): Promise<LearningPath>;
  
  // User course operations
  getUserCourses(userId: string): Promise<(UserCourse & { course: Course })[]>;
  getUserCourse(userId: string, courseId: number): Promise<UserCourse | undefined>;
  createUserCourse(userCourse: InsertUserCourse): Promise<UserCourse>;
  updateUserCourse(id: number, updates: Partial<UserCourse>): Promise<UserCourse>;
  
  // Assessment operations
  getUserAssessments(userId: string): Promise<(Assessment & { course?: Course })[]>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: number, updates: Partial<Assessment>): Promise<Assessment>;
  
  // Recommendation operations
  getUserRecommendations(userId: string): Promise<(Recommendation & { course?: Course })[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  markRecommendationViewed(id: number): Promise<Recommendation>;
  
  // Study group operations
  getStudyGroups(): Promise<StudyGroup[]>;
  getUserStudyGroups(userId: string): Promise<(StudyGroup & { memberCount: number })[]>;
  createStudyGroup(group: InsertStudyGroup): Promise<StudyGroup>;
  joinStudyGroup(groupId: number, userId: string): Promise<StudyGroupMember>;
  
  // AI tutor operations
  getUserAiTutorSessions(userId: string): Promise<AiTutorSession[]>;
  createAiTutorSession(session: InsertAiTutorSession): Promise<AiTutorSession>;
  updateAiTutorSession(id: number, updates: Partial<AiTutorSession>): Promise<AiTutorSession>;
  
  // Lesson operations
  getLessons(): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, updates: Partial<Lesson>): Promise<Lesson>;
  
  // Lesson progress operations
  getUserLessonProgress(userId: string, lessonId: number): Promise<LessonProgress | undefined>;
  createLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress>;
  updateLessonProgress(id: number, updates: Partial<LessonProgress>): Promise<LessonProgress>;
  
  // Lesson notes operations
  getUserLessonNotes(userId: string, lessonId: number): Promise<LessonNote[]>;
  createLessonNote(note: InsertLessonNote): Promise<LessonNote>;
  updateLessonNote(id: number, updates: Partial<LessonNote>): Promise<LessonNote>;
  deleteLessonNote(id: number): Promise<void>;
  
  // Lesson bookmarks operations
  getUserLessonBookmarks(userId: string, lessonId: number): Promise<LessonBookmark[]>;
  createLessonBookmark(bookmark: InsertLessonBookmark): Promise<LessonBookmark>;
  deleteLessonBookmark(id: number): Promise<void>;
  
  // Lesson assessment results operations
  getUserLessonAssessmentResults(userId: string, lessonId: number): Promise<LessonAssessmentResult[]>;
  createLessonAssessmentResult(result: InsertLessonAssessmentResult): Promise<LessonAssessmentResult>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStats(userId: string, stats: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...stats, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Course operations
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(desc(courses.createdAt));
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  // Learning path operations
  async getUserLearningPaths(userId: string): Promise<LearningPath[]> {
    return await db
      .select()
      .from(learningPaths)
      .where(eq(learningPaths.userId, userId))
      .orderBy(desc(learningPaths.createdAt));
  }

  async createLearningPath(path: InsertLearningPath): Promise<LearningPath> {
    const [newPath] = await db.insert(learningPaths).values(path).returning();
    return newPath;
  }

  async updateLearningPath(id: number, updates: Partial<LearningPath>): Promise<LearningPath> {
    const [path] = await db
      .update(learningPaths)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(learningPaths.id, id))
      .returning();
    return path;
  }

  // User course operations
  async getUserCourses(userId: string): Promise<(UserCourse & { course: Course })[]> {
    return await db
      .select({
        id: userCourses.id,
        userId: userCourses.userId,
        courseId: userCourses.courseId,
        progress: userCourses.progress,
        isCompleted: userCourses.isCompleted,
        startedAt: userCourses.startedAt,
        completedAt: userCourses.completedAt,
        lastAccessedAt: userCourses.lastAccessedAt,
        course: courses,
      })
      .from(userCourses)
      .innerJoin(courses, eq(userCourses.courseId, courses.id))
      .where(eq(userCourses.userId, userId))
      .orderBy(desc(userCourses.lastAccessedAt));
  }

  async getUserCourse(userId: string, courseId: number): Promise<UserCourse | undefined> {
    const [userCourse] = await db
      .select()
      .from(userCourses)
      .where(and(eq(userCourses.userId, userId), eq(userCourses.courseId, courseId)));
    return userCourse;
  }

  async createUserCourse(userCourse: InsertUserCourse): Promise<UserCourse> {
    const [newUserCourse] = await db.insert(userCourses).values(userCourse).returning();
    return newUserCourse;
  }

  async updateUserCourse(id: number, updates: Partial<UserCourse>): Promise<UserCourse> {
    const [userCourse] = await db
      .update(userCourses)
      .set({ ...updates, lastAccessedAt: new Date() })
      .where(eq(userCourses.id, id))
      .returning();
    return userCourse;
  }

  // Assessment operations
  async getUserAssessments(userId: string): Promise<(Assessment & { course?: Course })[]> {
    const results = await db
      .select({
        id: assessments.id,
        userId: assessments.userId,
        courseId: assessments.courseId,
        title: assessments.title,
        description: assessments.description,
        type: assessments.type,
        dueDate: assessments.dueDate,
        isCompleted: assessments.isCompleted,
        score: assessments.score,
        createdAt: assessments.createdAt,
        updatedAt: assessments.updatedAt,
        course: courses,
      })
      .from(assessments)
      .leftJoin(courses, eq(assessments.courseId, courses.id))
      .where(eq(assessments.userId, userId))
      .orderBy(assessments.dueDate);
    
    return results.map(result => ({
      ...result,
      course: result.course || undefined
    }));
  }

  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db.insert(assessments).values(assessment).returning();
    return newAssessment;
  }

  async updateAssessment(id: number, updates: Partial<Assessment>): Promise<Assessment> {
    const [assessment] = await db
      .update(assessments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(assessments.id, id))
      .returning();
    return assessment;
  }

  // Recommendation operations
  async getUserRecommendations(userId: string): Promise<(Recommendation & { course?: Course })[]> {
    const results = await db
      .select({
        id: recommendations.id,
        userId: recommendations.userId,
        courseId: recommendations.courseId,
        title: recommendations.title,
        description: recommendations.description,
        thumbnailUrl: recommendations.thumbnailUrl,
        estimatedDuration: recommendations.estimatedDuration,
        reason: recommendations.reason,
        priority: recommendations.priority,
        isViewed: recommendations.isViewed,
        createdAt: recommendations.createdAt,
        course: courses,
      })
      .from(recommendations)
      .leftJoin(courses, eq(recommendations.courseId, courses.id))
      .where(eq(recommendations.userId, userId))
      .orderBy(desc(recommendations.priority), desc(recommendations.createdAt))
      .limit(10);
    
    return results.map(result => ({
      ...result,
      course: result.course || undefined
    }));
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const [newRecommendation] = await db.insert(recommendations).values(recommendation).returning();
    return newRecommendation;
  }

  async markRecommendationViewed(id: number): Promise<Recommendation> {
    const [recommendation] = await db
      .update(recommendations)
      .set({ isViewed: true })
      .where(eq(recommendations.id, id))
      .returning();
    return recommendation;
  }

  // Study group operations
  async getStudyGroups(): Promise<StudyGroup[]> {
    return await db.select().from(studyGroups).orderBy(desc(studyGroups.createdAt));
  }

  async getUserStudyGroups(userId: string): Promise<(StudyGroup & { memberCount: number })[]> {
    const results = await db
      .select({
        id: studyGroups.id,
        name: studyGroups.name,
        description: studyGroups.description,
        courseId: studyGroups.courseId,
        memberCount: studyGroups.memberCount,
        maxMembers: studyGroups.maxMembers,
        createdAt: studyGroups.createdAt,
      })
      .from(studyGroups)
      .innerJoin(studyGroupMembers, eq(studyGroups.id, studyGroupMembers.groupId))
      .where(eq(studyGroupMembers.userId, userId));
    
    return results.map(result => ({
      ...result,
      memberCount: result.memberCount || 0
    }));
  }

  async createStudyGroup(group: InsertStudyGroup): Promise<StudyGroup> {
    const [newGroup] = await db.insert(studyGroups).values(group).returning();
    return newGroup;
  }

  async joinStudyGroup(groupId: number, userId: string): Promise<StudyGroupMember> {
    const [member] = await db
      .insert(studyGroupMembers)
      .values({ groupId, userId })
      .returning();
    
    // Update member count
    await db
      .update(studyGroups)
      .set({ 
        memberCount: sql`${studyGroups.memberCount} + 1` 
      })
      .where(eq(studyGroups.id, groupId));
    
    return member;
  }

  // AI tutor operations
  async getUserAiTutorSessions(userId: string): Promise<AiTutorSession[]> {
    return await db
      .select()
      .from(aiTutorSessions)
      .where(eq(aiTutorSessions.userId, userId))
      .orderBy(desc(aiTutorSessions.updatedAt));
  }

  async createAiTutorSession(session: InsertAiTutorSession): Promise<AiTutorSession> {
    const [newSession] = await db.insert(aiTutorSessions).values(session).returning();
    return newSession;
  }

  async updateAiTutorSession(id: number, updates: Partial<AiTutorSession>): Promise<AiTutorSession> {
    const [session] = await db
      .update(aiTutorSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(aiTutorSessions.id, id))
      .returning();
    return session;
  }

  // Lesson operations
  async getLessons(): Promise<Lesson[]> {
    return await db.select().from(lessons);
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db
      .insert(lessons)
      .values({
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        duration: lesson.duration,
        difficulty: lesson.difficulty,
        topics: lesson.topics || [],
        prerequisites: lesson.prerequisites || [],
        learningObjectives: lesson.learningObjectives || [],
        interactiveElements: lesson.interactiveElements,
        assessments: lesson.assessments,
        resources: lesson.resources,
        courseId: lesson.courseId,
      })
      .returning();
    return newLesson;
  }

  async updateLesson(id: number, updates: Partial<Lesson>): Promise<Lesson> {
    const [lesson] = await db
      .update(lessons)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(lessons.id, id))
      .returning();
    return lesson;
  }

  // Lesson progress operations
  async getUserLessonProgress(userId: string, lessonId: number): Promise<LessonProgress | undefined> {
    const [progress] = await db
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)));
    return progress;
  }

  async createLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress> {
    const [newProgress] = await db
      .insert(lessonProgress)
      .values({
        userId: progress.userId,
        lessonId: progress.lessonId,
        progress: progress.progress || 0,
        timeSpent: progress.timeSpent || 0,
        completedSections: progress.completedSections || [],
        lastPosition: progress.lastPosition || 0,
      })
      .returning();
    return newProgress;
  }

  async updateLessonProgress(id: number, updates: Partial<LessonProgress>): Promise<LessonProgress> {
    const [progress] = await db
      .update(lessonProgress)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(lessonProgress.id, id))
      .returning();
    return progress;
  }

  // Lesson notes operations
  async getUserLessonNotes(userId: string, lessonId: number): Promise<LessonNote[]> {
    return await db
      .select()
      .from(lessonNotes)
      .where(and(eq(lessonNotes.userId, userId), eq(lessonNotes.lessonId, lessonId)))
      .orderBy(lessonNotes.position);
  }

  async createLessonNote(note: InsertLessonNote): Promise<LessonNote> {
    const [newNote] = await db
      .insert(lessonNotes)
      .values({
        userId: note.userId,
        lessonId: note.lessonId,
        content: note.content,
        position: note.position,
        highlighted: note.highlighted || false,
      })
      .returning();
    return newNote;
  }

  async updateLessonNote(id: number, updates: Partial<LessonNote>): Promise<LessonNote> {
    const [note] = await db
      .update(lessonNotes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(lessonNotes.id, id))
      .returning();
    return note;
  }

  async deleteLessonNote(id: number): Promise<void> {
    await db.delete(lessonNotes).where(eq(lessonNotes.id, id));
  }

  // Lesson bookmarks operations
  async getUserLessonBookmarks(userId: string, lessonId: number): Promise<LessonBookmark[]> {
    return await db
      .select()
      .from(lessonBookmarks)
      .where(and(eq(lessonBookmarks.userId, userId), eq(lessonBookmarks.lessonId, lessonId)))
      .orderBy(lessonBookmarks.position);
  }

  async createLessonBookmark(bookmark: InsertLessonBookmark): Promise<LessonBookmark> {
    const [newBookmark] = await db
      .insert(lessonBookmarks)
      .values({
        userId: bookmark.userId,
        lessonId: bookmark.lessonId,
        title: bookmark.title,
        position: bookmark.position,
      })
      .returning();
    return newBookmark;
  }

  async deleteLessonBookmark(id: number): Promise<void> {
    await db.delete(lessonBookmarks).where(eq(lessonBookmarks.id, id));
  }

  // Lesson assessment results operations
  async getUserLessonAssessmentResults(userId: string, lessonId: number): Promise<LessonAssessmentResult[]> {
    return await db
      .select()
      .from(lessonAssessmentResults)
      .where(and(eq(lessonAssessmentResults.userId, userId), eq(lessonAssessmentResults.lessonId, lessonId)))
      .orderBy(desc(lessonAssessmentResults.createdAt));
  }

  async createLessonAssessmentResult(result: InsertLessonAssessmentResult): Promise<LessonAssessmentResult> {
    const [newResult] = await db
      .insert(lessonAssessmentResults)
      .values({
        userId: result.userId,
        lessonId: result.lessonId,
        assessmentId: result.assessmentId,
        score: result.score,
        answers: result.answers,
        timeSpent: result.timeSpent,
      })
      .returning();
    return newResult;
  }
}

export const storage = new DatabaseStorage();
