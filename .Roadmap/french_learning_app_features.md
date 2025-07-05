# French Learning App Features Documentation

_Last Updated: 2025-07-05_

---

## Rapid Development Plan: Parallel Backend & Frontend Tasks (React + Supabase)

To build the app as quickly as possible, divide the work into small, parallelizable tasks for backend (Supabase) and frontend (React). Each feature below is split into backend and frontend subtasks.

---

### 1. User Authentication & Profiles

- **Backend (Supabase):**
  - Set up Supabase Auth (email, Google, anonymous)
  - Create `profiles` table for user data
- **Frontend (React):**
  - Build login/signup UI
  - Integrate Supabase Auth
  - Profile page: view/edit user info

---

### 2. Module-Based Learning System

- **Backend:**
  - Create `modules`, `lessons`, `user_progress` tables
- **Frontend:**
  - Module/lesson navigation UI
  - Lock/unlock logic based on progress
  - Display module status

---

### 3. Lesson Content

- **Backend:**
  - Store lessons, images, audio in Supabase Database/Storage
- **Frontend:**
  - Lesson display UI (text, images, audio)
  - Use react-quill for admin content entry

---

### 4. Vocabulary Learning

- **Backend:**
  - Create `vocabulary`, `user_vocab_progress` tables
- **Frontend:**
  - Flashcards, matching, fill-in-the-blank UI
  - Track vocab progress

---

### 5. Grammar Learning

- **Backend:**
  - Store grammar rules, examples, exercises
- **Frontend:**
  - Grammar explanation and practice UI

---

### 6. Pronunciation System

- **Backend:**
  - Store user audio (optional)
- **Frontend:**
  - Integrate Web Speech API for TTS/STT
  - Pronunciation practice UI

---

### 7. AI Chat & Pronunciation Help

- **Backend:**
  - (Optional) Store chat logs in Supabase
- **Frontend:**
  - Chat UI (send/receive messages)
  - Integrate Groq API for AI responses
  - TTS/STT for chat

---

### 8. Reading Practice With Pronunciation Feedback

- **Backend:**
  - Store reading texts, user audio (optional)
- **Frontend:**
  - Display text, record/transcribe user reading
  - Highlight errors, show feedback

---

### 9. Assessment System

- **Backend:**
  - Create `tests`, `test_results` tables
- **Frontend:**
  - Test UI (multiple-choice, fill-in, matching)
  - Show results, unlock next module

---

### 10. Admin Panel

- **Backend:**
  - Ensure all content tables support CRUD
- **Frontend:**
  - Admin UI for managing modules, lessons, vocab, grammar, tests

---

### 11. Supabase Integration

- **Backend:**
  - Set up all tables/storage in Supabase
- **Frontend:**
  - Use supabase-js for all data/auth/storage operations

---

### 12. Offline Capabilities

- **Backend:**
  - N/A (Supabase syncs when online)
- **Frontend:**
  - Use localStorage/IndexedDB for caching lessons/audio

---

## Suggested Parallel Workflow

1. **Backend team:**
   - Set up Supabase project, tables, and storage buckets for all features above.
   - Share table schemas and API endpoints with frontend.
2. **Frontend team:**
   - Scaffold React app, set up routing and basic UI.
   - Integrate Supabase Auth and database calls as soon as tables are ready.
   - Build feature UIs in parallel (auth, modules, lessons, vocab, chat, etc.).

---

## Tech Stack: React + Supabase

This app is designed to be built with **React** (for web) and **Supabase** (for backend/auth/storage). React offers rapid development, a huge ecosystem, and easy integration with browser APIs for speech features.

---

## 1. User Authentication & Profiles

### Authentication Methods

- Email & password login (Supabase Auth, **free**)
- Google login (Supabase Auth, **free**)
- Anonymous login (Supabase Auth, **free**)

### User Profile Features

- Profile creation and customization
- Learning level, progress tracking, and history
- Custom settings (notifications, theme preferences)

**Easy Implementation:**  
All handled natively using [Supabase Authentication](https://supabase.com/docs/guides/auth) and the [supabase-js](https://supabase.com/docs/reference/javascript/auth-signin) library in React.

---

## 2. Module-Based Learning System

### Module Structure

- Sequential unlocking; each module unlocks after passing the previous module's test
- Module status: locked, unlocked, completed

**Easy Implementation:**

- Store module and user progress in Supabase Database tables.
- Use simple logic in React components to control access.

### Module Components

Each module contains:

- Multiple lessons
- Vocabulary sets
- Grammar topics
- Pronunciation practice
- **End-of-module test** (admin sets pass threshold, default 65%)

---

## 3. Lesson Content

### Lesson Types

- Conversation, situational, cultural context, and review lessons

### Lesson Components

- Rich text (use [react-quill](https://github.com/zenoamaro/react-quill) or similar for admin content entry)
- Images, icons (Supabase Storage, **free tier**)
- Audio playback (Supabase Storage, browser HTML5 audio)
- Key phrases, interactive exercises

---

## 4. Vocabulary Learning

### Vocabulary Features

- Word lists per module
- Word categorization (noun, verb, etc.)
- Gender, usage examples, audio pronunciation

### Vocabulary Practice

- Flashcards, matching, fill-in-the-blank (use React UI components)
- Store user vocab progress in Supabase Database

---

## 5. Grammar Learning

- Explanation of grammar rules
- Examples, comparison with English
- Practice: fill-in-the-blank, sentence construction (React forms/components)

---

## 6. Pronunciation System

### Pronunciation Playback (Text-to-Speech)

#### Free API Options:

- **Browser/Web:** [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) (text-to-speech, **free**, built into browsers; easy to use in React)
- **Cloud:** [Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech) has limited free tier, but browser TTS is easiest and free.

### User Pronunciation Practice (Speech-to-Text)

#### Free API Options:

- **Browser/Web:** [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) (speech recognition, **free**, works in Chrome and some others; can be used in React)
- **Cloud:** [OpenAI Whisper API](https://openai.com/research/whisper) (not free, but high accuracy)
- **Google Cloud Speech-to-Text**: Limited free quota, pay-as-you-go after that.

**Easy Implementation:**  
For cost and ease, use browser TTS/STT for most users, offer cloud-based as fallback for better accuracy. Use React hooks for integration.

---

## 7. Two-Way Communication: AI Chat & Pronunciation Help

### AI Chat Feature (using **Groq API**)

- In-app chat where users can ask questions about French, grammar, vocab, etc.
- AI responds with explanations and guidance using advanced large language models (Llama 3, Mixtral, Gemma, etc.).
- Use Groq API for chat completions and conversational features (fetch from React).

**How to use Groq API:**

- Sign up and get your API key at [https://groq.com/](https://groq.com/).
- API endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Format requests just like OpenAI’s API.
- Example:
  ```javascript
  fetch("https://api.groq.com/openai/v1/chat/completions", {
  	method: "POST",
  	headers: {
  		Authorization: "Bearer YOUR_GROQ_API_KEY",
  		"Content-Type": "application/json",
  	},
  	body: JSON.stringify({
  		model: "llama3-70b-8192",
  		messages: [
  			{
  				role: "user",
  				content: "Bonjour, comment puis-je améliorer ma prononciation?",
  			},
  		],
  	}),
  });
  ```
- Groq is **currently free for developers** (July 2025). Check [Groq Pricing](https://groq.com/pricing) for updates.

### Pronunciation Help in Chat

- User can send a word/phrase (text or voice).
- AI can provide feedback, explanations, and correct pronunciation (using TTS and STT as above).
- For speech evaluation, use STT to get user’s text, and compare to expected phrase.

---

## 8. Reading Practice With Pronunciation Feedback

### Feature Flow

1. Display a French short text or story on screen (React component).
2. User reads aloud; app records audio (use Web Speech API in React).
3. Use Speech-to-Text to transcribe user's reading.
4. Compare transcript with the original text.
5. Highlight words that were omitted or mispronounced (React rendering).

#### Free API Options:

- **Browser:** [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) for STT (free, browser support varies)
- **Cloud:** [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text) (small free tier)
- **OpenAI Whisper:** High accuracy, but not free

**Implementation Tips:**

- Use browser STT for most users (React integration).
- Save audio in Supabase Storage if you want admin or AI to review.
- Compare original and transcribed text in-app; highlight mismatches.
- Optionally, use Groq API to provide reading feedback, suggestions, or corrections based on the result.

---

## 9. Assessment System

- End-of-module tests, configurable pass threshold
- Multiple question types: multiple-choice, fill-in, matching, etc. (React components)
- Store results in Supabase Database
- Unlock next module on pass

---

## 10. Admin Panel

- Add/edit modules, lessons, vocabulary, grammar, tests
- Set passing thresholds per module
- Manage users, view progress
- Use React for admin UI, or Supabase-compatible no-code tools (like [Retool](https://retool.com/), [JetAdmin](https://www.jetadmin.io/), **free tiers available**)

---

## 11. Supabase Integration

- **Authentication:** All logins with Supabase Auth (via supabase-js in React)
- **Database:** Supabase Database (Postgres) for all structured data (modules, content, user progress, test results)
- **Storage:** Supabase Storage for audio/images
- **Hosting:** Supabase Hosting for web app/admin panel (free for small projects)
- **Edge Functions:** (optional) for AI chat relay, custom logic, or webhook triggers (free tier available)

---

## 12. Offline Capabilities

- Use browser storage (localStorage/IndexedDB) for offline support in React
- Cache lessons/audio for offline use
- Sync progress when online

---

## Example: How to Implement Reading Practice Feature

1. **Display French text:** Render on screen (React component).
2. **Record user's reading:**
   - Use Web Speech API for live transcription in React.
   - Optionally record audio and upload to Supabase Storage.
3. **Speech-to-Text:**
   - Get transcript from STT API.
4. **Word-by-word comparison:**
   - Split original and transcribed text into words.
   - Use a simple text diff algorithm to find mismatches or missing words.
5. **Highlight errors:**
   - Use colored `<span>` for each wrong or missing word (React rendering).
6. **Give feedback:**
   - Show list of mistakes; offer to replay correct pronunciation (using TTS).
   - Optionally, use Groq API to generate personalized feedback or encouragement.

---

## Example: How to Implement AI Chat with Groq

1. **Chat UI:** Simple send/receive message interface (React component).
2. **On send:**
   - Send message to Groq API endpoint (see above).
   - Display loading spinner while waiting.
3. **On reply:**
   - Display AI's answer in chat.
4. **Optionally:**
   - Use TTS to read out the answer.
   - If user sends a voice message, use STT, then send recognized text to Groq.

---

## API Quick Links

- **Supabase Authentication, Database, Storage:**  
  [supabase.com/docs](https://supabase.com/docs)
- **supabase-js (React integration):**  
  [supabase.com/docs/reference/javascript](https://supabase.com/docs/reference/javascript)
- **React:**  
  [react.dev](https://react.dev/)
- **React Quill:**  
  [react-quill](https://github.com/zenoamaro/react-quill)
- **Web Speech API (Browser TTS/STT):**  
  [MDN SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)  
  [MDN SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
- **Groq API:**  
  [API Documentation](https://console.groq.com/docs)  
  [Sign Up / API Key](https://groq.com/)
- **Google Cloud Speech-to-Text:**  
  [API Docs](https://cloud.google.com/speech-to-text) (small free tier)
- **OpenAI Whisper (Speech-to-Text):**  
  [API Docs](https://platform.openai.com/docs/guides/speech-to-text) (not free after trial)

---

## Implementation Notes

- Always check the latest API pricing and free tier as they can change.
- For fully free solutions, favor browser built-in APIs for speech.
- For AI chat, Groq API is currently fast and free for developers.
- All data and media can be securely stored and managed with Supabase.
- React is ideal for rapid web development and easy browser API integration.

---

## Summary Table

| Feature                | Free/Easy API Options        | React/Supabase Role                     |
| ---------------------- | ---------------------------- | --------------------------------------- |
| Auth/User Profiles     | Supabase Auth                | Store user data/progress (React UI)     |
| Content/Modules/Tests  | Supabase Database            | Store/retrieve all content (React CRUD) |
| Audio/Image Storage    | Supabase Storage             | Store audio/images (React upload)       |
| Pronunciation: TTS/STT | Browser API, Supabase        | Store pronunciation scores (React)      |
| AI Chat/Help           | **Groq API**, browser TTS    | Store chat logs (React chat UI)         |
| Reading Practice       | Browser STT, Supabase        | Store reading, feedback (React)         |
| Admin Panel            | React/Retool/JetAdmin (free) | CRUD for content/users                  |

---

_This roadmap and feature list is designed for maximum compatibility with React and Supabase for the fastest, most cost-effective web development path possible in 2025, now featuring Groq API for AI conversational features._
