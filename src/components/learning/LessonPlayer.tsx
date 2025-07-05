import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
	ArrowLeft,
	ArrowRight,
	CheckCircle,
	Volume2,
	BookOpen,
	Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Lesson {
	id: string;
	module_id: string;
	title: string;
	description: string;
	content: string;
	lesson_type:
		| "conversation"
		| "grammar"
		| "vocabulary"
		| "pronunciation"
		| "culture";
	order_index: number;
	estimated_duration_minutes: number;
	audio_url: string | null;
	key_phrases: string[];
	isCompleted?: boolean;
}

// Mock data - in real implementation, this would come from API
const mockLessons: Record<string, Lesson[]> = {
	"550e8400-e29b-41d4-a716-446655440001": [
		{
			id: "1",
			module_id: "550e8400-e29b-41d4-a716-446655440001",
			title: "Greetings and Introductions",
			description: "Learn basic French greetings and how to introduce yourself",
			content: `# Greetings and Introductions

Welcome to your first French lesson! Today we'll learn the essential greetings and how to introduce yourself in French.

## Basic Greetings

### Formal Greetings
- **Bonjour** - Hello (used during the day)
- **Bonsoir** - Good evening
- **Bonne nuit** - Good night

### Informal Greetings  
- **Salut** - Hi/Bye (casual)
- **Coucou** - Hey (very casual)

## Introducing Yourself

### Basic Introductions
- **Je m'appelle...** - My name is...
- **Je suis...** - I am...
- **J'ai ... ans** - I am ... years old

### Example Conversation
> **Person A:** Bonjour! Je m'appelle Marie. Et vous?
> 
> **Person B:** Bonjour Marie! Je suis Paul. Enchanté!
> 
> **Person A:** Enchantée aussi!

## Practice

Try introducing yourself using these phrases:
1. Say "Hello, my name is [your name]"
2. Ask someone their name: "Et vous?" (And you?)
3. Respond politely: "Enchanté(e)!" (Nice to meet you!)

## Key Vocabulary
- **Comment vous appelez-vous?** - What is your name? (formal)
- **Comment tu t'appelles?** - What is your name? (informal)
- **Enchanté(e)** - Nice to meet you
- **De rien** - You're welcome`,
			lesson_type: "conversation",
			order_index: 1,
			estimated_duration_minutes: 15,
			audio_url: null,
			key_phrases: [
				"Bonjour",
				"Je m'appelle",
				"Enchanté",
				"Comment vous appelez-vous?",
			],
		},
		{
			id: "2",
			module_id: "550e8400-e29b-41d4-a716-446655440001",
			title: "Common Phrases",
			description: "Essential everyday French phrases for beginners",
			content: `# Common Phrases

Master these essential French phrases to navigate daily conversations with confidence.

## Politeness

### Please and Thank You
- **S'il vous plaît** - Please (formal)
- **S'il te plaît** - Please (informal)
- **Merci** - Thank you
- **Merci beaucoup** - Thank you very much
- **De rien** - You're welcome
- **Je vous en prie** - You're welcome (formal)

### Apologies
- **Excusez-moi** - Excuse me (formal)
- **Excuse-moi** - Excuse me (informal)
- **Pardon** - Sorry/Pardon
- **Je suis désolé(e)** - I'm sorry

## Basic Questions

### How are you?
- **Comment allez-vous?** - How are you? (formal)
- **Comment ça va?** - How are you? (informal)
- **Ça va?** - How's it going?

### Responses
- **Ça va bien** - I'm doing well
- **Ça va** - I'm okay
- **Et vous?** - And you? (formal)
- **Et toi?** - And you? (informal)

### Asking for Help
- **Pouvez-vous m'aider?** - Can you help me? (formal)
- **Où est...?** - Where is...?
- **Je ne comprends pas** - I don't understand
- **Répétez, s'il vous plaît** - Please repeat

## Practice Dialogue
> **A:** Bonjour! Comment allez-vous?
> 
> **B:** Ça va bien, merci. Et vous?
> 
> **A:** Très bien! Excusez-moi, où est la gare?
> 
> **B:** La gare est là-bas. De rien!`,
			lesson_type: "conversation",
			order_index: 2,
			estimated_duration_minutes: 15,
			audio_url: null,
			key_phrases: [
				"S'il vous plaît",
				"Merci",
				"Comment allez-vous",
				"Je ne comprends pas",
			],
		},
		{
			id: "3",
			module_id: "550e8400-e29b-41d4-a716-446655440001",
			title: "Basic Vocabulary",
			description: "Learn essential French words for daily use",
			content: `# Basic Vocabulary

Build your French foundation with these essential everyday words.

## Colors (Les Couleurs)

### Primary Colors
- **Rouge** - Red
- **Bleu** - Blue  
- **Jaune** - Yellow

### Common Colors
- **Vert** - Green
- **Noir** - Black
- **Blanc** - White
- **Gris** - Gray
- **Orange** - Orange
- **Violet** - Purple
- **Rose** - Pink
- **Marron** - Brown

## Days of the Week (Les Jours de la Semaine)

- **Lundi** - Monday
- **Mardi** - Tuesday
- **Mercredi** - Wednesday
- **Jeudi** - Thursday
- **Vendredi** - Friday
- **Samedi** - Saturday
- **Dimanche** - Sunday

## Numbers 1-10 (Les Nombres)

- **Un** - One
- **Deux** - Two
- **Trois** - Three
- **Quatre** - Four
- **Cinq** - Five
- **Six** - Six
- **Sept** - Seven
- **Huit** - Eight
- **Neuf** - Nine
- **Dix** - Ten

## Practice Exercises

1. **Color Game**: Look around you and name 5 objects with their colors in French
   - Example: "La pomme est rouge" (The apple is red)

2. **Day Practice**: Say what day it is today in French
   - Example: "Aujourd'hui, c'est lundi" (Today is Monday)

3. **Counting**: Count from 1 to 10 in French, then backwards

## Memory Tips
- **Rouge** sounds like "rouge" in English
- **Bleu** is similar to "blue"
- Days ending in "-di" are easier to remember: Lundi, Mardi, Mercredi, Jeudi`,
			lesson_type: "vocabulary",
			order_index: 3,
			estimated_duration_minutes: 20,
			audio_url: null,
			key_phrases: ["Rouge", "Bleu", "Lundi", "Mardi", "Un", "Deux"],
		},
	],
};

export function LessonPlayer() {
	const { moduleId, lessonId } = useParams<{
		moduleId: string;
		lessonId: string;
	}>();
	const navigate = useNavigate();
	const [isCompleted, setIsCompleted] = useState(false);
	const [timeSpent, setTimeSpent] = useState(0);

	// Get lessons for this module
	const lessons = mockLessons[moduleId || ""] || [];
	const currentLessonIndex = lessons.findIndex((l) => l.id === lessonId);
	const currentLesson = lessons[currentLessonIndex];
	const nextLesson = lessons[currentLessonIndex + 1];
	const previousLesson = lessons[currentLessonIndex - 1];

	// Timer for tracking time spent
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeSpent((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const handleCompleteLesson = () => {
		setIsCompleted(true);
		// In real implementation, this would update the database
		console.log(`Lesson ${lessonId} completed in ${timeSpent} seconds`);
	};

	const handleNextLesson = () => {
		if (nextLesson) {
			navigate(`/learn/modules/${moduleId}/lessons/${nextLesson.id}`);
		} else {
			// Go back to module overview
			navigate(`/learn/modules/${moduleId}`);
		}
	};

	const handlePreviousLesson = () => {
		if (previousLesson) {
			navigate(`/learn/modules/${moduleId}/lessons/${previousLesson.id}`);
		} else {
			navigate(`/learn/modules/${moduleId}`);
		}
	};

	const playAudio = () => {
		// Implement text-to-speech or audio playback
		if ("speechSynthesis" in window) {
			const utterance = new SpeechSynthesisUtterance(
				"Bonjour, comment allez-vous?"
			);
			utterance.lang = "fr-FR";
			speechSynthesis.speak(utterance);
		}
	};

	const getLessonTypeColor = () => {
		switch (currentLesson?.lesson_type) {
			case "conversation":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/20";
			case "vocabulary":
				return "bg-green-100 text-green-800 dark:bg-green-900/20";
			case "grammar":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/20";
			case "pronunciation":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900/20";
			case "culture":
				return "bg-pink-100 text-pink-800 dark:bg-pink-900/20";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20";
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	if (!currentLesson) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center"
				>
					<h2 className="text-2xl font-semibold mb-2">Lesson not found</h2>
					<p className="text-muted-foreground mb-6">
						The requested lesson could not be found.
					</p>
					<Button onClick={() => navigate(`/learn/modules/${moduleId}`)}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Module
					</Button>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<Button
						variant="ghost"
						onClick={() => navigate(`/learn/modules/${moduleId}`)}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Module
					</Button>

					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<h1 className="text-3xl font-bold text-foreground">
								{currentLesson.title}
							</h1>
							<Badge className={cn("capitalize", getLessonTypeColor())}>
								{currentLesson.lesson_type}
							</Badge>
						</div>
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<span className="flex items-center gap-1">
								<Clock className="w-4 h-4" />
								{formatTime(timeSpent)}
							</span>
							<span className="flex items-center gap-1">
								<BookOpen className="w-4 h-4" />
								{currentLessonIndex + 1} / {lessons.length}
							</span>
						</div>
					</div>

					<p className="text-lg text-muted-foreground mb-4">
						{currentLesson.description}
					</p>

					{/* Progress */}
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Lesson Progress</span>
							<span className="font-medium">
								{currentLessonIndex + 1} of {lessons.length}
							</span>
						</div>
						<Progress
							value={((currentLessonIndex + 1) / lessons.length) * 100}
							className="h-2"
						/>
					</div>
				</motion.div>

				{/* Lesson Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="mb-8"
				>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle>Lesson Content</CardTitle>
								<CardDescription>
									Estimated time: {currentLesson.estimated_duration_minutes}{" "}
									minutes
								</CardDescription>
							</div>
							<Button variant="outline" size="sm" onClick={playAudio}>
								<Volume2 className="w-4 h-4 mr-2" />
								Listen
							</Button>
						</CardHeader>
						<CardContent className="prose prose-slate dark:prose-invert max-w-none">
							<ReactMarkdown>{currentLesson.content}</ReactMarkdown>
						</CardContent>
					</Card>
				</motion.div>

				{/* Key Phrases */}
				{currentLesson.key_phrases.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="mb-8"
					>
						<Card>
							<CardHeader>
								<CardTitle>Key Phrases</CardTitle>
								<CardDescription>
									Important phrases from this lesson
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-2">
									{currentLesson.key_phrases.map((phrase, index) => (
										<Badge
											key={index}
											variant="secondary"
											className="text-sm py-2 px-3"
										>
											{phrase}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				)}

				{/* Navigation */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="flex items-center justify-between"
				>
					<Button
						variant="outline"
						onClick={handlePreviousLesson}
						disabled={!previousLesson}
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Previous
					</Button>

					<div className="flex items-center gap-3">
						{!isCompleted ? (
							<Button onClick={handleCompleteLesson}>
								<CheckCircle className="w-4 h-4 mr-2" />
								Mark Complete
							</Button>
						) : (
							<div className="flex items-center gap-2 text-green-600">
								<CheckCircle className="w-5 h-5" />
								<span className="font-medium">Completed!</span>
							</div>
						)}

						<Button onClick={handleNextLesson}>
							{nextLesson ? "Next Lesson" : "Finish Module"}
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
