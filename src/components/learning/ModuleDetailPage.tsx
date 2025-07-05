import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useModules, useUserProgress } from "@/hooks/useModules";
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
import {
	BookOpen,
	Clock,
	ArrowLeft,
	Play,
	CheckCircle,
	Lock,
	Target,
	Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ModuleDetailPage() {
	const { moduleId } = useParams<{ moduleId: string }>();
	const navigate = useNavigate();
	const { data: modules, isLoading: modulesLoading } = useModules();
	const { data: userProgress, isLoading: progressLoading } = useUserProgress();

	const module = modules?.find((m) => m.id === moduleId);
	const progress = userProgress?.find((p) => p.module_id === moduleId);

	const isLoading = modulesLoading || progressLoading;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-center"
				>
					<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading module details...</p>
				</motion.div>
			</div>
		);
	}

	if (!module) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center"
				>
					<h2 className="text-2xl font-semibold mb-2">Module not found</h2>
					<p className="text-muted-foreground mb-6">
						The requested module could not be found.
					</p>
					<Button onClick={() => navigate("/learn")}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Dashboard
					</Button>
				</motion.div>
			</div>
		);
	}

	const getLevelColor = () => {
		switch (module.level) {
			case "beginner":
				return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20";
			case "intermediate":
				return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20";
			case "advanced":
				return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20";
			default:
				return "text-muted-foreground bg-muted";
		}
	};

	const progressPercentage = progress?.progress_percentage || 0;
	const completedLessons = progress?.completed_lessons || 0;
	const isLocked = progress?.status === "locked";
	const isCompleted = progress?.status === "completed";

	// Mock lessons data - in real implementation, this would come from API
	const mockLessons = [
		{
			id: 1,
			title: "Greetings and Introductions",
			description: "Learn basic French greetings and how to introduce yourself",
			duration: 15,
			type: "conversation",
			isCompleted: completedLessons >= 1,
			isLocked: false,
		},
		{
			id: 2,
			title: "Common Phrases",
			description: "Essential everyday French phrases for beginners",
			duration: 15,
			type: "conversation",
			isCompleted: completedLessons >= 2,
			isLocked: completedLessons < 1,
		},
		{
			id: 3,
			title: "Basic Vocabulary",
			description: "Learn essential French words for daily use",
			duration: 20,
			type: "vocabulary",
			isCompleted: completedLessons >= 3,
			isLocked: completedLessons < 2,
		},
	].slice(0, module.total_lessons);

	const nextLessonIndex = mockLessons.findIndex(
		(lesson) => !lesson.isCompleted && !lesson.isLocked
	);
	const nextLesson = nextLessonIndex >= 0 ? mockLessons[nextLessonIndex] : null;

	const handleStartModule = () => {
		if (nextLesson) {
			navigate(`/learn/modules/${moduleId}/lessons/${nextLesson.id}`);
		} else if (completedLessons < module.total_lessons) {
			navigate(`/learn/modules/${moduleId}/lessons/1`);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<Button
						variant="ghost"
						onClick={() => navigate("/learn")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Dashboard
					</Button>

					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<h1 className="text-4xl font-bold text-foreground">
									{module.title}
								</h1>
								<Badge className={cn("capitalize", getLevelColor())}>
									{module.level}
								</Badge>
								{module.is_premium && (
									<Badge variant="outline" className="text-xs">
										Premium
									</Badge>
								)}
							</div>
							<p className="text-xl text-muted-foreground mb-4">
								{module.description}
							</p>

							{/* Module Stats */}
							<div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
								<div className="flex items-center gap-2">
									<BookOpen className="w-4 h-4" />
									<span>{module.total_lessons} lessons</span>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="w-4 h-4" />
									<span>{module.estimated_duration_minutes} minutes</span>
								</div>
								<div className="flex items-center gap-2">
									<Target className="w-4 h-4" />
									<span>{module.pass_threshold}% to pass</span>
								</div>
								<div className="flex items-center gap-2">
									<Users className="w-4 h-4" />
									<span>Beginner friendly</span>
								</div>
							</div>
						</div>

						{/* Action Button */}
						<div className="lg:w-64">
							<Button
								size="lg"
								onClick={handleStartModule}
								disabled={isLocked}
								className="w-full"
								variant={isCompleted ? "outline" : "default"}
							>
								{isLocked ? (
									<>
										<Lock className="w-4 h-4 mr-2" />
										Locked
									</>
								) : isCompleted ? (
									<>
										<CheckCircle className="w-4 h-4 mr-2" />
										Review Module
									</>
								) : nextLesson ? (
									<>
										<Play className="w-4 h-4 mr-2" />
										Continue Learning
									</>
								) : (
									<>
										<Play className="w-4 h-4 mr-2" />
										Start Module
									</>
								)}
							</Button>
						</div>
					</div>
				</motion.div>

				{/* Progress Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="mb-8"
				>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Target className="w-5 h-5" />
								Your Progress
							</CardTitle>
							<CardDescription>
								{isCompleted
									? "Congratulations! You've completed this module."
									: `${completedLessons} of ${module.total_lessons} lessons completed`}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Progress</span>
									<span className="font-medium">{progressPercentage}%</span>
								</div>
								<Progress value={progressPercentage} className="h-3" />
								{nextLesson && (
									<div className="text-sm text-muted-foreground">
										Next: {nextLesson.title}
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Lessons List */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h2 className="text-2xl font-semibold mb-6">Lessons</h2>
					<div className="space-y-4">
						{mockLessons.map((lesson, index) => (
							<motion.div
								key={lesson.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.1 * index }}
							>
								<Card
									className={cn(
										"transition-all duration-200 hover:shadow-md",
										lesson.isCompleted &&
											"border-green-500 bg-green-50 dark:bg-green-900/20",
										lesson.isLocked && "opacity-60",
										!lesson.isLocked &&
											!lesson.isCompleted &&
											"border-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
									)}
								>
									<CardContent className="p-6">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-4">
												<div
													className={cn(
														"w-10 h-10 rounded-full flex items-center justify-center",
														lesson.isCompleted
															? "bg-green-100 text-green-600 dark:bg-green-900/30"
															: lesson.isLocked
															? "bg-gray-100 text-gray-400"
															: "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
													)}
												>
													{lesson.isCompleted ? (
														<CheckCircle className="w-5 h-5" />
													) : lesson.isLocked ? (
														<Lock className="w-5 h-5" />
													) : (
														<span className="font-semibold">{index + 1}</span>
													)}
												</div>
												<div className="flex-1">
													<h3 className="font-semibold text-lg">
														{lesson.title}
													</h3>
													<p className="text-muted-foreground text-sm">
														{lesson.description}
													</p>
													<div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
														<span className="flex items-center gap-1">
															<Clock className="w-3 h-3" />
															{lesson.duration} min
														</span>
														<Badge variant="outline" className="text-xs">
															{lesson.type}
														</Badge>
													</div>
												</div>
											</div>
											<Button
												variant={lesson.isCompleted ? "outline" : "default"}
												disabled={lesson.isLocked}
												onClick={() =>
													navigate(
														`/learn/modules/${moduleId}/lessons/${lesson.id}`
													)
												}
											>
												{lesson.isCompleted
													? "Review"
													: lesson.isLocked
													? "Locked"
													: "Start"}
											</Button>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	);
}
