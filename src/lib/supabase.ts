import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  preferred_language: string;
  created_at: string;
  last_active_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  title: string;
  language: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  detected_language: string;
  original_content?: string;
  translation_metadata?: Record<string, unknown>;
  attachment_url?: string;
  attachment_type?: string;
  status: 'sent' | 'delivered' | 'error';
  confidence_score?: number;
  created_at: string;
};

export type AppSettings = {
  supported_languages: string[];
  default_language: string;
  llm_model: string;
  llm_temperature: number;
  translation_provider: 'google' | 'libre';
  voice_tts_enabled: boolean;
  chat_retention_days: number;
  max_context_messages: number;
};
