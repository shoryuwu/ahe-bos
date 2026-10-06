// Program types
export interface Program {
  id: string;
  title: string;
  level: string;
  description: string;
  targets: string[];
  duration: string;
  ageRange: string;
  icon: string;
  color: string;
  bgColor: string;
}

// Testimonial types
export interface Testimonial {
  id: string;
  parentName: string;
  childName: string;
  childAge: string;
  review: string;
  rating: number;
  avatar: string;
  program: string;
}

// FAQ types
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// Student types
export interface Student {
  id: string;
  name: string;
  age: number;
  level: string;
  status: 'active' | 'inactive' | 'graduated';
  parentName: string;
  enrollDate: string;
  progress: number;
  attendance: number;
}

// Progress skill types
export interface ProgressSkill {
  skill: string;
  percentage: number;
  color: string;
}

// Learning history types
export interface LearningHistory {
  id: string;
  date: string;
  material: string;
  status: 'selesai' | 'berlanjut' | 'absen';
  score?: number;
  notes?: string;
}

// Teacher note types
export interface TeacherNote {
  id: string;
  date: string;
  teacher: string;
  note: string;
  type: 'progress' | 'suggestion' | 'achievement';
}

// Schedule types
export interface Schedule {
  id: string;
  date: string;
  time: string;
  material: string;
  teacher: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

// Gallery types
export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
  date: string;
}

// Stat types
export interface Stat {
  label: string;
  value: string;
  icon: string;
  description: string;
}

// Method step types
export interface MethodStep {
  step: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// Dashboard overview types
export interface DashboardCard {
  title: string;
  value: string;
  icon: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  color: string;
}

// Score trend (for line chart)
export interface ScoreTrend {
  date: string;
  score: number;
  material: string;
}

// Vocabulary record
export interface VocabWord {
  id: string;
  word: string;
  category: 'huruf' | 'suku-kata' | 'kata' | 'kalimat';
  mastered: boolean;
  dateMastered?: string;
}

// Level milestone
export interface LevelMilestone {
  level: string;
  label: string;
  startDate?: string;
  completionDate?: string;
  estimatedCompletion?: string;
  status: 'completed' | 'active' | 'upcoming';
  progressPercent: number;
}

// Achievement / badge
export interface Achievement {
  id: string;
  badgeName: string;
  badgeIcon: string;
  category: 'kehadiran' | 'nilai' | 'milestone' | 'kosakata' | 'semangat';
  description: string;
  earnedAt: string;
  color: string;
}

// Mood entry per session
export interface MoodEntry {
  date: string;
  score: 1 | 2 | 3 | 4 | 5;
  material: string;
}

// Weekly summary card
export interface WeeklySummary {
  weekLabel: string;
  weekStart: string;
  weekEnd: string;
  sessionsAttended: number;
  sessionsTotal: number;
  avgScore: number | null;
  avgMood: number | null;
  highlights: string[];
  newWordsLearned: number;
}
