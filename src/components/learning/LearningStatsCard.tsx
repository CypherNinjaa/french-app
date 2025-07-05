import { motion } from "framer-motion";
import type { LearningStats } from "@/types";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Target, Clock, Award, Zap, TrendingUp } from "lucide-react";

interface LearningStatsCardProps {
	stats: LearningStats;
}

export function LearningStatsCard({ stats }: LearningStatsCardProps) {
	const getLevelInfo = () => {
		switch (stats.level) {
			case "beginner":
				return {
					color: "text-green-600",
					bg: "bg-green-100 dark:bg-green-900/20",
					next: "Complete 5 modules to reach Intermediate",
				};
			case "intermediate":
				return {
					color: "text-yellow-600",
					bg: "bg-yellow-100 dark:bg-yellow-900/20",
					next: "Complete 10 modules to reach Advanced",
				};
			case "advanced":
				return {
					color: "text-red-600",
					bg: "bg-red-100 dark:bg-red-900/20",
					next: "You've mastered French! Keep practicing!",
				};
			default:
				return {
					color: "text-muted-foreground",
					bg: "bg-secondary",
					next: "Start your first module",
				};
		}
	};

	const levelInfo = getLevelInfo();

	return (
		<Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-white">
					<TrendingUp className="w-5 h-5" />
					Your Learning Progress
				</CardTitle>
				<CardDescription className="text-indigo-100">
					Track your French learning journey
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{/* Level Badge */}
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.1 }}
						className="col-span-full lg:col-span-1"
					>
						<div className="text-center p-4 bg-white/20 rounded-lg backdrop-blur-sm">
							<Award className="w-8 h-8 mx-auto mb-2" />
							<h3 className="font-semibold text-lg capitalize">
								{stats.level}
							</h3>
							<p className="text-sm text-indigo-100 mt-1">{levelInfo.next}</p>
						</div>
					</motion.div>

					{/* Stats Grid */}
					<div className="col-span-full lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.2 }}
							className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm"
						>
							<BookOpen className="w-6 h-6 mx-auto mb-2" />
							<div className="text-2xl font-bold">
								{stats.totalModulesCompleted}
							</div>
							<div className="text-sm text-indigo-100">Modules Completed</div>
						</motion.div>

						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.3 }}
							className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm"
						>
							<Target className="w-6 h-6 mx-auto mb-2" />
							<div className="text-2xl font-bold">
								{stats.vocabularyMastered}
							</div>
							<div className="text-sm text-indigo-100">Words Mastered</div>
						</motion.div>

						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.4 }}
							className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm"
						>
							<Zap className="w-6 h-6 mx-auto mb-2" />
							<div className="text-2xl font-bold">{stats.xpPoints}</div>
							<div className="text-sm text-indigo-100">XP Points</div>
						</motion.div>
					</div>
				</div>

				{/* Additional Stats */}
				{stats.averageTestScore > 0 && (
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.5 }}
						className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm"
					>
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-indigo-100">
								Average Test Score
							</span>
							<span className="font-semibold">
								{Math.round(stats.averageTestScore)}%
							</span>
						</div>
						<Progress
							value={stats.averageTestScore}
							className="h-2 bg-white/20"
						/>
					</motion.div>
				)}

				{stats.currentStreak > 0 && (
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.6 }}
						className="mt-4 flex items-center justify-center gap-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm"
					>
						<Clock className="w-5 h-5" />
						<span className="font-semibold">
							{stats.currentStreak} day learning streak!
						</span>
					</motion.div>
				)}
			</CardContent>
		</Card>
	);
}
