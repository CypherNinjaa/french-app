# French Learning App Features Documentation

_Last Updated: 2025-07-05_

---

## 1. User Authentication & Profiles

### Authentication Methods

### User Profile Features

- Profile creation and customization
- Learning level, progress tracking, and history
- Custom settings (notifications, theme preferences)

**Easy Implementation:**

---

## 2. Module-Based Learning System

### Module Structure

**Priority: Phase 3 - Week 1**

- Hierarchical content organization: Module → Lessons → Exercises
- Progressive difficulty levels (beginner → intermediate → advanced)
- Unlocking system: complete previous module to unlock next
- Progress tracking and visual indicators

### Module Components

Each module contains:

- Multiple lessons (5-10 per module)
- Vocabulary sets (20-30 words per module)
- Grammar topics (1-2 key concepts per module)
- Pronunciation practice (integrated with lessons)
- **End-of-module test** (admin sets pass threshold, default 65%)

**Implementation Features:**

- Module cards with progress visualization
- Estimated completion time display
- Difficulty level indicators
- Module prerequisites and unlocking logic

---

## 3. Lesson Content

### Lesson Types

**Priority: Phase 3 - Week 1**

- **Conversation lessons**: Practical dialogues and situational French
- **Grammar lessons**: Structured explanation with examples
- **Vocabulary lessons**: Word introduction with usage context
- **Pronunciation lessons**: Audio-focused with playback practice
- **Culture lessons**: French culture and context understanding

**Features to implement:**

- Rich text content rendering (markdown support)
- Audio playback integration
- Interactive exercises within lessons
- Key phrases highlighting and extraction
- Progress tracking per lesson type

---

## 4. Vocabulary Learning

### Vocabulary Features

**Priority: Phase 3 - Week 3**

- Word lists per module (20-30 words each)
- Word categorization (noun, verb, adjective, etc.)
- Gender marking for French nouns (masculine/feminine)
- Usage examples in context sentences
- Audio pronunciation for each word
- English translations and definitions

### Vocabulary Practice

**Implementation Approach:**

- **Flashcard Interface**: Simple card-based review system
- **Spaced Repetition**: Track word difficulty and review frequency
- **Audio Integration**: Web Speech API for pronunciation playback
- **Progress Tracking**: Words learned, mastery levels, review schedule
- **Interactive Exercises**:
  - Matching French words to English
  - Fill-in-the-blank with vocabulary
  - Audio recognition practice

---

## 5. Grammar Learning

- Explanation of grammar rules
- Examples, comparison with English

---

## 6. Pronunciation System

### Pronunciation Playback (Text-to-Speech)

#### Free API Options:

### User Pronunciation Practice (Speech-to-Text)

- **Cloud:** [OpenAI Whisper API](https://openai.com/research/whisper) (not free, but high accuracy)
- **Google Cloud Speech-to-Text**: Limited free quota, pay-as-you-go after that.

---

## 7. Two-Way Communication: AI Chat & Pronunciation Help

### AI Chat Feature (using **Groq API**)

- User can send a word/phrase (text or voice).
- AI can provide feedback, explanations, and correct pronunciation (using TTS and STT as above).
- For speech evaluation, use STT to get user’s text, and compare to expected phrase.

---

## 8. Reading Practice With Pronunciation Feedback

- **Cloud:** [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text) (small free tier)
- **OpenAI Whisper:** High accuracy, but not free

**Implementation Tips:**

- Compare original and transcribed text in-app; highlight mismatches.
- Optionally, use Groq API to provide reading feedback, suggestions, or corrections based on the result.

---

## 9. Assessment System

**Priority: Phase 3 - Week 2**

- End-of-module tests, configurable pass threshold (default 65%)
- Multiple question types: multiple choice, fill-in-blank, matching
- Immediate feedback with explanations
- Unlock next module on pass
- Progress tracking and score history
- Adaptive difficulty based on performance

**Implementation Features:**

- Quiz component with timer
- Question randomization
- Score calculation and persistence
- Retry mechanism for failed attempts
- Progress integration with module unlocking

---

## 10. Admin Panel

- Add/edit modules, lessons, vocabulary, grammar, tests
- Set passing thresholds per module
- Manage users, view progress

---

## 12. Offline Capabilities

- Cache lessons/audio for offline use
- Sync progress when online

---

## Example: How to Implement Reading Practice Feature

- Show list of mistakes; offer to replay correct pronunciation (using TTS).
- Optionally, use Groq API to generate personalized feedback or encouragement.

---

## Example: How to Implement AI Chat with Groq

- Use TTS to read out the answer.
- If user sends a voice message, use STT, then send recognized text to Groq.

---

## API Quick Links

- **OpenAI Whisper (Speech-to-Text):**  
  [API Docs](https://platform.openai.com/docs/guides/speech-to-text) (not free after trial)

---

---

## Summary Table

| Feature                            | Priority    | Phase   | Complexity | Dependencies        |
| ---------------------------------- | ----------- | ------- | ---------- | ------------------- |
| **User Authentication & Profiles** | ✅ Complete | Phase 1 | Medium     | Supabase Auth       |
| **Module-Based Learning System**   | 🎯 Next     | Phase 3 | High       | Database schema     |
| **Lesson Content & Player**        | 🎯 Next     | Phase 3 | High       | Module system       |
| **Assessment System**              | 🎯 Next     | Phase 3 | Medium     | Lesson completion   |
| **Vocabulary Learning**            | 🎯 Next     | Phase 3 | Medium     | Audio APIs          |
| **Grammar Learning**               | 📅 Future   | Phase 4 | Medium     | Content management  |
| **AI Chat (Groq API)**             | 📅 Future   | Phase 4 | High       | External APIs       |
| **Pronunciation Practice**         | 📅 Future   | Phase 4 | High       | Speech APIs         |
| **Reading Practice**               | 📅 Future   | Phase 5 | High       | STT/TTS integration |
| **Admin Panel**                    | 📅 Future   | Phase 5 | High       | Role management     |
| **Offline Capabilities**           | 📅 Future   | Phase 6 | High       | Service workers     |

### Phase 3 Focus Areas:

1. **Week 1**: Module & Lesson System - Core learning experience
2. **Week 2**: Assessment & Progress - Validation and progression
3. **Week 3**: Vocabulary & Polish - Enhanced learning tools

### Key Success Metrics for Phase 3:

- ✅ Complete learning flow from module selection to completion
- ✅ Real French learning content (3+ modules)
- ✅ Progress tracking and module unlocking
- ✅ Basic vocabulary practice with audio
- ✅ Quiz system with scoring and feedback
