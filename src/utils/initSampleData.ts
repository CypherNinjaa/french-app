import { supabase } from "../lib/supabase";

// Sample data for testing Phase 3 implementation
export const sampleModules = [
	{
		id: "550e8400-e29b-41d4-a716-446655440001",
		title: "French Basics",
		description:
			"Start your French journey with essential greetings, introductions, and basic vocabulary.",
		level: "beginner" as const,
		order_index: 1,
		total_lessons: 3,
		estimated_duration_minutes: 50,
		is_premium: false,
		is_published: true,
		pass_threshold: 65,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440002",
		title: "Numbers and Time",
		description: "Learn to count, tell time, and express dates in French.",
		level: "beginner" as const,
		order_index: 2,
		total_lessons: 4,
		estimated_duration_minutes: 60,
		is_premium: false,
		is_published: true,
		pass_threshold: 65,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440003",
		title: "Family and Relationships",
		description: "Describe family members and talk about relationships.",
		level: "beginner" as const,
		order_index: 3,
		total_lessons: 5,
		estimated_duration_minutes: 75,
		is_premium: false,
		is_published: true,
		pass_threshold: 70,
	},
];

export const sampleLessons = [
	{
		id: "660e8400-e29b-41d4-a716-446655440001",
		module_id: "550e8400-e29b-41d4-a716-446655440001",
		title: "Greetings and Introductions",
		description: "Learn basic French greetings and how to introduce yourself.",
		content: `# Greetings and Introductions

## Basic Greetings
**Bonjour** - Hello (formal/daytime)
**Bonsoir** - Good evening
**Salut** - Hi/Bye (informal)

## Introductions
**Je m'appelle...** - My name is...
**Je suis...** - I am...
**Enchanté(e)** - Nice to meet you

## Practice
Try introducing yourself using these phrases!`,
		lesson_type: "conversation" as const,
		order_index: 1,
		estimated_duration_minutes: 15,
		key_phrases: ["Bonjour", "Je m'appelle", "Enchanté"],
		is_published: true,
	},
	{
		id: "660e8400-e29b-41d4-a716-446655440002",
		module_id: "550e8400-e29b-41d4-a716-446655440001",
		title: "Common Phrases",
		description: "Essential everyday French phrases for beginners.",
		content: `# Common Phrases

## Politeness
**S'il vous plaît** - Please (formal)
**Merci** - Thank you
**De rien** - You're welcome
**Excusez-moi** - Excuse me

## Questions
**Comment allez-vous?** - How are you? (formal)
**Ça va?** - How are you? (informal)
**Où est...?** - Where is...?`,
		lesson_type: "conversation" as const,
		order_index: 2,
		estimated_duration_minutes: 15,
		key_phrases: ["S'il vous plaît", "Merci", "Comment allez-vous"],
		is_published: true,
	},
	{
		id: "660e8400-e29b-41d4-a716-446655440003",
		module_id: "550e8400-e29b-41d4-a716-446655440001",
		title: "Basic Vocabulary",
		description: "Learn essential French words for daily use.",
		content: `# Basic Vocabulary

## Colors
- Rouge (red)
- Bleu (blue)
- Vert (green)

## Days of the Week
- Lundi (Monday)
- Mardi (Tuesday)
- Mercredi (Wednesday)`,
		lesson_type: "vocabulary" as const,
		order_index: 3,
		estimated_duration_minutes: 20,
		key_phrases: ["Rouge", "Bleu", "Lundi"],
		is_published: true,
	},
];

export async function initializeSampleData() {
	try {
		console.log("🌟 Initializing sample data for Phase 3...");

		// Insert sample modules
		console.log("📚 Inserting modules...");
		const { error: modulesError } = await supabase
			.from("modules")
			.upsert(sampleModules, { onConflict: "id" });

		if (modulesError) {
			console.error("Error inserting modules:", modulesError);
			throw modulesError;
		}

		// Insert sample lessons
		console.log("📖 Inserting lessons...");
		const { error: lessonsError } = await supabase
			.from("lessons")
			.upsert(sampleLessons, { onConflict: "id" });

		if (lessonsError) {
			console.error("Error inserting lessons:", lessonsError);
			throw lessonsError;
		}

		console.log("✅ Sample data initialized successfully!");
		return { success: true };
	} catch (error) {
		console.error("❌ Failed to initialize sample data:", error);
		return { success: false, error };
	}
}

// Initialize user progress for the first module (unlocked by default)
export async function initializeUserProgress(userId: string) {
	try {
		console.log("👤 Initializing user progress...");

		const { error } = await supabase.from("user_progress").upsert(
			{
				user_id: userId,
				module_id: "550e8400-e29b-41d4-a716-446655440001",
				status: "unlocked",
				progress_percentage: 0,
				completed_lessons: 0,
				total_lessons: 3,
			},
			{ onConflict: "user_id,module_id" }
		);

		if (error) {
			console.error("Error initializing user progress:", error);
			throw error;
		}

		console.log("✅ User progress initialized!");
		return { success: true };
	} catch (error) {
		console.error("❌ Failed to initialize user progress:", error);
		return { success: false, error };
	}
}
