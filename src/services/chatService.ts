import { supabase, Message, Conversation } from '../lib/supabase';
import { detectLanguage, translateText } from './languageService';

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export const sendChatMessage = async (
  conversationId: string,
  userMessage: string,
  userLanguage: string,
  attachmentUrl?: string,
  attachmentType?: string
): Promise<Message> => {
  const detectedLang = await detectLanguage(userMessage);

  const { data: userMsg, error: userMsgError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role: 'user',
      content: userMessage,
      detected_language: detectedLang,
      status: 'sent',
      attachment_url: attachmentUrl,
      attachment_type: attachmentType,
    })
    .select()
    .single();

  if (userMsgError) throw userMsgError;

  const { data: recentMessages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(10);

  const context: ChatMessage[] = (recentMessages || [])
    .reverse()
    .map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

  const assistantResponse = await generateResponse(context, userLanguage);

  const { data: assistantMsg, error: assistantMsgError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: assistantResponse.content,
      detected_language: userLanguage,
      status: 'delivered',
      confidence_score: assistantResponse.confidence,
    })
    .select()
    .single();

  if (assistantMsgError) throw assistantMsgError;

  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return assistantMsg as Message;
};

const generateResponse = async (
  context: ChatMessage[],
  userLanguage: string
): Promise<{ content: string; confidence: number }> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    return {
      content: getFallbackResponse(userLanguage),
      confidence: 0.5,
    };
  }

  try {
    const systemPrompt = getSystemPrompt(userLanguage);
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...context,
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    return {
      content: data.choices[0].message.content,
      confidence: 0.9,
    };
  } catch (error) {
    console.error('Error generating response:', error);
    return {
      content: getFallbackResponse(userLanguage),
      confidence: 0.3,
    };
  }
};

const getSystemPrompt = (language: string): string => {
  const prompts: Record<string, string> = {
    en: 'You are a helpful, friendly multilingual assistant. Respond naturally and conversationally in English. Be concise but informative.',
    hi: 'आप एक सहायक, मित्रवत बहुभाषी सहायक हैं। हिंदी में स्वाभाविक और संवादात्मक तरीके से जवाब दें। संक्षिप्त लेकिन जानकारीपूर्ण रहें।',
    es: 'Eres un asistente multilingüe útil y amigable. Responde de forma natural y conversacional en español. Sé conciso pero informativo.',
    fr: 'Vous êtes un assistant multilingue utile et amical. Répondez naturellement et de manière conversationnelle en français. Soyez concis mais informatif.',
    ta: 'நீங்கள் ஒரு உதவிகரமான, நட்பான பன்மொழி உதவியாளர். தமிழில் இயல்பாகவும் உரையாடல் முறையிலும் பதிலளிக்கவும். சுருக்கமாக ஆனால் தகவல் நிறைந்ததாக இருக்கவும்.',
    de: 'Sie sind ein hilfreicher, freundlicher mehrsprachiger Assistent. Antworten Sie natürlich und gesprächig auf Deutsch. Seien Sie prägnant, aber informativ.',
  };
  return prompts[language] || prompts.en;
};

const getFallbackResponse = (language: string): string => {
  const responses: Record<string, string> = {
    en: "I'm not sure I understand. Could you try rephrasing that?",
    hi: 'मुझे यकीन नहीं है कि मैं समझता हूं। क्या आप इसे दूसरे तरीके से कह सकते हैं?',
    es: 'No estoy seguro de entender. ¿Podrías reformularlo?',
    fr: 'Je ne suis pas sûr de comprendre. Pourriez-vous reformuler cela?',
    ta: 'எனக்கு புரிகிறதா என்று தெரியவில்லை. அதை வேறு விதமாக சொல்ல முடியுமா?',
    de: 'Ich bin nicht sicher, ob ich das verstehe. Könnten Sie das umformulieren?',
  };
  return responses[language] || responses.en;
};

export const createConversation = async (
  userId: string,
  language: string,
  title?: string
): Promise<Conversation> => {
  const conversationTitle = title || `Conversation ${new Date().toLocaleDateString()}`;

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      title: conversationTitle,
      language,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Conversation;
};

export const getConversations = async (userId: string): Promise<Conversation[]> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data as Conversation[]) || [];
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data as Message[]) || [];
};

export const deleteConversation = async (conversationId: string): Promise<void> => {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId);

  if (error) throw error;
};
