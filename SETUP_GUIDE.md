# Quick Setup Guide

This guide will help you get the multilingual chatbot up and running in under 15 minutes.

## Step 1: Get Your API Keys

### 1.1 Supabase Setup
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Wait for project initialization
4. Go to Project Settings > API
5. Copy your:
   - Project URL
   - Anon/Public Key

### 1.2 OpenAI Setup
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key immediately (you won't see it again!)
6. Add billing method to your account

### 1.3 Google Translate Setup (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Cloud Translation API
4. Create credentials (API Key)
5. Copy the API key

**Alternative**: Use LibreTranslate (free, no API key needed)

## Step 2: Configure Environment

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your keys:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
VITE_GOOGLE_TRANSLATE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxx
VITE_LIBRE_TRANSLATE_URL=https://libretranslate.com
```

## Step 3: Database Setup

The database schema is already created via the migration. The following tables exist:
- `users` - User accounts and preferences
- `conversations` - Chat conversations
- `messages` - Individual messages
- `app_settings` - Configuration
- `canned_responses` - Pre-set responses
- `analytics_events` - Usage tracking

No additional setup needed!

## Step 4: Install and Run

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

## Step 5: Test Your Setup

### Test Authentication
1. Click "Sign Up"
2. Enter email, password, and display name
3. Click "Sign Up" button
4. You should be logged in automatically

### Test Chat
1. You'll see an empty chat interface
2. Click "New Chat" to start
3. Type a message in any language (e.g., "Hello")
4. Bot should respond in the same language

### Test Language Detection
Try these sample messages:

**English:**
```
Hello, how can you help me today?
```

**Hindi:**
```
नमस्ते, आप कैसे हैं?
```

**Spanish:**
```
¡Hola! ¿Cómo estás?
```

**French:**
```
Bonjour! Comment allez-vous?
```

**Tamil:**
```
வணக்கம்! நீங்கள் எப்படி இருக்கிறீர்கள்?
```

**German:**
```
Hallo! Wie geht es dir?
```

### Test Language Selector
1. Click the flag icon in the top right
2. Select a different language
3. Type a message
4. Bot should respond in the selected language

### Test Voice (Optional)
1. Click the microphone icon
2. Allow browser microphone access
3. Speak a message
4. Your speech should be converted to text

## Troubleshooting

### Build Errors

**"Cannot find module '@supabase/supabase-js'"**
```bash
npm install @supabase/supabase-js
```

**TypeScript errors**
```bash
npm run typecheck
```

### Runtime Errors

**"Missing Supabase environment variables"**
- Check your `.env` file exists
- Verify variable names start with `VITE_`
- Restart the dev server after adding variables

**"OpenAI API error"**
- Verify API key is correct
- Check you have billing enabled
- Ensure you have credits available
- Fallback responses will show if API fails

**"Translation failed"**
- Check Google Translate API key
- Verify API is enabled in Google Cloud
- Switch to LibreTranslate in app settings

**Voice not working**
- Use HTTPS (required for Web Speech API)
- Grant microphone permissions
- Try Chrome or Edge browser
- Check browser console for errors

### Database Issues

**"Row Level Security policy violation"**
- Ensure user is logged in
- Check RLS policies in Supabase dashboard
- Verify authentication state

**"Failed to fetch conversations"**
- Check Supabase URL and anon key
- Verify tables exist in database
- Check browser network tab for errors

## Production Deployment

### Environment Variables
Set these in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`
- `VITE_GOOGLE_TRANSLATE_API_KEY` (optional)

### Build Command
```bash
npm run build
```

### Output Directory
```
dist/
```

### Supported Platforms
- Vercel
- Netlify
- Cloudflare Pages
- AWS Amplify
- Any static hosting service

## Optional Features

### Enable Admin Dashboard

To access admin features, you'll need to modify the RLS policies to allow specific users admin access, or create a separate admin authentication flow.

For now, you can view the admin dashboard UI by accessing the `AdminDashboard` component directly.

### Embed Widget on Your Website

1. Build your project:
```bash
npm run build
```

2. Upload `dist/widget.js` to your domain

3. Edit `widget.js` and update configuration:
```javascript
const WIDGET_CONFIG = {
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_ANON_KEY',
  position: 'bottom-right',
  primaryColor: '#2563eb',
};
```

4. Add to any website:
```html
<script src="https://your-domain.com/widget.js"></script>
```

## Next Steps

1. **Customize Branding**: Edit colors in `tailwind.config.js`
2. **Add More Languages**: Follow instructions in `README.md`
3. **Improve Prompts**: Edit system prompts in `chatService.ts`
4. **Add Analytics**: Integrate your preferred analytics service
5. **Custom Responses**: Add canned responses via database

## Support

- Read full documentation: `README.md`
- Test cases and examples: `test-cases.md`
- Report issues on GitHub

---

Happy chatting! 🌍💬
