# Multilingual Chatbot Web Application

A professional, production-ready multilingual chatbot with support for 6 languages, real-time translation, voice input/output, and persistent chat history.

## Features

- **Multilingual Support**: English, Hindi, Spanish, French, Tamil, and German
- **Auto Language Detection**: Automatically detects user language and responds accordingly
- **Voice Input/Output**: Speech recognition and text-to-speech capabilities
- **Persistent Chat History**: All conversations stored securely in Supabase
- **Context-Aware Conversations**: Maintains conversation context (last 10 messages)
- **Real-time Translation**: Powered by Google Translate or LibreTranslate
- **AI-Powered Responses**: OpenAI GPT-4 integration for intelligent responses
- **User Authentication**: Secure email/password authentication via Supabase
- **Admin Dashboard**: Monitor usage statistics and configure settings
- **Embeddable Widget**: Easy integration into any website
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI/ML**: OpenAI GPT-4 API
- **Translation**: Google Translate API / LibreTranslate
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Google Translate API key (optional, can use LibreTranslate)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd multilingual-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
VITE_LIBRE_TRANSLATE_URL=https://libretranslate.com
```

### Database Setup

The database schema is automatically created via Supabase migrations. The schema includes:

- `users` - User profiles and preferences
- `conversations` - Chat conversation metadata
- `messages` - Individual chat messages
- `app_settings` - Application configuration
- `canned_responses` - Predefined responses in all languages
- `analytics_events` - Usage analytics and events

All tables have Row Level Security (RLS) enabled for data protection.

### Running the Application

#### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

#### Production Build

```bash
npm run build
npm run preview
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

3. Configure environment variables in Netlify dashboard

## Usage Guide

### User Workflow

1. **Sign Up/Sign In**: Create an account or log in
2. **Start Chatting**: Type or speak your message in any supported language
3. **Language Auto-Detection**: The bot detects your language and responds accordingly
4. **Manual Language Switch**: Use the language selector to change your preferred language
5. **Voice Input**: Click the microphone icon to speak your message
6. **View History**: Access all your past conversations from the sidebar
7. **Theme Toggle**: Switch between light and dark modes

### Admin Features

Access the admin dashboard to:

- View total users, conversations, and messages
- Configure LLM model and temperature
- Choose translation provider
- Set chat retention period
- Enable/disable voice TTS
- Adjust context message limit

## Embedding the Widget

To embed the chatbot on your website, add this script tag:

```html
<script src="https://your-domain.com/widget.js"></script>
```

Configure the widget by editing `public/widget.js`:

```javascript
const WIDGET_CONFIG = {
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_ANON_KEY',
  position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
  primaryColor: '#2563eb',
};
```

## API Integration

### Supabase Functions

The application uses Supabase's built-in features:

- **Authentication**: Email/password auth
- **Database**: PostgreSQL with real-time subscriptions
- **Storage**: File attachments (images, documents)
- **Row Level Security**: Data isolation per user

### OpenAI Integration

The chatbot uses OpenAI's Chat Completions API:

- Model: `gpt-4-turbo-preview` (configurable)
- Temperature: `0.7` (configurable)
- Context: Last 10 messages
- System prompts customized per language

### Translation Services

Two translation providers are supported:

1. **Google Translate API**: High-quality, paid service
2. **LibreTranslate**: Free, open-source alternative

## Language Support

The application supports these languages out of the box:

| Language | Code | Native Name |
|----------|------|-------------|
| English  | en   | English     |
| Hindi    | hi   | हिन्दी      |
| Spanish  | es   | Español     |
| French   | fr   | Français    |
| Tamil    | ta   | தமிழ்       |
| German   | de   | Deutsch     |

### Adding New Languages

1. Update language patterns in `src/services/languageService.ts`
2. Add language name and flag to `LANGUAGE_NAMES` and `LANGUAGE_FLAGS`
3. Add system prompt in `src/services/chatService.ts`
4. Add fallback response in `getFallbackResponse()`
5. Add voice language code in `src/services/voiceService.ts`
6. Update database settings: `supported_languages` array

## Security & Privacy

- **Authentication**: Secure Supabase Auth with bcrypt password hashing
- **Row Level Security**: Database-level access control
- **Data Encryption**: TLS/SSL for all API communications
- **PII Redaction**: Sensitive data sanitized in logs
- **Configurable Retention**: Auto-delete old conversations
- **API Key Protection**: Environment variables never exposed to client

## Testing

See `test-cases.md` for comprehensive test scenarios covering:

- User authentication flows
- Multilingual conversation handling
- Voice input/output
- Translation accuracy
- Error handling
- Admin functionality

## Troubleshooting

### Common Issues

**Voice input not working**
- Ensure you're using HTTPS (required for Web Speech API)
- Grant microphone permissions in browser
- Check browser compatibility (Chrome/Edge recommended)

**Translation errors**
- Verify API keys are correct
- Check API quotas/limits
- Switch to LibreTranslate as fallback

**OpenAI API errors**
- Verify API key is valid
- Check usage limits and billing
- Fallback responses will be shown automatically

**Database connection issues**
- Verify Supabase credentials
- Check RLS policies are enabled
- Ensure user is authenticated

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Built with ❤️ using React, Supabase, and OpenAI
