import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type {
	User,
	Session,
	AuthError as SupabaseAuthError,
} from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Profile } from "../lib/supabase";
import toast from "react-hot-toast";

interface AuthContextType {
	user: User | null;
	profile: Profile | null;
	session: Session | null;
	loading: boolean;
	signUp: (email: string, password: string, fullName?: string) => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signInWithGoogle: () => Promise<void>;
	signOut: () => Promise<void>;
	updateProfile: (updates: Partial<Profile>) => Promise<void>;
	error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);
			if (session?.user) {
				fetchProfile(session.user.id);
			}
			setLoading(false);
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);

			if (session?.user) {
				await fetchProfile(session.user.id);
			} else {
				setProfile(null);
			}

			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	const fetchProfile = async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (error && error.code !== "PGRST116") {
				throw error;
			}

			if (data) {
				setProfile(data);
			}
		} catch (error) {
			console.error("Error fetching profile:", error);
			setError("Failed to load profile");
		}
	};

	const signUp = async (email: string, password: string, fullName?: string) => {
		try {
			setLoading(true);
			setError(null);

			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						full_name: fullName,
					},
				},
			});

			if (error) throw error;

			// The profile and user progress will be created automatically by the database trigger

			toast.success(
				"Account created successfully! Please check your email for verification."
			);
		} catch (error) {
			const errorMessage =
				(error as SupabaseAuthError).message || "An unexpected error occurred";
			setError(errorMessage);
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const signIn = async (email: string, password: string) => {
		try {
			setLoading(true);
			setError(null);

			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;

			toast.success("Signed in successfully!");
		} catch (error) {
			const errorMessage =
				(error as SupabaseAuthError).message || "An unexpected error occurred";
			setError(errorMessage);
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const signInWithGoogle = async () => {
		try {
			setLoading(true);
			setError(null);

			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			});

			if (error) throw error;
		} catch (error) {
			const errorMessage =
				(error as SupabaseAuthError).message || "An unexpected error occurred";
			setError(errorMessage);
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const signOut = async () => {
		try {
			setLoading(true);
			setError(null);

			const { error } = await supabase.auth.signOut();

			if (error) throw error;

			setProfile(null);
			toast.success("Signed out successfully!");
		} catch (error) {
			const errorMessage =
				(error as SupabaseAuthError).message || "An unexpected error occurred";
			setError(errorMessage);
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const updateProfile = async (updates: Partial<Profile>) => {
		try {
			if (!user) throw new Error("No user logged in");

			setLoading(true);
			setError(null);

			const { error } = await supabase
				.from("profiles")
				.update({
					...updates,
					updated_at: new Date().toISOString(),
				})
				.eq("id", user.id);

			if (error) throw error;

			// Update local profile state
			setProfile((prev) => (prev ? { ...prev, ...updates } : null));
			toast.success("Profile updated successfully!");
		} catch (error) {
			const errorMessage =
				(error as Error).message || "Failed to update profile";
			setError(errorMessage);
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const value: AuthContextType = {
		user,
		profile,
		session,
		loading,
		signUp,
		signIn,
		signInWithGoogle,
		signOut,
		updateProfile,
		error,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
