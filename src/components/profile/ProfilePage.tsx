import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
	User,
	Settings,
	BookOpen,
	Edit2,
	Save,
	X,
	Mail,
	Calendar,
	Target,
} from "lucide-react";
import type { Profile } from "../../lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfilePage() {
	const { user, profile, updateProfile, loading } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState({
		full_name: profile?.full_name || "",
		learning_level: profile?.learning_level || "beginner",
		preferences: {
			notifications: profile?.preferences?.notifications ?? true,
			theme: profile?.preferences?.theme || "light",
			language: profile?.preferences?.language || "en",
		},
	});

	const handleSave = async () => {
		try {
			await updateProfile(editForm as Partial<Profile>);
			setIsEditing(false);
		} catch {
			// Error handled by AuthContext
		}
	};

	const handleCancel = () => {
		setEditForm({
			full_name: profile?.full_name || "",
			learning_level: profile?.learning_level || "beginner",
			preferences: {
				notifications: profile?.preferences?.notifications ?? true,
				theme: profile?.preferences?.theme || "light",
				language: profile?.preferences?.language || "en",
			},
		});
		setIsEditing(false);
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	const getLevelColor = (level: string) => {
		switch (level) {
			case "beginner":
				return "bg-green-100 text-green-800 border-green-200";
			case "intermediate":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "advanced":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	if (!user || !profile) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<Card className="w-96">
					<CardContent className="pt-6">
						<div className="flex flex-col items-center space-y-4">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
							<p className="text-sm text-muted-foreground">
								Loading your profile...
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-[calc(100vh-4rem)]">
			{/* Main Content */}
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column - Profile Info */}
					<div className="lg:col-span-2 space-y-6">
						{/* Profile Card */}
						<Card className="relative overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
							<CardContent className="relative pt-16 pb-6">
								<div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
									<Avatar className="w-24 h-24 border-4 border-white shadow-lg">
										<AvatarImage src={user.user_metadata?.avatar_url} />
										<AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold">
											{getInitials(profile.full_name || user.email || "U")}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 space-y-2">
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
											<div>
												<h2 className="text-2xl font-bold text-gray-900">
													{profile.full_name || "Welcome!"}
												</h2>
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<Mail className="w-4 h-4" />
													{user.email}
												</div>
											</div>
											<Button
												variant={isEditing ? "outline" : "default"}
												onClick={() => setIsEditing(!isEditing)}
												disabled={loading}
												className="gap-2 shrink-0"
											>
												{isEditing ? (
													<>
														<X className="w-4 h-4" />
														Cancel
													</>
												) : (
													<>
														<Edit2 className="w-4 h-4" />
														Edit Profile
													</>
												)}
											</Button>
										</div>
										<div className="flex flex-wrap items-center gap-3">
											<Badge
												variant="secondary"
												className={getLevelColor(profile.learning_level)}
											>
												<Target className="w-3 h-3 mr-1" />
												{profile.learning_level.charAt(0).toUpperCase() +
													profile.learning_level.slice(1)}
											</Badge>
											<div className="flex items-center gap-1 text-sm text-muted-foreground">
												<Calendar className="w-4 h-4" />
												Joined{" "}
												{new Date(profile.created_at).toLocaleDateString(
													"en-US",
													{
														month: "long",
														year: "numeric",
													}
												)}
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Edit Form */}
						{isEditing ? (
							<Card className="mt-6">
								<CardContent className="pt-6">
									<div className="space-y-6">
										<div className="space-y-2">
											<Label htmlFor="fullName" className="text-sm font-medium">
												Full Name
											</Label>
											<Input
												id="fullName"
												value={editForm.full_name}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setEditForm((prev) => ({
														...prev,
														full_name: e.target.value,
													}))
												}
												placeholder="Enter your full name"
												className="w-full"
											/>
										</div>

										<div className="space-y-2">
											<Label
												htmlFor="learningLevel"
												className="text-sm font-medium"
											>
												Learning Level
											</Label>
											<Select
												value={editForm.learning_level}
												onValueChange={(value: string) =>
													setEditForm((prev) => ({
														...prev,
														learning_level: value as
															| "beginner"
															| "intermediate"
															| "advanced",
													}))
												}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="beginner">🌱 Beginner</SelectItem>
													<SelectItem value="intermediate">
														🚀 Intermediate
													</SelectItem>
													<SelectItem value="advanced">⭐ Advanced</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<Separator />

										<div className="space-y-4">
											<h3 className="text-lg font-semibold">Preferences</h3>

											<div className="flex items-center justify-between">
												<div className="space-y-0.5">
													<Label className="text-sm font-medium">
														Email Notifications
													</Label>
													<p className="text-xs text-muted-foreground">
														Receive updates about your learning progress
													</p>
												</div>
												<Switch
													checked={editForm.preferences.notifications}
													onCheckedChange={(checked: boolean) =>
														setEditForm((prev) => ({
															...prev,
															preferences: {
																...prev.preferences,
																notifications: checked,
															},
														}))
													}
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="theme" className="text-sm font-medium">
													Theme
												</Label>
												<Select
													value={editForm.preferences.theme}
													onValueChange={(value: string) =>
														setEditForm((prev) => ({
															...prev,
															preferences: {
																...prev.preferences,
																theme: value as "light" | "dark",
															},
														}))
													}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="light">☀️ Light</SelectItem>
														<SelectItem value="dark">🌙 Dark</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>

										<div className="flex justify-end gap-3 pt-4">
											<Button
												variant="outline"
												onClick={handleCancel}
												disabled={loading}
											>
												Cancel
											</Button>
											<Button
												onClick={handleSave}
												disabled={loading}
												className="gap-2"
											>
												<Save className="w-4 h-4" />
												{loading ? "Saving..." : "Save Changes"}
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						) : null}
					</div>

					{/* Right Column - Stats */}
					<div className="space-y-6">
						{/* Quick Stats */}
						<Card>
							<CardContent className="p-6">
								<h3 className="text-lg font-semibold mb-4">
									Learning Progress
								</h3>
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
												<BookOpen className="w-5 h-5 text-blue-600" />
											</div>
											<div>
												<p className="font-medium text-sm">Lessons</p>
												<p className="text-xs text-muted-foreground">
													Completed
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-2xl font-bold text-blue-600">0</p>
											<p className="text-xs text-muted-foreground">Total</p>
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
												<Settings className="w-5 h-5 text-green-600" />
											</div>
											<div>
												<p className="font-medium text-sm">Vocabulary</p>
												<p className="text-xs text-muted-foreground">
													Words learned
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-2xl font-bold text-green-600">0</p>
											<p className="text-xs text-muted-foreground">Words</p>
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
												<Target className="w-5 h-5 text-orange-600" />
											</div>
											<div>
												<p className="font-medium text-sm">Streak</p>
												<p className="text-xs text-muted-foreground">
													Days in a row
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-2xl font-bold text-orange-600">0</p>
											<p className="text-xs text-muted-foreground">Days</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Quick Actions */}
						<Card>
							<CardContent className="p-6">
								<h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
								<div className="space-y-3">
									<Button
										variant="outline"
										className="w-full justify-start gap-3"
										asChild
									>
										<a href="/learn">
											<BookOpen className="w-4 h-4" />
											Continue Learning
										</a>
									</Button>
									<Button
										variant="outline"
										className="w-full justify-start gap-3"
									>
										<Settings className="w-4 h-4" />
										Settings
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Achievement Preview */}
						<Card>
							<CardContent className="p-6">
								<h3 className="text-lg font-semibold mb-4">
									Recent Achievements
								</h3>
								<div className="text-center py-8">
									<div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
										<User className="w-8 h-8 text-gray-400" />
									</div>
									<p className="text-sm text-muted-foreground">
										Complete your first lesson to earn achievements!
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
