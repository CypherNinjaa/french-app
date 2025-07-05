import { motion } from "framer-motion";
import type { ModuleWithProgress } from "@/types";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Lock, CheckCircle, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
	module: ModuleWithProgress;
}

export function ModuleCard({ module }: ModuleCardProps) {
	const getStatusBadge = () => {
		if (module.isLocked) {
			return (
				<Badge variant="secondary" className="gap-1">
					<Lock className="w-3 h-3" /> Locked
				</Badge>
			);
		}
		if (module.progressPercentage === 100) {
			return (
				<Badge variant="success" className="gap-1">
					<CheckCircle className="w-3 h-3" /> Completed
				</Badge>
			);
		}
		if (module.progressPercentage > 0) {
			return (
				<Badge variant="warning" className="gap-1">
					<PlayCircle className="w-3 h-3" /> In Progress
				</Badge>
			);
		}
		return (
			<Badge variant="outline" className="gap-1">
				<BookOpen className="w-3 h-3" /> Available
			</Badge>
		);
	};

	const getLevelColor = () => {
		switch (module.level) {
			case "beginner":
				return "text-green-600 dark:text-green-400";
			case "intermediate":
				return "text-yellow-600 dark:text-yellow-400";
			case "advanced":
				return "text-red-600 dark:text-red-400";
			default:
				return "text-muted-foreground";
		}
	};

	return (
		<motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
			<Card
				className={cn(
					"h-full transition-all duration-200 hover:shadow-lg",
					module.isLocked && "opacity-60",
					module.progressPercentage === 100 &&
						"border-green-500 bg-green-50 dark:bg-green-900/20",
					module.progressPercentage > 0 &&
						module.progressPercentage < 100 &&
						"border-blue-500 bg-blue-50 dark:bg-blue-900/20"
				)}
			>
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<CardTitle className="text-lg mb-1">{module.title}</CardTitle>
							<CardDescription className="text-sm">
								{module.description}
							</CardDescription>
						</div>
						{getStatusBadge()}
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Progress */}
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Progress</span>
							<span className="font-medium">{module.progressPercentage}%</span>
						</div>
						<Progress value={module.progressPercentage} className="h-2" />
					</div>

					{/* Module Info */}
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div className="flex items-center gap-2">
							<BookOpen className="w-4 h-4 text-muted-foreground" />
							<span>{module.total_lessons} lessons</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4 text-muted-foreground" />
							<span>{module.estimated_duration_minutes}m</span>
						</div>
					</div>

					{/* Level */}
					<div className="flex items-center justify-between">
						<span
							className={cn("text-sm font-medium capitalize", getLevelColor())}
						>
							{module.level}
						</span>
						{module.is_premium && (
							<Badge variant="outline" className="text-xs">
								Premium
							</Badge>
						)}
					</div>

					{/* Action Button */}
					<Button
						className="w-full"
						disabled={module.isLocked}
						variant={module.progressPercentage === 100 ? "outline" : "default"}
					>
						{module.isLocked
							? "Locked"
							: module.progressPercentage === 100
							? "Review Module"
							: module.progressPercentage > 0
							? "Continue Learning"
							: "Start Module"}
					</Button>
				</CardContent>
			</Card>
		</motion.div>
	);
}
