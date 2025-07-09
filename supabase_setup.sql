-- Create all necessary tables for the AI Learning Platform
-- This script should be run in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    learning_streak INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    level_id INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    difficulty VARCHAR CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration INTEGER, -- in minutes
    image_url VARCHAR,
    category VARCHAR,
    skills JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description TEXT,
    content TEXT,
    video_url VARCHAR,
    duration INTEGER, -- in minutes
    difficulty VARCHAR CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    topics JSONB,
    prerequisites JSONB,
    learning_objectives JSONB,
    interactive_elements JSONB,
    assessments JSONB,
    resources JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning paths table
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description TEXT,
    lessons JSONB, -- Array of lesson IDs
    progress INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User courses table
CREATE TABLE IF NOT EXISTS public.user_courses (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Lesson progress table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in minutes
    completed_sections JSONB,
    last_position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Lesson notes table
CREATE TABLE IF NOT EXISTS public.lesson_notes (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    highlighted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lesson bookmarks table
CREATE TABLE IF NOT EXISTS public.lesson_bookmarks (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id, position)
);

-- Assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 100,
    time_spent INTEGER DEFAULT 0,
    answers JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lesson assessment results table
CREATE TABLE IF NOT EXISTS public.lesson_assessment_results (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    assessment_id INTEGER,
    score INTEGER DEFAULT 0,
    answers JSONB,
    time_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study groups table
CREATE TABLE IF NOT EXISTS public.study_groups (
    id SERIAL PRIMARY KEY,
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT true,
    max_members INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study group members table
CREATE TABLE IF NOT EXISTS public.study_group_members (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- AI tutor sessions table
CREATE TABLE IF NOT EXISTS public.ai_tutor_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    messages JSONB,
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations table
CREATE TABLE IF NOT EXISTS public.recommendations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    type VARCHAR NOT NULL,
    priority INTEGER DEFAULT 1,
    viewed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses are public for reading
CREATE POLICY "Courses are viewable by everyone" ON courses FOR SELECT USING (true);

-- Lessons are public for reading
CREATE POLICY "Lessons are viewable by everyone" ON lessons FOR SELECT USING (true);

-- Learning paths are private to users
CREATE POLICY "Users can manage own learning paths" ON learning_paths FOR ALL USING (auth.uid() = user_id);

-- User courses are private to users
CREATE POLICY "Users can manage own course enrollments" ON user_courses FOR ALL USING (auth.uid() = user_id);

-- Lesson progress is private to users
CREATE POLICY "Users can manage own lesson progress" ON lesson_progress FOR ALL USING (auth.uid() = user_id);

-- Lesson notes are private to users
CREATE POLICY "Users can manage own lesson notes" ON lesson_notes FOR ALL USING (auth.uid() = user_id);

-- Lesson bookmarks are private to users
CREATE POLICY "Users can manage own lesson bookmarks" ON lesson_bookmarks FOR ALL USING (auth.uid() = user_id);

-- Assessments are private to users
CREATE POLICY "Users can manage own assessments" ON assessments FOR ALL USING (auth.uid() = user_id);

-- Lesson assessment results are private to users
CREATE POLICY "Users can manage own lesson assessment results" ON lesson_assessment_results FOR ALL USING (auth.uid() = user_id);

-- Study groups are viewable by everyone, but only creators can update
CREATE POLICY "Study groups are viewable by everyone" ON study_groups FOR SELECT USING (true);
CREATE POLICY "Users can create study groups" ON study_groups FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update own study groups" ON study_groups FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete own study groups" ON study_groups FOR DELETE USING (auth.uid() = creator_id);

-- Study group members can be managed by group creators or members themselves
CREATE POLICY "Study group members are viewable by everyone" ON study_group_members FOR SELECT USING (true);
CREATE POLICY "Users can join study groups" ON study_group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave study groups" ON study_group_members FOR DELETE USING (auth.uid() = user_id);

-- AI tutor sessions are private to users
CREATE POLICY "Users can manage own AI tutor sessions" ON ai_tutor_sessions FOR ALL USING (auth.uid() = user_id);

-- Recommendations are private to users
CREATE POLICY "Users can manage own recommendations" ON recommendations FOR ALL USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample data
INSERT INTO courses (title, description, difficulty, duration, category, skills) VALUES
('JavaScript Fundamentals', 'Learn the basics of JavaScript programming', 'beginner', 180, 'Programming', '["variables", "functions", "loops", "objects"]'),
('React Development', 'Build modern web applications with React', 'intermediate', 300, 'Web Development', '["react", "jsx", "hooks", "components"]'),
('Python for Data Science', 'Use Python for data analysis and visualization', 'intermediate', 240, 'Data Science', '["python", "pandas", "numpy", "matplotlib"]'),
('Machine Learning Basics', 'Introduction to machine learning concepts', 'advanced', 360, 'AI/ML', '["ml", "algorithms", "statistics", "python"]');

INSERT INTO lessons (course_id, title, description, content, duration, difficulty, topics, learning_objectives) VALUES
(1, 'Variables and Data Types', 'Learn about JavaScript variables and data types', 'JavaScript variables store data that can be used throughout your program...', 25, 'beginner', '["variables", "data-types", "let", "const"]', '["Understand variable declaration", "Learn different data types", "Practice variable assignment"]'),
(1, 'Functions and Scope', 'Understanding functions and variable scope', 'Functions are reusable blocks of code that perform specific tasks...', 30, 'beginner', '["functions", "scope", "parameters", "return"]', '["Create and call functions", "Understand scope", "Use parameters and return values"]'),
(2, 'Introduction to React', 'Getting started with React framework', 'React is a JavaScript library for building user interfaces...', 35, 'intermediate', '["react", "jsx", "components", "setup"]', '["Set up React environment", "Create first component", "Understand JSX syntax"]'),
(2, 'React Hooks', 'Modern React with hooks', 'Hooks allow you to use state and other React features in functional components...', 40, 'intermediate', '["hooks", "useState", "useEffect", "custom-hooks"]', '["Use useState hook", "Implement useEffect", "Create custom hooks"]');