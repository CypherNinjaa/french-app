# French Learning App Features Documentation

*Last Updated: 2025-07-05*

## 1. User Authentication & Profiles

### Authentication Methods
- Email and password login
- Google account login
- Apple account login (for iOS)
- Anonymous login with later account creation option

### User Profile Features
- Profile creation and customization
- Learning level assessment
- Progress tracking dashboard
- Learning history
- Custom settings (notifications, theme preferences)

## 2. Module-Based Learning System

### Module Structure
- Sequential unlocking system based on progress
- Clear visual representation of locked/unlocked modules
- Module difficulty levels (Beginner, Elementary, Intermediate, Advanced)
- Module completion status tracking

### Module Components
Each module contains:
- Multiple lessons
- Vocabulary sets
- Grammar explanations
- Pronunciation practice
- End-of-module assessment test

### Module Progression
- Configurable passing threshold per module (default 65%)
- Multiple test attempts allowed
- Progress saving for partially completed modules
- Visual progress indicators

## 3. Lesson Content

### Lesson Types
- Introduction lessons
- Conversation-based lessons
- Situational lessons (restaurant, shopping, travel)
- Cultural context lessons
- Review lessons

### Lesson Components
- Rich text content with formatting
- Embedded images and icons
- Audio playback for examples
- Interactive examples
- Key phrases and expressions
- Practice exercises

## 4. Vocabulary Learning

### Vocabulary Features
- Word lists per module/lesson
- Word categorization (nouns, verbs, adjectives, etc.)
- Gender indication for nouns
- Usage examples
- Audio pronunciation
- Difficulty marking

### Vocabulary Practice
- Flashcard system
- Word-to-definition matching
- Definition-to-word matching
- Contextual usage practice
- Custom vocabulary lists

## 5. Grammar Learning

### Grammar Features
- Explanation of grammar rules
- Visual examples and tables
- Comparison with English grammar
- Common exceptions highlighted
- Progressive complexity across modules

### Grammar Practice
- Fill-in-the-blank exercises
- Sentence construction
- Error identification
- Tense conjugation practice
- Rule application in context

## 6. Pronunciation System

### Pronunciation Features
- Text-to-speech for all vocabulary and phrases
- Phonetic breakdowns of difficult words
- French pronunciation rules explained
- Regional accent variations (optional)

### Pronunciation Practice
- Listen and repeat exercises
- Word stress and intonation guidance
- Minimal pairs practice
- Connected speech practice

## 7. Assessment System

### Test Features
- End-of-module comprehensive tests
- Configurable passing threshold (default 65%)
- Multiple question types:
  - Multiple choice
  - Fill in the blank
  - Matching
  - Reordering
  - Short answer
- Timed or untimed test options
- Immediate feedback option

### Test Analysis
- Detailed score breakdown
- Strength/weakness identification
- Mistake review
- Focused review recommendations

## 8. Admin Panel

### User Management
- User list with search and filter
- User progress monitoring
- Manual level adjustment
- Account status management
- Usage statistics

### Content Management
- Module creation and editing
- Lesson content creation with rich text editor
- Vocabulary management
- Grammar content creation
- Test creation and configuration

### System Configuration
- Module unlock requirements
- Test passing thresholds
- Default settings management
- Feature toggling

### Analytics Dashboard
- User engagement metrics
- Content effectiveness analytics
- Test performance statistics
- Module completion rates
- User retention data

## 9. Firebase Integration

### Authentication
```javascript
// Firebase Authentication implementation
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

// Sign up function
const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// Sign in function
const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};
```

### Firestore Database
```javascript
// Firestore data structure examples
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, query, where } from "firebase/firestore";

const db = getFirestore();

// User profile data structure
const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, "users", userId), {
      displayName: userData.displayName,
      email: userData.email,
      createdAt: new Date(),
      currentModule: 1,
      completedModules: [],
      testResults: [],
      isAdmin: false,
      ...userData
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

// Get user's current module progress
const getUserProgress = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return {
        currentModule: userDoc.data().currentModule,
        completedModules: userDoc.data().completedModules,
        testResults: userDoc.data().testResults
      };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error getting user progress:", error);
    throw error;
  }
};

// Update user module progress after test
const updateModuleProgress = async (userId, moduleId, testScore, passed) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    const testResult = {
      moduleId,
      score: testScore,
      passed,
      attemptCount: 1,
      lastAttemptDate: new Date()
    };
    
    // Check if this is a retake
    const existingTestIndex = userData.testResults.findIndex(
      test => test.moduleId === moduleId
    );
    
    if (existingTestIndex >= 0) {
      // Update existing test result
      userData.testResults[existingTestIndex].score = testScore;
      userData.testResults[existingTestIndex].passed = passed;
      userData.testResults[existingTestIndex].attemptCount += 1;
      userData.testResults[existingTestIndex].lastAttemptDate = new Date();
    } else {
      // Add new test result
      userData.testResults.push(testResult);
    }
    
    // Update completed modules if passed
    if (passed && !userData.completedModules.includes(moduleId)) {
      userData.completedModules.push(moduleId);
      
      // Move to next module if this was the current one
      if (userData.currentModule === parseInt(moduleId)) {
        userData.currentModule = parseInt(moduleId) + 1;
      }
    }
    
    await updateDoc(userRef, {
      testResults: userData.testResults,
      completedModules: userData.completedModules,
      currentModule: userData.currentModule
    });
    
    return {
      updatedTestResults: userData.testResults,
      completedModules: userData.completedModules,
      currentModule: userData.currentModule
    };
  } catch (error) {
    console.error("Error updating module progress:", error);
    throw error;
  }
};
```

### Cloud Storage
```javascript
// Firebase Storage for audio files
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

// Upload pronunciation audio
const uploadPronunciationAudio = async (moduleId, wordId, audioBlob) => {
  try {
    const storageRef = ref(storage, `pronunciation/${moduleId}/${wordId}.mp3`);
    await uploadBytes(storageRef, audioBlob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading audio:", error);
    throw error;
  }
};

// Get pronunciation audio URL
const getPronunciationAudio = async (moduleId, wordId) => {
  try {
    const storageRef = ref(storage, `pronunciation/${moduleId}/${wordId}.mp3`);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error getting audio URL:", error);
    throw error;
  }
};
```

## 10. Offline Capabilities

### Offline Data Access
- Cached lessons for offline viewing
- Offline vocabulary practice
- Progress syncing when back online
- Downloaded audio files for offline pronunciation practice

### Data Syncing
- Efficient delta syncing when reconnecting
- Background synchronization
- Conflict resolution for simultaneous edits

## 11. User Experience Features

### Learning Tools
- Note-taking capability
- Content bookmarking
- Search functionality across all content
- Dark/light mode
- Font size adjustment

### Notifications
- Learning reminders
- New content notifications
- Test result notifications
- Module unlocking notifications

## 12. Performance Optimization

### Firebase Optimizations
- Efficient data structuring to minimize reads/writes
- Batch operations for multiple updates
- Pagination for large data sets
- Indexing for common queries
- Caching strategies for frequently accessed content

### Content Delivery
- Lazy loading of module content
- Progressive loading of media
- Compressed assets
- Image optimization

## Implementation Schedule

### Phase 1: Core Features (Weeks 1-4)
- User authentication
- Basic profile management
- Module system foundation
- Initial content structure
- Admin panel basics

### Phase 2: Learning Content (Weeks 5-8)
- Full lesson implementation
- Vocabulary system
- Grammar content
- Pronunciation with TTS
- Basic assessment system

### Phase 3: Assessment & Progress (Weeks 9-12)
- Complete module testing system
- Progress tracking
- Module unlocking logic
- User dashboard
- Content management for admins

### Phase 4: Polish & Launch (Weeks 13-16)
- UI/UX refinement
- Performance optimization
- Content expansion
- Testing and debugging
- Launch preparations