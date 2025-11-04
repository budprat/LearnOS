import OpenAI from "openai";
import type { User, Course, UserCourse, Assessment } from "@shared/schema";

// Get OpenAI API key from environment variable
const apiKey = process.env.OPENAI_API_KEY;

// Validate required environment variable
if (!apiKey) {
  throw new Error('Missing required environment variable: OPENAI_API_KEY. Please check your .env file.');
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: apiKey
});

// Advanced AI types for adaptive learning
interface LearningStyle {
  visual: number;
  auditory: number;
  kinesthetic: number;
  reading: number;
}

interface EmotionalState {
  sentiment: 'positive' | 'neutral' | 'negative' | 'frustrated' | 'engaged';
  confidence: number;
  motivationLevel: number;
}

export async function generatePersonalizedRecommendations(
  userId: string,
  userProgress: any,
  completedCourses: any[],
  skillLevel: string
): Promise<{
  recommendations: Array<{
    title: string;
    description: string;
    reason: string;
    priority: number;
    estimatedDuration: number;
  }>;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI learning assistant that provides personalized course recommendations based on user progress and skill level. Analyze the user's learning data and provide relevant recommendations with explanations.`,
        },
        {
          role: "user",
          content: `User skill level: ${skillLevel}
User progress: ${JSON.stringify(userProgress)}
Completed courses: ${JSON.stringify(completedCourses)}

Please provide 3-5 personalized course recommendations in JSON format with the following structure:
{
  "recommendations": [
    {
      "title": "Course Title",
      "description": "Course description",
      "reason": "Why this course is recommended for this user",
      "priority": 1-5,
      "estimatedDuration": duration_in_minutes
    }
  ]
}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return { recommendations: [] };
  }
}

export async function generateAiTutorResponse(
  messages: Array<{ role: string; content: string }>,
  userContext: any
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI tutor that provides personalized learning guidance. You use the Socratic method to guide students to understanding through strategic questioning. Be encouraging, patient, and adaptive to the student's learning style and pace.

User context: ${JSON.stringify(userContext)}

Guidelines:
- Ask probing questions to guide understanding
- Provide hints without giving away answers
- Celebrate progress and achievements
- Adapt explanations to the user's skill level
- Be encouraging and supportive`,
        },
        ...messages,
      ],
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process your request right now.";
  } catch (error) {
    console.error("Error generating AI tutor response:", error);
    return "I'm experiencing some technical difficulties. Please try again later.";
  }
}

export async function generateLearningPathSuggestions(
  userId: string,
  goals: string[],
  currentSkillLevel: string,
  timeAvailable: number
): Promise<{
  path: {
    title: string;
    description: string;
    steps: Array<{
      title: string;
      description: string;
      estimatedDuration: number;
      skills: string[];
    }>;
    totalDuration: number;
  };
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI learning path generator that creates personalized learning journeys based on user goals, skill level, and time availability.`,
        },
        {
          role: "user",
          content: `User goals: ${goals.join(", ")}
Current skill level: ${currentSkillLevel}
Time available per week: ${timeAvailable} hours

Please create a personalized learning path in JSON format:
{
  "path": {
    "title": "Learning Path Title",
    "description": "Path description",
    "steps": [
      {
        "title": "Step title",
        "description": "Step description",
        "estimatedDuration": duration_in_minutes,
        "skills": ["skill1", "skill2"]
      }
    ],
    "totalDuration": total_duration_in_minutes
  }
}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error generating learning path:", error);
    return {
      path: {
        title: "Custom Learning Path",
        description: "A personalized learning journey tailored to your goals",
        steps: [],
        totalDuration: 0,
      },
    };
  }
}

export async function analyzeUserProgress(
  userId: string,
  progressData: any,
  assessmentResults: any[]
): Promise<{
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    nextSteps: string[];
    motivationalMessage: string;
  };
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI learning analytics expert that analyzes user progress and provides insights and recommendations.`,
        },
        {
          role: "user",
          content: `User progress data: ${JSON.stringify(progressData)}
Assessment results: ${JSON.stringify(assessmentResults)}

Please analyze the user's learning progress and provide insights in JSON format:
{
  "analysis": {
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "recommendations": ["recommendation1", "recommendation2"],
    "nextSteps": ["step1", "step2"],
    "motivationalMessage": "Encouraging message for the user"
  }
}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error analyzing user progress:", error);
    return {
      analysis: {
        strengths: [],
        weaknesses: [],
        recommendations: [],
        nextSteps: [],
        motivationalMessage: "Keep up the great work!",
      },
    };
  }
}

// Advanced AI Features based on PRD

export async function detectLearningStyle(
  userId: string,
  interactionHistory: any[],
  coursePreferences: any[]
): Promise<LearningStyle> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI learning style analyzer. Analyze user interactions and preferences to determine their dominant learning style based on the VARK model (Visual, Auditory, Reading/Writing, Kinesthetic).`,
        },
        {
          role: "user",
          content: `Analyze this user's learning patterns:
Interaction history: ${JSON.stringify(interactionHistory)}
Course preferences: ${JSON.stringify(coursePreferences)}

Return a JSON object with scores (0-1) for each learning style:
{
  "visual": 0.0-1.0,
  "auditory": 0.0-1.0,
  "kinesthetic": 0.0-1.0,
  "reading": 0.0-1.0
}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{"visual":0.25,"auditory":0.25,"kinesthetic":0.25,"reading":0.25}');
  } catch (error) {
    console.error("Error detecting learning style:", error);
    return { visual: 0.25, auditory: 0.25, kinesthetic: 0.25, reading: 0.25 };
  }
}

export async function analyzeSentiment(
  messages: string[],
  context: any
): Promise<EmotionalState> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an emotional intelligence AI that analyzes learner sentiment and emotional state to provide better support and motivation.`,
        },
        {
          role: "user",
          content: `Analyze the emotional state from these messages:
Messages: ${JSON.stringify(messages)}
Context: ${JSON.stringify(context)}

Return a JSON object:
{
  "sentiment": "positive|neutral|negative|frustrated|engaged",
  "confidence": 0.0-1.0,
  "motivationLevel": 0.0-1.0
}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{"sentiment":"neutral","confidence":0.5,"motivationLevel":0.5}');
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return { sentiment: 'neutral', confidence: 0.5, motivationLevel: 0.5 };
  }
}

export async function generateAdaptiveQuestions(
  topic: string,
  userLevel: string,
  previousAnswers: any[],
  learningObjectives: string[]
): Promise<{
  questions: Array<{
    id: string;
    question: string;
    type: 'multiple-choice' | 'short-answer' | 'problem-solving';
    difficulty: 'easy' | 'medium' | 'hard';
    hints: string[];
    explanation: string;
    options?: string[];
    correctAnswer?: string;
  }>;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an adaptive assessment AI that generates questions based on user understanding and learning objectives. Create questions that progressively adjust difficulty based on previous answers.`,
        },
        {
          role: "user",
          content: `Generate adaptive questions for:
Topic: ${topic}
User level: ${userLevel}
Previous answers: ${JSON.stringify(previousAnswers)}
Learning objectives: ${learningObjectives.join(", ")}

Return a JSON object with 3-5 questions that adapt to the user's level:
{
  "questions": [
    {
      "id": "unique_id",
      "question": "Question text",
      "type": "multiple-choice|short-answer|problem-solving",
      "difficulty": "easy|medium|hard",
      "hints": ["hint1", "hint2"],
      "explanation": "Detailed explanation",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "correct answer or index"
    }
  ]
}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{"questions":[]}');
  } catch (error) {
    console.error("Error generating adaptive questions:", error);
    return { questions: [] };
  }
}

export async function predictLearningIntervention(
  userId: string,
  progressData: any,
  engagementMetrics: any,
  assessmentHistory: any[]
): Promise<{
  riskLevel: 'low' | 'medium' | 'high';
  interventions: Array<{
    type: 'content' | 'support' | 'motivation' | 'pace';
    recommendation: string;
    urgency: 'immediate' | 'soon' | 'monitor';
    action: string;
  }>;
  predictedOutcome: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a predictive learning AI that identifies learners at risk and recommends interventions to improve outcomes.`,
        },
        {
          role: "user",
          content: `Analyze learning risk and recommend interventions:
Progress data: ${JSON.stringify(progressData)}
Engagement metrics: ${JSON.stringify(engagementMetrics)}
Assessment history: ${JSON.stringify(assessmentHistory)}

Return a JSON object:
{
  "riskLevel": "low|medium|high",
  "interventions": [
    {
      "type": "content|support|motivation|pace",
      "recommendation": "Specific recommendation",
      "urgency": "immediate|soon|monitor",
      "action": "Concrete action to take"
    }
  ],
  "predictedOutcome": "Prediction of future performance"
}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{"riskLevel":"low","interventions":[],"predictedOutcome":"Likely to succeed"}');
  } catch (error) {
    console.error("Error predicting intervention:", error);
    return {
      riskLevel: 'low',
      interventions: [],
      predictedOutcome: 'Unable to predict at this time',
    };
  }
}

export async function mapCompetencies(
  userId: string,
  completedCourses: Course[],
  assessmentResults: Assessment[],
  targetRole?: string
): Promise<{
  competencies: Array<{
    skill: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    confidence: number;
    gaps: string[];
    nextSteps: string[];
  }>;
  overallReadiness: number;
  recommendations: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a competency mapping AI that analyzes skills and identifies gaps for career development.`,
        },
        {
          role: "user",
          content: `Map competencies for user:
Completed courses: ${JSON.stringify(completedCourses.map(c => ({ title: c.title, category: c.category })))}
Assessment results: ${JSON.stringify(assessmentResults.map(a => ({ title: a.title, score: a.score })))}
Target role: ${targetRole || 'General skill development'}

Return a JSON object:
{
  "competencies": [
    {
      "skill": "Skill name",
      "level": "beginner|intermediate|advanced|expert",
      "confidence": 0.0-1.0,
      "gaps": ["gap1", "gap2"],
      "nextSteps": ["step1", "step2"]
    }
  ],
  "overallReadiness": 0.0-1.0,
  "recommendations": ["recommendation1", "recommendation2"]
}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{"competencies":[],"overallReadiness":0,"recommendations":[]}');
  } catch (error) {
    console.error("Error mapping competencies:", error);
    return {
      competencies: [],
      overallReadiness: 0,
      recommendations: [],
    };
  }
}
