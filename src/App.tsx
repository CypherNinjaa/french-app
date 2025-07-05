import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { AuthPage } from "./components/auth/AuthPage";
import { ProfilePage } from "./components/profile/ProfilePage";
import { LearningDashboard } from "./components/learning/LearningDashboard";
import { Layout } from "./components/layout/Layout";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import "./index.css";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="mt-4 text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="mt-4 text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	return user ? <Navigate to="/learn" replace /> : <>{children}</>;
}

function AppContent() {
	return (
		<Routes>
			<Route
				path="/auth"
				element={
					<PublicRoute>
						<AuthPage />
					</PublicRoute>
				}
			/>
			<Route
				path="/learn"
				element={
					<ProtectedRoute>
						<Layout>
							<LearningDashboard />
						</Layout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/profile"
				element={
					<ProtectedRoute>
						<Layout>
							<ProfilePage />
						</Layout>
					</ProtectedRoute>
				}
			/>
			<Route path="/" element={<Navigate to="/learn" replace />} />
			<Route path="*" element={<Navigate to="/learn" replace />} />
		</Routes>
	);
}

function App() {
	return (
		<ErrorBoundary>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Router>
						<div className="App">
							<AppContent />
							<Toaster
								position="top-right"
								toastOptions={{
									duration: 4000,
									style: {
										background: "hsl(var(--background))",
										color: "hsl(var(--foreground))",
										border: "1px solid hsl(var(--border))",
									},
									success: {
										duration: 3000,
										style: {
											background: "hsl(var(--background))",
											color: "hsl(var(--foreground))",
											border: "1px solid hsl(142 76% 36%)",
										},
									},
									error: {
										duration: 5000,
										style: {
											background: "hsl(var(--background))",
											color: "hsl(var(--foreground))",
											border: "1px solid hsl(var(--destructive))",
										},
									},
								}}
							/>
						</div>
					</Router>
				</AuthProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</ErrorBoundary>
	);
}

export default App;
