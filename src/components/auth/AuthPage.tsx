import { useState } from "react";
import { LoginForm, SignUpForm } from "./AuthForms";

export function AuthPage() {
	const [isSignUp, setIsSignUp] = useState(false);

	return (
		<div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3">
			<div className="w-100" style={{ maxWidth: "28rem" }}>
				<div className="text-center mb-4">
					<h1 className="display-5 fw-bold text-dark mb-2">FrenchMaster</h1>
					<p className="text-muted">
						Learn French with AI-powered lessons and pronunciation practice
					</p>
				</div>

				{isSignUp ? (
					<SignUpForm onToggleMode={() => setIsSignUp(false)} />
				) : (
					<LoginForm onToggleMode={() => setIsSignUp(true)} />
				)}
			</div>
		</div>
	);
}
