import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { modulesService } from "@/services/modulesService";
import type { UserProgress } from "@/types";
import { useAuth } from "@/hooks/useAuth";

export const QUERY_KEYS = {
	modules: ["modules"] as const,
	userProgress: (userId: string) => ["userProgress", userId] as const,
	modulesWithProgress: (userId: string) =>
		["modulesWithProgress", userId] as const,
	learningStats: (userId: string) => ["learningStats", userId] as const,
} as const;

export function useModules() {
	return useQuery({
		queryKey: QUERY_KEYS.modules,
		queryFn: modulesService.getModules,
	});
}

export function useUserProgress() {
	const { user } = useAuth();

	return useQuery({
		queryKey: QUERY_KEYS.userProgress(user?.id || ""),
		queryFn: () => modulesService.getUserProgress(user?.id || ""),
		enabled: !!user?.id,
	});
}

export function useModulesWithProgress() {
	const { user } = useAuth();

	return useQuery({
		queryKey: QUERY_KEYS.modulesWithProgress(user?.id || ""),
		queryFn: () => modulesService.getModulesWithProgress(user?.id || ""),
		enabled: !!user?.id,
		staleTime: 2 * 60 * 1000, // 2 minutes
	});
}

export function useLearningStats() {
	const { user } = useAuth();

	return useQuery({
		queryKey: QUERY_KEYS.learningStats(user?.id || ""),
		queryFn: () => modulesService.getLearningStats(user?.id || ""),
		enabled: !!user?.id,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

export function useUpdateUserProgress() {
	const queryClient = useQueryClient();
	const { user } = useAuth();

	return useMutation({
		mutationFn: modulesService.updateUserProgress,
		onSuccess: (data) => {
			// Invalidate relevant queries
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.userProgress(user?.id || ""),
			});
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.modulesWithProgress(user?.id || ""),
			});
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.learningStats(user?.id || ""),
			});

			// Optimistically update the cache
			if (user?.id) {
				queryClient.setQueryData<UserProgress[]>(
					QUERY_KEYS.userProgress(user.id),
					(old) => {
						if (!old) return [data];
						const index = old.findIndex((p) => p.id === data.id);
						if (index >= 0) {
							const newData = [...old];
							newData[index] = data;
							return newData;
						}
						return [...old, data];
					}
				);
			}
		},
		onError: (error) => {
			console.error("Failed to update user progress:", error);
			// Could show a toast notification here
		},
	});
}
