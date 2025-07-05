# French Learning App Features Documentation

_Last Updated: 2025-07-05_

---

## 1. User Authentication & Profiles

### Authentication Methods
- Email & password login (Firebase Auth, **free**)
- Google login (Firebase Auth, **free**)
- Anonymous login (Firebase Auth, **free**)

### User Profile Features
- Profile creation and customization
- Learning level, progress tracking, and history
- Custom settings (notifications, theme preferences)

**Easy Implementation:**  
All handled natively using [Firebase Authentication](https://firebase.google.com/products/auth).

---

## 2. Module-Based Learning System

### Module Structure
- Sequential unlocking; each module unlocks after passing the previous module's test
- Module status: locked, unlocked, completed

**Easy Implementation:**  
- Store module and user progress in Firestore collections.
- Use simple logic in app/client to control access.

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
- Rich text (use QuillJS or similar for admin content entry)
- Images, icons (Firebase Storage, **free tier**)
- Audio playback (Firebase Storage, browser HTML5 audio)
- Key phrases, interactive exercises

---

## 4. Vocabulary Learning

### Vocabulary Features
- Word lists per module
- Word categorization (noun, verb, etc.)
- Gender, usage examples, audio pronunciation

### Vocabulary Practice
- Flashcards, matching, fill-in-the-blank
- Store user vocab progress in Firestore

---

## 5. Grammar Learning

- Explanation of grammar rules
- Examples, comparison with English
- Practice: fill-in-the-blank, sentence construction

---

## 6. Pronunciation System

### Pronunciation Playback (Text-to-Speech)

#### Free API Options:
- **Browser/Web:** [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) (text-to-speech, **free**, built into browsers)
- **Mobile:** Native TTS (Android/iOS built-in, **free**)
- **Cloud:** [Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech) has limited free tier, but browser/mobile TTS is easiest and free.

### User Pronunciation Practice (Speech-to-Text)

#### Free API Options:
- **Browser/Web:** [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) (speech recognition, **free**, limited browser support but works in Chrome and some others)
- **Mobile:** Native STT (Android/iOS built-in, **free**)
- **Cloud:** [OpenAI Whisper API](https://openai.com/research/whisper) (not free, but high accuracy)
- **Google Cloud Speech-to-Text**: Limited free quota, pay-as-you-go after that.

**Easy Implementation:**  
For cost and ease, use browser/mobile TTS/STT for most users, offer cloud-based as fallback for better accuracy.

---

## 7. Two-Way Communication: AI Chat & Pronunciation Help

### AI Chat Feature (using **Groq API**)
- In-app chat where users can ask questions about French, grammar, vocab, etc.
- AI responds with explanations and guidance using advanced large language models (Llama 3, Mixtral, Gemma, etc.).
- Use Groq API for chat completions and conversational features.

**How to use Groq API:**
- Sign up and get your API key at [https://groq.com/](https://groq.com/).
- API endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Format requests just like OpenAI’s API.  
- Example:
    ```javascript
    fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_GROQ_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {role: "user", content: "Bonjour, comment puis-je améliorer ma prononciation?"}
        ]
      })
    })
    ```
- Groq is **currently free for developers** (July 2025). Check [Groq Pricing](https://groq.com/pricing) for updates.

### Pronunciation Help in Chat
- User can send a word/phrase (text or voice).
- AI can provide feedback, explanations, and correct pronunciation (using TTS and STT as above).
- For speech evaluation, use STT to get user’s text, and compare to expected phrase.

---

## 8. Reading Practice With Pronunciation Feedback

### Feature Flow
1. Display a French short text or story on screen.
2. User reads aloud; app records audio.
3. Use Speech-to-Text to transcribe user's reading.
4. Compare transcript with the original text.
5. Highlight words that were omitted or mispronounced.

#### Free API Options:
- **Browser:** [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) for STT (free, browser support varies)
- **Mobile:** Native STT (free)
- **Cloud:** [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text) (small free tier)
- **OpenAI Whisper:** High accuracy, but not free

**Implementation Tips:**
- Use client/browser/mobile STT for most users.
- Save audio in Firebase Storage if you want admin or AI to review.
- Compare original and transcribed text in-app; highlight mismatches.
- Optionally, use Groq API to provide reading feedback, suggestions, or corrections based on the result.

---

## 9. Assessment System

- End-of-module tests, configurable pass threshold
- Multiple question types: multiple-choice, fill-in, matching, etc.
- Store results in Firestore
- Unlock next module on pass

---

## 10. Admin Panel

- Add/edit modules, lessons, vocabulary, grammar, tests
- Set passing thresholds per module
- Manage users, view progress
- Use React, Vue, or Firebase-compatible no-code tools (like [Retool](https://retool.com/), [JetAdmin](https://www.jetadmin.io/), **free tiers available**)

---

## 11. Firebase Integration

- **Authentication:** All logins with Firebase Auth
- **Database:** Firestore for all structured data (modules, content, user progress, test results)
- **Storage:** Firebase Storage for audio/images
- **Hosting:** Firebase Hosting for web app/admin panel (free for small projects)
- **Functions:** (optional) for AI chat relay, custom logic, or webhook triggers (free tier available)

---

## 12. Offline Capabilities

- Use Firestore's offline support (automatic in Firebase SDKs)
- Cache lessons/audio for offline use
- Sync progress when online

---

## Example: How to Implement Reading Practice Feature

1. **Display French text:** Render on screen.
2. **Record user's reading:**  
   - Use Web Speech API or mobile STT for live transcription.
   - Optionally record audio and upload to Firebase Storage.
3. **Speech-to-Text:**  
   - Get transcript from STT API.
4. **Word-by-word comparison:**  
   - Split original and transcribed text into words.
   - Use a simple text diff algorithm to find mismatches or missing words.
5. **Highlight errors:**  
   - Use colored `<span>` for each wrong or missing word.
6. **Give feedback:**  
   - Show list of mistakes; offer to replay correct pronunciation (using TTS).
   - Optionally, use Groq API to generate personalized feedback or encouragement.

---

## Example: How to Implement AI Chat with Groq

1. **Chat UI:** Simple send/receive message interface.
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

- **Firebase Authentication, Firestore, Storage:**  
  [firebase.google.com/docs](https://firebase.google.com/docs)

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
- For fully free solutions, favor browser/mobile built-in APIs for speech.
- For AI chat, Groq API is currently fast and free for developers.
- All data and media can be securely stored and managed with Firebase.

---

## Summary Table

| Feature                       | Free/Easy API Options              | Firebase Role               |
|-------------------------------|------------------------------------|-----------------------------|
| Auth/User Profiles            | Firebase Auth                      | Store user data/progress    |
| Content/Modules/Tests         | Firestore                          | Store/retrieve all content  |
| Audio/Image Storage           | Firebase Storage                   | Store audio/images          |
| Pronunciation: TTS/STT        | Browser/Mobile API, Firebase       | Store pronunciation scores  |
| AI Chat/Help                  | **Groq API**, browser TTS          | Store chat logs             |
| Reading Practice              | Browser/Mobile STT, Firestore      | Store reading, feedback     |
| Admin Panel                   | React/Vue/Retool/JetAdmin (free)   | CRUD for content/users      |

---

_This roadmap and feature list is designed for maximum compatibility with Firebase and the easiest, most cost-effective development path possible in 2025, now featuring Groq API for AI conversational features._