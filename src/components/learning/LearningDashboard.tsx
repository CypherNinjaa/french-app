import { motion } from "framer-motion";
import { useModulesWithProgress, useLearningStats } from "@/hooks/useModules";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Target, Zap, TrendingUp } from "lucide-react";
import { ModuleCard } from "@/components/learning/ModuleCard";
import { LearningStatsCard } from "@/components/learning/LearningStatsCard";

export function LearningDashboard() {
	const {
		data: modules,
		isLoading: modulesLoading,
		error: modulesError,
	} = useModulesWithProgress();
	const { data: stats, isLoading: statsLoading } = useLearningStats();

	if (modulesLoading || statsLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-center"
				>
					<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">
						Loading your learning dashboard...
					</p>
				</motion.div>
			</div>
		);
	}

	if (modulesError) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center"
				>
					<div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
						<TrendingUp className="w-8 h-8 text-destructive" />
					</div>
					<h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
					<p className="text-muted-foreground mb-6">
						{modulesError instanceof Error
							? modulesError.message
							: "Failed to load learning content"}
					</p>
					<Button onClick={() => window.location.reload()}>Try Again</Button>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<h1 className="text-4xl font-bold text-foreground mb-2">
						Welcome back to your French journey! 🇫🇷
					</h1>
					<p className="text-xl text-muted-foreground">
						Continue learning and master the beautiful French language
					</p>
				</motion.div>

				{/* Learning Stats */}
				{stats && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="mb-8"
					>
						<LearningStatsCard stats={stats} />
					</motion.div>
				)}

				{/* Quick Actions */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="mb-8"
				>
					<Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Zap className="w-5 h-5" />
								Quick Start
							</CardTitle>
							<CardDescription className="text-blue-100">
								Jump into learning with these popular activities
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<Button
									variant="secondary"
									className="h-auto p-4 flex-col gap-2"
								>
									<BookOpen className="w-6 h-6" />
									<span>Continue Current Lesson</span>
								</Button>
								<Button
									variant="secondary"
									className="h-auto p-4 flex-col gap-2"
								>
									<Target className="w-6 h-6" />
									<span>Practice Vocabulary</span>
								</Button>
								<Button
									variant="secondary"
									className="h-auto p-4 flex-col gap-2"
								>
									<Clock className="w-6 h-6" />
									<span>5-Minute Review</span>
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Modules Grid */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-3xl font-semibold">Learning Modules</h2>
						<Badge variant="secondary" className="text-sm">
							{modules?.filter((m) => !m.isLocked).length || 0} available
						</Badge>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{modules?.map((module, index) => (
							<motion.div
								key={module.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 * index }}
							>
								<ModuleCard module={module} />
							</motion.div>
						))}
					</div>

					{!modules?.length && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-center py-12"
						>
							<BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-2">
								No modules available
							</h3>
							<p className="text-muted-foreground">
								Learning content will be available soon. Check back later!
							</p>
						</motion.div>
					)}
				</motion.div>
			</div>
		</div>
	);
}
