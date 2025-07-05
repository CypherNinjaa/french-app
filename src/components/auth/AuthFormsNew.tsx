import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoginFormProps {
	onToggleMode: () => void;
}

interface InputFieldProps {
	label: string;
	name: string;
	type: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder: string;
	icon: React.ElementType;
	error?: string;
	disabled?: boolean;
	showPassword?: boolean;
	onTogglePassword?: () => void;
}

function InputField({
	label,
	name,
	type,
	value,
	onChange,
	placeholder,
	icon: Icon,
	error,
	disabled,
	showPassword,
	onTogglePassword,
}: InputFieldProps) {
	return (
		<div className="space-y-2">
			<label htmlFor={name} className="text-sm font-medium text-foreground">
				{label}
			</label>
			<div className="relative">
				<Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
				<input
					type={type}
					id={name}
					name={name}
					value={value}
					onChange={onChange}
					className={cn(
						"w-full pl-10 pr-4 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground",
						"focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
						"transition-colors duration-200",
						error && "border-destructive focus:ring-destructive",
						disabled && "opacity-50 cursor-not-allowed",
						name === "password" && "pr-10"
					)}
					placeholder={placeholder}
					disabled={disabled}
				/>
				{name === "password" && onTogglePassword && (
					<button
						type="button"
						onClick={onTogglePassword}
						className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
						disabled={disabled}
					>
						{showPassword ? (
							<EyeOff className="w-4 h-4" />
						) : (
							<Eye className="w-4 h-4" />
						)}
					</button>
				)}
			</div>
			{error && (
				<motion.p
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-sm text-destructive"
				>
					{error}
				</motion.p>
			)}
		</div>
	);
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
	const { signIn, signInWithGoogle, loading } = useAuth();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		try {
			await signIn(formData.email, formData.password);
		} catch {
			// Error handled by AuthContext
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Card className="w-full max-w-md mx-auto">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
					<CardDescription>
						Sign in to continue your French learning journey
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					<form onSubmit={handleSubmit} className="space-y-4">
						<InputField
							label="Email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleInputChange}
							placeholder="Enter your email"
							icon={Mail}
							error={errors.email}
							disabled={loading}
						/>

						<InputField
							label="Password"
							name="password"
							type={showPassword ? "text" : "password"}
							value={formData.password}
							onChange={handleInputChange}
							placeholder="Enter your password"
							icon={Lock}
							error={errors.password}
							disabled={loading}
							showPassword={showPassword}
							onTogglePassword={() => setShowPassword(!showPassword)}
						/>

						<Button
							type="submit"
							disabled={loading}
							className="w-full"
							size="lg"
						>
							{loading ? (
								<>
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
									Signing in...
								</>
							) : (
								"Sign In"
							)}
						</Button>
					</form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					<Button
						variant="outline"
						className="w-full"
						size="lg"
						onClick={signInWithGoogle}
						disabled={loading}
					>
						<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="currentColor"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="currentColor"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="currentColor"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Continue with Google
					</Button>

					<div className="text-center text-sm">
						<span className="text-muted-foreground">
							Don't have an account?{" "}
						</span>
						<button
							type="button"
							onClick={onToggleMode}
							className="text-primary hover:underline font-medium"
						>
							Sign up
						</button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

interface SignUpFormProps {
	onToggleMode: () => void;
}

export function SignUpForm({ onToggleMode }: SignUpFormProps) {
	const { signUp, signInWithGoogle, loading } = useAuth();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		fullName: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.fullName.trim()) {
			newErrors.fullName = "Full name is required";
		}

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		try {
			await signUp(formData.email, formData.password, formData.fullName);
		} catch {
			// Error handled by AuthContext
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Card className="w-full max-w-md mx-auto">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">
						Join French Learning
					</CardTitle>
					<CardDescription>
						Create your account to start learning French today
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					<form onSubmit={handleSubmit} className="space-y-4">
						<InputField
							label="Full Name"
							name="fullName"
							type="text"
							value={formData.fullName}
							onChange={handleInputChange}
							placeholder="Enter your full name"
							icon={User}
							error={errors.fullName}
							disabled={loading}
						/>

						<InputField
							label="Email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleInputChange}
							placeholder="Enter your email"
							icon={Mail}
							error={errors.email}
							disabled={loading}
						/>

						<InputField
							label="Password"
							name="password"
							type={showPassword ? "text" : "password"}
							value={formData.password}
							onChange={handleInputChange}
							placeholder="Create a password"
							icon={Lock}
							error={errors.password}
							disabled={loading}
							showPassword={showPassword}
							onTogglePassword={() => setShowPassword(!showPassword)}
						/>

						<InputField
							label="Confirm Password"
							name="confirmPassword"
							type={showConfirmPassword ? "text" : "password"}
							value={formData.confirmPassword}
							onChange={handleInputChange}
							placeholder="Confirm your password"
							icon={Lock}
							error={errors.confirmPassword}
							disabled={loading}
							showPassword={showConfirmPassword}
							onTogglePassword={() =>
								setShowConfirmPassword(!showConfirmPassword)
							}
						/>

						<Button
							type="submit"
							disabled={loading}
							className="w-full"
							size="lg"
						>
							{loading ? (
								<>
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
									Creating account...
								</>
							) : (
								"Create Account"
							)}
						</Button>
					</form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					<Button
						variant="outline"
						className="w-full"
						size="lg"
						onClick={signInWithGoogle}
						disabled={loading}
					>
						<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="currentColor"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="currentColor"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="currentColor"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Continue with Google
					</Button>

					<div className="text-center text-sm">
						<span className="text-muted-foreground">
							Already have an account?{" "}
						</span>
						<button
							type="button"
							onClick={onToggleMode}
							className="text-primary hover:underline font-medium"
						>
							Sign in
						</button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
