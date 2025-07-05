import { useState } from "react";
import { LoginForm, SignUpForm } from "./AuthFormsNew";
import { motion } from "framer-motion";

export function AuthPage() {
	const [isLoginMode, setIsLoginMode] = useState(true);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-8"
				>
					<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<span className="text-white font-bold text-2xl">FR</span>
					</div>
					<h1 className="text-3xl font-bold text-foreground mb-2">
						French Learning App
					</h1>
					<p className="text-muted-foreground">
						Master the beautiful French language
					</p>
				</motion.div>

				{/* Auth Forms */}
				{isLoginMode ? (
					<LoginForm onToggleMode={() => setIsLoginMode(false)} />
				) : (
					<SignUpForm onToggleMode={() => setIsLoginMode(true)} />
				)}
			</div>
		</div>
	);
}
