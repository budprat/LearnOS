// Design system colors based on PRD specifications
export const colors = {
  primary: {
    DEFAULT: '#1e40af', // Deep educational blue
    light: '#3b82f6',
    dark: '#1e3a8a',
  },
  accent: {
    DEFAULT: '#f97316', // Warm accent orange
    light: '#fb923c',
    dark: '#ea580c',
  },
  success: '#10b981', // Achievement green
  warning: '#f59e0b', // Warning amber
  neutral: {
    light: '#f3f4f6',
    DEFAULT: '#6b7280',
    dark: '#374151',
  },
  background: {
    light: '#ffffff',
    dark: '#111827',
  },
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    inverse: '#f9fafb',
  },
} as const;