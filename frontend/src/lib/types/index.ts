export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalityProfile {
  id: string;
  userId: string;
  // Big Five personality traits (0-100 scale)
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  // Behavioral metrics
  confidenceLevel: number;
  empathyScore: number;
  humorStyle?: string;
  leadershipStyle?: string;
  // Analysis data
  communicationPattern?: any;
  analysisData?: any;
  completionScore: number;
  lastAnalyzed: string;
  createdAt: string;
  updatedAt: string;
}

// Trait Types
export enum TraitCategory {
  CONFIDENCE = 'CONFIDENCE',
  COMMUNICATION = 'COMMUNICATION',
  LEADERSHIP = 'LEADERSHIP',
  CREATIVITY = 'CREATIVITY',
  EMPATHY = 'EMPATHY',
  HUMOR = 'HUMOR',
  ASSERTIVENESS = 'ASSERTIVENESS',
  CHARISMA = 'CHARISMA',
  PATIENCE = 'PATIENCE',
  NEGOTIATION = 'NEGOTIATION',
  PUBLIC_SPEAKING = 'PUBLIC_SPEAKING',
  OTHER = 'OTHER'
}

export interface PersonalityTrait {
  id: string;
  ownerId: string;
  owner?: User;
  name: string;
  description: string;
  category: TraitCategory;
  hourlyRate: number;
  dailyRate?: number;
  weeklyRate?: number;
  available: boolean;
  maxUsers: number;
  successRate: number;
  totalRentals: number;
  averageRating: number;
  verified: boolean;
  verificationData?: any;
  createdAt: string;
  updatedAt: string;
}

// Rental Types
export enum RentalStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface TraitRental {
  id: string;
  renterId: string;
  providerId: string;
  traitId: string;
  renter?: User;
  provider?: User;
  trait?: PersonalityTrait;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: RentalStatus;
  successMetrics?: any;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

// Coaching Types
export enum SessionType {
  AI_COACHING = 'AI_COACHING',
  PRACTICE = 'PRACTICE',
  REAL_TIME = 'REAL_TIME'
}

export interface CoachingSession {
  id: string;
  userId: string;
  rentalId?: string;
  sessionType: SessionType;
  scenario?: string;
  durationMinutes?: number;
  confidenceScore?: number;
  authenticityScore?: number;
  improvementMetrics?: any;
  aiFeedback?: string;
  coachingPrompts?: any;
  startedAt: string;
  endedAt?: string;
  createdAt: string;
}

// Review Types
export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  traitId?: string;
  rentalId?: string;
  reviewer?: User;
  reviewee?: User;
  trait?: PersonalityTrait;
  rating: number;
  title?: string;
  content?: string;
  verified: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface UserAnalytics {
  id: string;
  userId: string;
  totalSessions: number;
  totalHoursCoached: number;
  traitsTried: number;
  averageConfidenceImprovement: number;
  successRate: number;
  streakDays: number;
  lastActive?: string;
  personalityGrowthData?: any;
  milestoneAchievements?: any;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Component Props Types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Form Types
export interface TraitFormData {
  name: string;
  description: string;
  category: TraitCategory;
  hourlyRate: number;
  dailyRate?: number;
  weeklyRate?: number;
  maxUsers: number;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: File;
}

// Filter & Search Types
export interface TraitFilters {
  category?: TraitCategory;
  minRating?: number;
  maxHourlyRate?: number;
  verified?: boolean;
  available?: boolean;
  search?: string;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
  label: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  autoClose?: boolean;
  duration?: number;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalTraitsOffered: number;
  totalTraitsRented: number;
  totalEarnings: number;
  totalSpent: number;
  averageRating: number;
  activeRentals: number;
  completedSessions: number;
  improvementScore: number;
}

// Chat/Coaching Types
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  type?: 'text' | 'suggestion' | 'feedback';
  metadata?: any;
}

export interface CoachingPrompt {
  id: string;
  scenario: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: TraitCategory;
  expectedOutcome: string;
}

// Utility Types
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];