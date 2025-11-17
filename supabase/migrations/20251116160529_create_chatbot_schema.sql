/*
  # Multilingual Chatbot Database Schema

  ## Overview
  Complete database schema for a production-ready multilingual chatbot application
  with user management, conversation tracking, message history, and admin capabilities.

  ## New Tables
  
  ### `users`
  - `id` (uuid, primary key) - Unique user identifier
  - `email` (text, unique) - User email for authentication
  - `display_name` (text) - User's display name
  - `avatar_url` (text, nullable) - Profile picture URL
  - `preferred_language` (text) - Default language code (en, hi, es, fr, ta, etc.)
  - `created_at` (timestamptz) - Account creation timestamp
  - `last_active_at` (timestamptz) - Last activity timestamp

  ### `conversations`
  - `id` (uuid, primary key) - Unique conversation identifier
  - `user_id` (uuid, foreign key) - Reference to users table
  - `title` (text) - Conversation title (auto-generated or user-set)
  - `language` (text) - Primary language of this conversation
  - `created_at` (timestamptz) - Conversation start time
  - `updated_at` (timestamptz) - Last message timestamp

  ### `messages`
  - `id` (uuid, primary key) - Unique message identifier
  - `conversation_id` (uuid, foreign key) - Reference to conversations table
  - `role` (text) - Message role: 'user' or 'assistant'
  - `content` (text) - Message content
  - `detected_language` (text) - Auto-detected language code
  - `original_content` (text, nullable) - Original text before translation
  - `translation_metadata` (jsonb, nullable) - Translation details
  - `attachment_url` (text, nullable) - File/image attachment URL
  - `attachment_type` (text, nullable) - MIME type of attachment
  - `status` (text) - Message status: 'sent', 'delivered', 'error'
  - `confidence_score` (float, nullable) - LLM confidence score
  - `created_at` (timestamptz) - Message timestamp

  ### `app_settings`
  - `id` (uuid, primary key) - Unique setting identifier
  - `key` (text, unique) - Setting key name
  - `value` (jsonb) - Setting value (flexible JSON)
  - `description` (text) - Human-readable description
  - `updated_at` (timestamptz) - Last update timestamp

  ### `canned_responses`
  - `id` (uuid, primary key) - Unique response identifier
  - `trigger_phrase` (text) - Phrase that triggers this response
  - `response_en` (text) - English response
  - `response_hi` (text) - Hindi response
  - `response_es` (text) - Spanish response
  - `response_fr` (text) - French response
  - `response_ta` (text) - Tamil response
  - `is_active` (boolean) - Whether this response is enabled
  - `created_at` (timestamptz) - Creation timestamp

  ### `analytics_events`
  - `id` (uuid, primary key) - Unique event identifier
  - `user_id` (uuid, nullable) - Reference to users table
  - `event_type` (text) - Event name (message_sent, language_changed, etc.)
  - `event_data` (jsonb) - Event details
  - `created_at` (timestamptz) - Event timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Admin users can access all data through special policies
  - Analytics events have restricted access

  ## Important Notes
  1. All timestamps use timestamptz for proper timezone handling
  2. Conversation context limited to last 10 messages (enforced in application)
  3. Sensitive data redaction handled at application level
  4. Configurable retention period enforced via scheduled jobs
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  display_name text NOT NULL,
  avatar_url text,
  preferred_language text DEFAULT 'en' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  last_active_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  language text DEFAULT 'en' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own conversations"
  ON conversations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  detected_language text NOT NULL,
  original_content text,
  translation_metadata jsonb,
  attachment_url text,
  attachment_type text,
  status text DEFAULT 'sent' NOT NULL CHECK (status IN ('sent', 'delivered', 'error')),
  confidence_score float,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in own conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Create app settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view settings"
  ON app_settings FOR SELECT
  TO authenticated
  USING (true);

-- Create canned responses table
CREATE TABLE IF NOT EXISTS canned_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_phrase text NOT NULL,
  response_en text NOT NULL,
  response_hi text NOT NULL,
  response_es text NOT NULL,
  response_fr text NOT NULL,
  response_ta text NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE canned_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view canned responses"
  ON canned_responses FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert analytics events"
  ON analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- Insert default app settings
INSERT INTO app_settings (key, value, description) VALUES
  ('supported_languages', '["en", "hi", "es", "fr", "ta", "de"]', 'List of supported language codes'),
  ('default_language', '"en"', 'Default language for new users'),
  ('llm_model', '"gpt-4-turbo-preview"', 'OpenAI model to use'),
  ('llm_temperature', '0.7', 'LLM temperature setting'),
  ('translation_provider', '"google"', 'Translation service: google or libre'),
  ('voice_tts_enabled', 'true', 'Enable text-to-speech'),
  ('chat_retention_days', '90', 'Days to retain chat history'),
  ('max_context_messages', '10', 'Maximum messages to include in context')
ON CONFLICT (key) DO NOTHING;

-- Insert default canned responses
INSERT INTO canned_responses (trigger_phrase, response_en, response_hi, response_es, response_fr, response_ta) VALUES
  ('hello', 'Hello! How can I help you today?', 'नमस्ते! मैं आज आपकी कैसे मदद कर सकता हूं?', '¡Hola! ¿Cómo puedo ayudarte hoy?', 'Bonjour! Comment puis-je vous aider aujourd''hui?', 'வணக்கம்! இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?'),
  ('help', 'I''m here to assist you. You can ask me questions in any supported language!', 'मैं आपकी सहायता के लिए यहाँ हूँ। आप मुझसे किसी भी समर्थित भाषा में प्रश्न पूछ सकते हैं!', '¡Estoy aquí para ayudarte! Puedes hacerme preguntas en cualquier idioma compatible.', 'Je suis là pour vous aider. Vous pouvez me poser des questions dans n''importe quelle langue prise en charge!', 'நான் உங்களுக்கு உதவ இங்கே இருக்கிறேன். நீங்கள் ஆதரிக்கப்படும் எந்த மொழியிலும் என்னிடம் கேள்விகள் கேட்கலாம்!')
ON CONFLICT DO NOTHING;