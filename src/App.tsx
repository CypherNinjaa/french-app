import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { AuthPage } from "./components/auth/AuthPage";
import { ProfilePage } from "./components/profile/ProfilePage";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import "./index.css";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
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
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return user ? <Navigate to="/profile" replace /> : <>{children}</>;
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
				path="/profile"
				element={
					<ProtectedRoute>
						<ProfilePage />
					</ProtectedRoute>
				}
			/>
			<Route path="/" element={<Navigate to="/auth" replace />} />
			<Route path="*" element={<Navigate to="/auth" replace />} />
		</Routes>
	);
}

function App() {
	return (
		<ErrorBoundary>
			<AuthProvider>
				<Router>
					<div className="App">
						<AppContent />
						<Toaster
							position="top-right"
							toastOptions={{
								duration: 4000,
								style: {
									background: "#363636",
									color: "#fff",
								},
								success: {
									duration: 3000,
									style: {
										background: "#22c55e",
									},
								},
								error: {
									duration: 5000,
									style: {
										background: "#ef4444",
									},
								},
							}}
						/>
					</div>
				</Router>
			</AuthProvider>
		</ErrorBoundary>
	);
}

export default App;
