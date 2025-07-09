import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

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
