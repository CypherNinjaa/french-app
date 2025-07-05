import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { User, Settings, BookOpen, LogOut, Edit2, Save, X } from "lucide-react";
import type { Profile } from "../../lib/supabase";

export function ProfilePage() {
	const { user, profile, signOut, updateProfile, loading } = useAuth();
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

	if (!user || !profile) {
		return (
			<div className="d-flex align-items-center justify-content-center min-vh-100">
				<div className="text-center">
					<div
						className="spinner-border text-primary"
						style={{ width: "4rem", height: "4rem" }}
						role="status"
					>
						<span className="visually-hidden">Loading...</span>
					</div>
					<p className="mt-3 text-muted">Loading profile...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-vh-100">
			{/* Header */}
			<header className="bg-white shadow-sm">
				<div className="container-fluid">
					<div className="d-flex justify-content-between align-items-center py-3">
						<div className="d-flex align-items-center">
							<BookOpen
								className="text-primary me-3"
								style={{ width: "32px", height: "32px" }}
							/>
							<h1 className="h3 mb-0 fw-bold">FrenchMaster</h1>
						</div>
						<button
							onClick={signOut}
							className="btn btn-outline-secondary d-flex align-items-center"
							disabled={loading}
						>
							<LogOut
								className="me-2"
								style={{ width: "16px", height: "16px" }}
							/>
							Sign Out
						</button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container py-4">
				{/* Profile Card */}
				<div className="card mb-4">
					<div className="card-body">
						<div className="d-flex justify-content-between align-items-center mb-4">
							<div className="d-flex align-items-center">
								<div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
									<User
										className="text-primary"
										style={{ width: "32px", height: "32px" }}
									/>
								</div>
								<div>
									<h2 className="h4 mb-1">{profile.full_name || "User"}</h2>
									<p className="text-muted mb-0">{user.email}</p>
								</div>
							</div>
							<button
								onClick={() => setIsEditing(!isEditing)}
								className="btn btn-outline-secondary d-flex align-items-center"
								disabled={loading}
							>
								{isEditing ? (
									<>
										<X
											className="me-2"
											style={{ width: "16px", height: "16px" }}
										/>
										Cancel
									</>
								) : (
									<>
										<Edit2
											className="me-2"
											style={{ width: "16px", height: "16px" }}
										/>
										Edit Profile
									</>
								)}
							</button>
						</div>

						{isEditing ? (
							<form>
								<div className="mb-3">
									<label className="form-label fw-medium">Full Name</label>
									<input
										type="text"
										value={editForm.full_name}
										onChange={(e) =>
											setEditForm((prev) => ({
												...prev,
												full_name: e.target.value,
											}))
										}
										className="form-control"
										placeholder="Enter your full name"
									/>
								</div>

								<div className="mb-3">
									<label className="form-label fw-medium">Learning Level</label>
									<select
										value={editForm.learning_level}
										onChange={(e) =>
											setEditForm((prev) => ({
												...prev,
												learning_level: e.target.value as
													| "beginner"
													| "intermediate"
													| "advanced",
											}))
										}
										className="form-select"
									>
										<option value="beginner">Beginner</option>
										<option value="intermediate">Intermediate</option>
										<option value="advanced">Advanced</option>
									</select>
								</div>

								<div className="mb-4">
									<h3 className="h5 mb-3">Preferences</h3>

									<div className="d-flex justify-content-between align-items-center mb-3">
										<span className="text-muted">Email Notifications</span>
										<div className="form-check form-switch">
											<input
												className="form-check-input"
												type="checkbox"
												checked={editForm.preferences.notifications}
												onChange={(e) =>
													setEditForm((prev) => ({
														...prev,
														preferences: {
															...prev.preferences,
															notifications: e.target.checked,
														},
													}))
												}
											/>
										</div>
									</div>

									<div className="mb-3">
										<label className="form-label fw-medium">Theme</label>
										<select
											value={editForm.preferences.theme}
											onChange={(e) =>
												setEditForm((prev) => ({
													...prev,
													preferences: {
														...prev.preferences,
														theme: e.target.value as "light" | "dark",
													},
												}))
											}
											className="form-select"
										>
											<option value="light">Light</option>
											<option value="dark">Dark</option>
										</select>
									</div>
								</div>

								<div className="d-flex justify-content-end gap-2">
									<button
										type="button"
										onClick={handleCancel}
										className="btn btn-secondary"
										disabled={loading}
									>
										Cancel
									</button>
									<button
										type="button"
										onClick={handleSave}
										className="btn btn-primary d-flex align-items-center"
										disabled={loading}
									>
										<Save
											className="me-2"
											style={{ width: "16px", height: "16px" }}
										/>
										{loading ? (
											<>
												<span
													className="spinner-border spinner-border-sm me-2"
													role="status"
													aria-hidden="true"
												></span>
												Saving...
											</>
										) : (
											"Save Changes"
										)}
									</button>
								</div>
							</form>
						) : (
							<div>
								<div className="row mb-4">
									<div className="col-md-6">
										<h6 className="text-muted small">Learning Level</h6>
										<p className="h5 text-capitalize">
											{profile.learning_level}
										</p>
									</div>
									<div className="col-md-6">
										<h6 className="text-muted small">Member Since</h6>
										<p className="h5">
											{new Date(profile.created_at).toLocaleDateString()}
										</p>
									</div>
								</div>

								<div>
									<h3 className="h5 mb-3">Preferences</h3>
									<div className="d-flex justify-content-between align-items-center mb-2">
										<span>Email Notifications</span>
										<span
											className={`badge ${
												profile.preferences?.notifications
													? "bg-success"
													: "bg-secondary"
											}`}
										>
											{profile.preferences?.notifications
												? "Enabled"
												: "Disabled"}
										</span>
									</div>
									<div className="d-flex justify-content-between align-items-center">
										<span>Theme</span>
										<span className="text-capitalize fw-medium">
											{profile.preferences?.theme || "Light"}
										</span>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Quick Stats */}
				<div className="row g-3">
					<div className="col-md-4">
						<div className="card text-center">
							<div className="card-body">
								<div
									className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
									style={{ width: "48px", height: "48px" }}
								>
									<BookOpen
										className="text-primary"
										style={{ width: "24px", height: "24px" }}
									/>
								</div>
								<h5 className="card-title">Lessons Completed</h5>
								<p className="display-6 fw-bold text-primary">0</p>
								<p className="text-muted small">Start your first lesson!</p>
							</div>
						</div>
					</div>

					<div className="col-md-4">
						<div className="card text-center">
							<div className="card-body">
								<div
									className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
									style={{ width: "48px", height: "48px" }}
								>
									<Settings
										className="text-success"
										style={{ width: "24px", height: "24px" }}
									/>
								</div>
								<h5 className="card-title">Words Learned</h5>
								<p className="display-6 fw-bold text-success">0</p>
								<p className="text-muted small">Build your vocabulary!</p>
							</div>
						</div>
					</div>

					<div className="col-md-4">
						<div className="card text-center">
							<div className="card-body">
								<div
									className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
									style={{ width: "48px", height: "48px" }}
								>
									<User
										className="text-info"
										style={{ width: "24px", height: "24px" }}
									/>
								</div>
								<h5 className="card-title">Streak</h5>
								<p className="display-6 fw-bold text-info">0</p>
								<p className="text-muted small">days in a row</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
