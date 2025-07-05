export interface User {
	id: string;
	email: string;
	created_at: string;
	updated_at: string;
}

export interface Profile {
	id: string;
	user_id: string;
	full_name: string | null;
	learning_level: "beginner" | "intermediate" | "advanced";
	preferred_language: string;
	timezone: string | null;
	notifications_enabled: boolean;
	theme_preference: "light" | "dark" | "system";
	created_at: string;
	updated_at: string;
}

export interface Module {
	id: string;
	title: string;
	description: string;
	level: "beginner" | "intermediate" | "advanced";
	order_index: number;
	total_lessons: number;
	estimated_duration_minutes: number;
	is_premium: boolean;
	image_url: string | null;
	pass_threshold: number;
	created_at: string;
	updated_at: string;
}

export interface Lesson {
	id: string;
	module_id: string;
	title: string;
	description: string;
	content: string;
	lesson_type:
		| "conversation"
		| "grammar"
		| "vocabulary"
		| "pronunciation"
		| "culture";
	order_index: number;
	estimated_duration_minutes: number;
	audio_url: string | null;
	image_url: string | null;
	key_phrases: string[];
	created_at: string;
	updated_at: string;
}

export interface UserProgress {
	id: string;
	user_id: string;
	module_id: string;
	status: "locked" | "unlocked" | "in_progress" | "completed";
	progress_percentage: number;
	completed_lessons: number;
	total_lessons: number;
	last_accessed: string | null;
	completed_at: string | null;
	created_at: string;
	updated_at: string;
}

export interface Vocabulary {
	id: string;
	module_id: string;
	french_word: string;
	english_translation: string;
	phonetic_pronunciation: string | null;
	audio_url: string | null;
	word_type: "noun" | "verb" | "adjective" | "adverb" | "preposition" | "other";
	gender: "masculine" | "feminine" | "neutral" | null;
	example_sentence_french: string | null;
	example_sentence_english: string | null;
	difficulty_level: "beginner" | "intermediate" | "advanced";
	created_at: string;
	updated_at: string;
}

export interface UserVocabularyProgress {
	id: string;
	user_id: string;
	vocabulary_id: string;
	familiarity_level: number; // 0-5 scale
	correct_answers: number;
	total_attempts: number;
	last_reviewed: string | null;
	next_review_date: string | null;
	created_at: string;
	updated_at: string;
}

export interface Test {
	id: string;
	module_id: string;
	title: string;
	description: string;
	questions: TestQuestion[];
	time_limit_minutes: number | null;
	pass_threshold: number;
	max_attempts: number;
	created_at: string;
	updated_at: string;
}

export interface TestQuestion {
	id: string;
	question: string;
	question_type:
		| "multiple_choice"
		| "fill_in_blank"
		| "matching"
		| "true_false";
	options: string[];
	correct_answer: string | string[];
	explanation: string | null;
	points: number;
}

export interface TestResult {
	id: string;
	user_id: string;
	test_id: string;
	score: number;
	max_score: number;
	percentage: number;
	time_taken_minutes: number;
	answers: Record<string, string | string[]>;
	passed: boolean;
	completed_at: string;
	created_at: string;
}

export interface ModuleWithProgress extends Module {
	userProgress?: UserProgress;
	isLocked: boolean;
	progressPercentage: number;
	lessonsCompleted: number;
}

export interface LessonWithProgress extends Lesson {
	userProgress?: UserProgress;
	isLocked: boolean;
	isCompleted: boolean;
}

// API Response types
export interface ApiResponse<T> {
	data: T;
	error: null;
}

export interface ApiError {
	data: null;
	error: {
		message: string;
		code?: string;
		details?: string;
	};
}

// Learning Statistics
export interface LearningStats {
	totalModulesCompleted: number;
	totalLessonsCompleted: number;
	totalTimeSpent: number;
	currentStreak: number;
	vocabularyMastered: number;
	averageTestScore: number;
	level: "beginner" | "intermediate" | "advanced";
	xpPoints: number;
}
