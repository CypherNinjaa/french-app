import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navigation() {
	const { user, signOut } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleSignOut = async () => {
		try {
			await signOut();
			navigate("/auth");
		} catch (error) {
			console.error("Sign out error:", error);
		}
	};

	const navItems = [
		{ path: "/learn", label: "Learn", icon: BookOpen },
		{ path: "/profile", label: "Profile", icon: User },
	];

	return (
		<nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link
						to="/learn"
						className="flex items-center gap-2 hover:opacity-80 transition-opacity"
					>
						<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-sm">FR</span>
						</div>
						<span className="font-semibold text-lg hidden sm:block">
							French Learning
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-1">
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = location.pathname === item.path;

							return (
								<Link key={item.path} to={item.path}>
									<Button
										variant={isActive ? "default" : "ghost"}
										size="sm"
										className={cn(
											"gap-2 transition-all duration-200",
											isActive && "bg-primary text-primary-foreground"
										)}
									>
										<Icon className="w-4 h-4" />
										{item.label}
									</Button>
								</Link>
							);
						})}
					</div>

					{/* User Menu */}
					<div className="flex items-center gap-3">
						{/* User Info - Desktop */}
						<div className="hidden sm:flex items-center gap-2">
							<div className="text-right">
								<p className="text-sm font-medium">{user?.email}</p>
								<Badge variant="secondary" className="text-xs">
									Beginner
								</Badge>
							</div>
						</div>

						{/* Sign Out Button - Desktop */}
						<Button
							onClick={handleSignOut}
							variant="outline"
							size="sm"
							className="hidden md:flex gap-2"
						>
							<LogOut className="w-4 h-4" />
							Sign Out
						</Button>

						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="sm"
							className="md:hidden"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden border-t border-border mt-4 pt-4 pb-4"
					>
						<div className="space-y-2">
							{navItems.map((item) => {
								const Icon = item.icon;
								const isActive = location.pathname === item.path;

								return (
									<Link
										key={item.path}
										to={item.path}
										onClick={() => setIsMobileMenuOpen(false)}
									>
										<Button
											variant={isActive ? "default" : "ghost"}
											className={cn(
												"w-full justify-start gap-3",
												isActive && "bg-primary text-primary-foreground"
											)}
										>
											<Icon className="w-4 h-4" />
											{item.label}
										</Button>
									</Link>
								);
							})}

							<div className="pt-2 border-t border-border mt-4">
								<div className="flex items-center gap-2 p-2 text-sm">
									<User className="w-4 h-4" />
									<span>{user?.email}</span>
								</div>
								<Button
									onClick={handleSignOut}
									variant="outline"
									className="w-full justify-start gap-3 mt-2"
								>
									<LogOut className="w-4 h-4" />
									Sign Out
								</Button>
							</div>
						</div>
					</motion.div>
				)}
			</div>
		</nav>
	);
}
