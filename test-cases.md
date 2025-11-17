# Test Cases for Multilingual Chatbot

This document contains comprehensive test cases for all six supported languages with sample conversations and expected behaviors.

## Test Setup

Before running tests:
1. Ensure all environment variables are configured
2. Database migrations have been applied
3. OpenAI API key is valid
4. Translation service is accessible

## 1. English (en) Test Cases

### Test Case 1.1: Basic Greeting
**Input (User):**
```
Hello! How are you today?
```

**Expected Detection:** English (en)

**Expected Response Pattern:**
- Friendly greeting in English
- Offer to help
- Natural conversational tone

**Sample Response:**
```
Hello! I'm doing great, thank you for asking! I'm here to help you with any questions or tasks you might have. How can I assist you today?
```

### Test Case 1.2: Technical Question
**Input (User):**
```
Can you explain what machine learning is?
```

**Expected Detection:** English (en)

**Expected Response Pattern:**
- Clear explanation of machine learning
- Concise but informative
- Educational tone

### Test Case 1.3: Context Continuation
**Context:** Previous message about weather

**Input (User):**
```
What about tomorrow?
```

**Expected Behavior:**
- Uses conversation context
- Understands "tomorrow" refers to weather
- Provides relevant follow-up

## 2. Hindi (हिन्दी) Test Cases

### Test Case 2.1: Basic Greeting
**Input (User):**
```
नमस्ते! आप कैसे हैं?
```

**Expected Detection:** Hindi (hi)

**Expected Response Pattern:**
- Response entirely in Hindi
- Uses Devanagari script
- Culturally appropriate greeting

**Sample Response:**
```
नमस्ते! मैं बहुत अच्छा हूँ, धन्यवाद! मैं आपकी सहायता के लिए यहाँ हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?
```

### Test Case 2.2: Asking for Help
**Input (User):**
```
मुझे मदद चाहिए। आप क्या कर सकते हैं?
```

**Expected Detection:** Hindi (hi)

**Expected Response Pattern:**
- Lists capabilities in Hindi
- Helpful and friendly tone
- Natural Hindi phrasing

### Test Case 2.3: Mixed Script Detection
**Input (User):**
```
मैं learn करना चाहता हूं about technology
```

**Expected Detection:** Hindi (hi) - due to predominant Devanagari

**Expected Behavior:**
- Responds primarily in Hindi
- May acknowledge code-switching
- Maintains conversation flow

## 3. Spanish (Español) Test Cases

### Test Case 3.1: Basic Greeting
**Input (User):**
```
¡Hola! ¿Cómo estás?
```

**Expected Detection:** Spanish (es)

**Expected Response Pattern:**
- Response entirely in Spanish
- Uses proper Spanish punctuation (¡!)
- Friendly and welcoming

**Sample Response:**
```
¡Hola! Estoy muy bien, gracias por preguntar. Estoy aquí para ayudarte con cualquier cosa que necesites. ¿En qué puedo asistirte hoy?
```

### Test Case 3.2: Information Request
**Input (User):**
```
¿Puedes explicarme cómo funciona la inteligencia artificial?
```

**Expected Detection:** Spanish (es)

**Expected Response Pattern:**
- Detailed explanation in Spanish
- Uses technical terms appropriately
- Clear and educational

### Test Case 3.3: Formal vs Informal
**Input (User - Formal):**
```
¿Podría usted ayudarme con un problema?
```

**Expected Detection:** Spanish (es)

**Expected Behavior:**
- Recognizes formal register
- Responds with appropriate formality
- Uses "usted" if user used it

## 4. French (Français) Test Cases

### Test Case 4.1: Basic Greeting
**Input (User):**
```
Bonjour! Comment allez-vous?
```

**Expected Detection:** French (fr)

**Expected Response Pattern:**
- Response entirely in French
- Uses proper accents (é, è, ê, etc.)
- Polite and professional

**Sample Response:**
```
Bonjour! Je vais très bien, merci! Je suis là pour vous aider avec tout ce dont vous avez besoin. Comment puis-je vous assister aujourd'hui?
```

### Test Case 4.2: Complex Question
**Input (User):**
```
Quelle est la différence entre l'apprentissage supervisé et non supervisé?
```

**Expected Detection:** French (fr)

**Expected Response Pattern:**
- Technical explanation in French
- Proper use of French terminology
- Clear distinction between concepts

### Test Case 4.3: Accent Handling
**Input (User - Missing accents):**
```
Je ne comprends pas. Pouvez-vous expliquer?
```

**Expected Detection:** French (fr)

**Expected Behavior:**
- Still detects as French
- Responds with proper accents
- Maintains conversation quality

## 5. Tamil (தமிழ்) Test Cases

### Test Case 5.1: Basic Greeting
**Input (User):**
```
வணக்கம்! நீங்கள் எப்படி இருக்கிறீர்கள்?
```

**Expected Detection:** Tamil (ta)

**Expected Response Pattern:**
- Response entirely in Tamil script
- Culturally appropriate greeting
- Friendly tone

**Sample Response:**
```
வணக்கம்! நான் நன்றாக இருக்கிறேன், கேட்டதற்கு நன்றி! உங்களுக்கு உதவ நான் இங்கே இருக்கிறேன். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?
```

### Test Case 5.2: Question About Services
**Input (User):**
```
நீங்கள் என்ன செய்ய முடியும்? உங்கள் திறன்கள் என்ன?
```

**Expected Detection:** Tamil (ta)

**Expected Response Pattern:**
- Lists capabilities in Tamil
- Uses proper Tamil terminology
- Clear and informative

### Test Case 5.3: Technical Topic
**Input (User):**
```
செயற்கை நுண்ணறிவு பற்றி விளக்க முடியுமா?
```

**Expected Detection:** Tamil (ta)

**Expected Response Pattern:**
- Technical explanation in Tamil
- Uses appropriate technical vocabulary
- Educational and accessible

## 6. German (Deutsch) Test Cases

### Test Case 6.1: Basic Greeting
**Input (User):**
```
Hallo! Wie geht es dir?
```

**Expected Detection:** German (de)

**Expected Response Pattern:**
- Response entirely in German
- Uses proper German characters (ä, ö, ü, ß)
- Friendly and helpful

**Sample Response:**
```
Hallo! Mir geht es sehr gut, danke der Nachfrage! Ich bin hier, um dir bei allem zu helfen, was du brauchst. Wie kann ich dir heute helfen?
```

### Test Case 6.2: Formal Request
**Input (User):**
```
Können Sie mir bitte bei einem Problem helfen?
```

**Expected Detection:** German (de)

**Expected Response Pattern:**
- Recognizes formal "Sie" form
- Maintains formal register in response
- Professional and courteous

### Test Case 6.3: Compound Words
**Input (User):**
```
Was ist der Unterschied zwischen Künstlicher Intelligenz und maschinellem Lernen?
```

**Expected Detection:** German (de)

**Expected Response Pattern:**
- Handles compound words correctly
- Uses proper German technical terms
- Clear explanation with examples

## 7. Cross-Language Test Cases

### Test Case 7.1: Language Switching
**Conversation Flow:**
1. User: "Hello, how are you?" (English)
2. Bot: Responds in English
3. User: "Ahora vamos a hablar en español" (Now let's speak in Spanish)
4. Bot: Switches to Spanish

**Expected Behavior:**
- Detects language change
- Seamlessly switches language
- Maintains conversation context

### Test Case 7.2: Manual Language Override
**Steps:**
1. User types in Hindi
2. User clicks language selector
3. User selects Spanish
4. User continues conversation

**Expected Behavior:**
- Bot responds in Spanish regardless of input language
- User preference saved
- Consistent language until changed

### Test Case 7.3: Mixed Language Input
**Input (User):**
```
I want to say merci beaucoup for your help
```

**Expected Detection:** English (en) - majority of words

**Expected Behavior:**
- Responds in English
- May acknowledge French phrase
- Natural conversation flow

## 8. Voice Input/Output Tests

### Test Case 8.1: Voice Recognition - English
**Action:**
1. Click microphone button
2. Speak: "What is the weather like today?"

**Expected Behavior:**
- Text appears in input field
- Message sent automatically or on confirmation
- Accurate speech-to-text conversion

### Test Case 8.2: Voice Recognition - Hindi
**Action:**
1. Ensure language set to Hindi
2. Click microphone button
3. Speak: "आज मौसम कैसा है?"

**Expected Behavior:**
- Hindi text recognized correctly
- Proper Devanagari script displayed
- Message processed normally

### Test Case 8.3: Text-to-Speech
**Action:**
1. Receive bot response
2. System reads response aloud (if enabled)

**Expected Behavior:**
- Natural voice in correct language
- Proper pronunciation
- Clear audio quality

## 9. Error Handling Tests

### Test Case 9.1: Low Confidence Response
**Input (User):**
```
skjfhskdjfh random text 12345
```

**Expected Behavior:**
- Bot recognizes unclear input
- Provides fallback message: "I'm not sure I understand. Could you try rephrasing that?"
- In user's preferred language

### Test Case 9.2: API Failure
**Scenario:** OpenAI API is unavailable

**Expected Behavior:**
- Fallback response shown
- No crash or error screen
- Graceful degradation

### Test Case 9.3: Translation Service Failure
**Scenario:** Translation API is unavailable

**Expected Behavior:**
- Falls back to alternative provider
- Or responds in English with notice
- Conversation continues

## 10. Context and Memory Tests

### Test Case 10.1: Context Retention
**Conversation:**
1. User: "Tell me about Paris"
2. Bot: [Information about Paris]
3. User: "What's the weather like there?"

**Expected Behavior:**
- Bot understands "there" refers to Paris
- Provides relevant weather information
- Maintains topic continuity

### Test Case 10.2: Multi-Turn Conversation
**Scenario:** 15 message conversation

**Expected Behavior:**
- Last 10 messages maintained in context
- Older messages not affecting responses
- Performance remains consistent

## 11. Admin Dashboard Tests

### Test Case 11.1: View Statistics
**Action:** Open admin dashboard

**Expected Display:**
- Total users count
- Total conversations count
- Total messages count
- All numbers accurate and updated

### Test Case 11.2: Update Settings
**Action:**
1. Change LLM temperature to 0.5
2. Click "Save Settings"

**Expected Behavior:**
- Settings saved to database
- Confirmation message shown
- New settings applied immediately

### Test Case 11.3: Toggle Voice TTS
**Action:**
1. Disable "Enable Voice TTS"
2. Save settings

**Expected Behavior:**
- TTS disabled for all users
- Microphone button still works
- Settings persist after refresh

## 12. Security Tests

### Test Case 12.1: Unauthorized Access
**Action:** Try to access another user's conversations

**Expected Behavior:**
- Access denied
- RLS policy prevents data retrieval
- No error leak of sensitive info

### Test Case 12.2: SQL Injection Attempt
**Input:**
```
'; DROP TABLE messages; --
```

**Expected Behavior:**
- Treated as regular text
- No database modification
- Parameterized queries prevent injection

## Test Execution Checklist

- [ ] All English test cases pass
- [ ] All Hindi test cases pass
- [ ] All Spanish test cases pass
- [ ] All French test cases pass
- [ ] All Tamil test cases pass
- [ ] All German test cases pass
- [ ] Cross-language switching works
- [ ] Voice input/output functional
- [ ] Error handling appropriate
- [ ] Context retention working
- [ ] Admin dashboard operational
- [ ] Security policies enforced

## Automated Testing Script

To run automated tests (requires test framework setup):

```bash
npm run test
```

For manual testing, follow each test case step-by-step and verify expected behaviors.

## Reporting Issues

When reporting test failures, include:
1. Test case number
2. Input provided
3. Expected behavior
4. Actual behavior
5. Browser/environment details
6. Screenshots if applicable

---

Last Updated: 2025-11-16
