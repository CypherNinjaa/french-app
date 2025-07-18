import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
	throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions for our database tables
export interface Profile {
	id: string;
	email: string;
	full_name?: string;
	learning_level: "beginner" | "intermediate" | "advanced";
	created_at: string;
	updated_at: string;
	preferences?: {
		notifications: boolean;
		theme: "light" | "dark";
		language: string;
	};
}

export interface AuthError {
	message: string;
	status?: number;
}
