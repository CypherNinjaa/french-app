import { supabase } from "@/lib/supabase";
import type {
	Module,
	UserProgress,
	ModuleWithProgress,
	LearningStats,
} from "@/types";

export interface ModulesService {
	getModules: () => Promise<Module[]>;
	getUserProgress: (userId: string) => Promise<UserProgress[]>;
	getModulesWithProgress: (userId: string) => Promise<ModuleWithProgress[]>;
	updateUserProgress: (
		progress: Partial<UserProgress>
	) => Promise<UserProgress>;
	getLearningStats: (userId: string) => Promise<LearningStats>;
}

class ModulesServiceImpl implements ModulesService {
	async getModules(): Promise<Module[]> {
		const { data, error } = await supabase
			.from("modules")
			.select("*")
			.order("order_index");

		if (error) {
			throw new Error(`Failed to fetch modules: ${error.message}`);
		}

		return data || [];
	}

	async getUserProgress(userId: string): Promise<UserProgress[]> {
		const { data, error } = await supabase
			.from("user_progress")
			.select("*")
			.eq("user_id", userId);

		if (error) {
			throw new Error(`Failed to fetch user progress: ${error.message}`);
		}

		return data || [];
	}

	async getModulesWithProgress(userId: string): Promise<ModuleWithProgress[]> {
		try {
			const [modules, userProgress] = await Promise.all([
				this.getModules(),
				this.getUserProgress(userId),
			]);

			const progressMap = new Map(userProgress.map((p) => [p.module_id, p]));

			return modules.map((module, index) => {
				const progress = progressMap.get(module.id);
				const previousModuleCompleted =
					index === 0 ||
					progressMap.get(modules[index - 1].id)?.status === "completed";

				return {
					...module,
					userProgress: progress,
					isLocked:
						!previousModuleCompleted && progress?.status !== "completed",
					progressPercentage: progress?.progress_percentage || 0,
					lessonsCompleted:
						progress?.status === "completed" ? module.total_lessons : 0,
				};
			});
		} catch (error) {
			throw new Error(
				`Failed to fetch modules with progress: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	async updateUserProgress(
		progress: Partial<UserProgress>
	): Promise<UserProgress> {
		const { data, error } = await supabase
			.from("user_progress")
			.upsert({
				...progress,
				updated_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to update user progress: ${error.message}`);
		}

		return data;
	}

	async getLearningStats(userId: string): Promise<LearningStats> {
		try {
			// Get completed modules count
			const { data: moduleProgress } = await supabase
				.from("user_progress")
				.select("*")
				.eq("user_id", userId)
				.eq("status", "completed");

			// Get test results for average score
			const { data: testResults } = await supabase
				.from("test_results")
				.select("percentage")
				.eq("user_id", userId);

			// Get vocabulary progress
			const { data: vocabProgress } = await supabase
				.from("user_vocabulary_progress")
				.select("familiarity_level")
				.eq("user_id", userId)
				.gte("familiarity_level", 4); // Consider mastered if familiarity >= 4

			const totalModulesCompleted = moduleProgress?.length || 0;
			const totalLessonsCompleted = moduleProgress?.length || 0; // Simplified for now
			const averageTestScore = testResults?.length
				? testResults.reduce((sum, result) => sum + result.percentage, 0) /
				  testResults.length
				: 0;
			const vocabularyMastered = vocabProgress?.length || 0;

			return {
				totalModulesCompleted,
				totalLessonsCompleted,
				totalTimeSpent: 0, // Will implement time tracking later
				currentStreak: 0, // Will implement streak calculation later
				vocabularyMastered,
				averageTestScore,
				level:
					totalModulesCompleted >= 10
						? "advanced"
						: totalModulesCompleted >= 5
						? "intermediate"
						: "beginner",
				xpPoints: totalModulesCompleted * 100 + vocabularyMastered * 10,
			};
		} catch (error) {
			throw new Error(
				`Failed to fetch learning stats: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}
}

export const modulesService = new ModulesServiceImpl();
