import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Send,
  Paperclip,
  Mic,
  Globe,
  Plus,
  Menu,
  LogOut,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
import { Message, Conversation } from '../lib/supabase';
import {
  sendChatMessage,
  createConversation,
  getConversations,
  getMessages,
} from '../services/chatService';
import { LANGUAGE_NAMES, LANGUAGE_FLAGS } from '../services/languageService';
import { MessageBubble } from './MessageBubble';
import { Sidebar } from './Sidebar';

export const ChatInterface = () => {
  const { user, signOut, updateUserProfile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (currentConversation) {
      loadMessages();
    }
  }, [currentConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    if (!user) return;
    try {
      const convos = await getConversations(user.id);
      setConversations(convos);
      if (convos.length > 0 && !currentConversation) {
        setCurrentConversation(convos[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async () => {
    if (!currentConversation) return;
    try {
      const msgs = await getMessages(currentConversation.id);
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewConversation = async () => {
    if (!user) return;
    try {
      const newConvo = await createConversation(user.id, user.preferred_language);
      setConversations([newConvo, ...conversations]);
      setCurrentConversation(newConvo);
      setMessages([]);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentConversation || !user) return;

    const userMessageText = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      const assistantMessage = await sendChatMessage(
        currentConversation.id,
        userMessageText,
        user.preferred_language
      );

      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    if (!user) return;
    try {
      await updateUserProfile({ preferred_language: lang });
      setShowLanguageMenu(false);
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!user) return null;

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`flex h-screen ${bgClass} ${textClass}`}>
      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={setCurrentConversation}
        onNewConversation={handleNewConversation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isDarkMode={isDarkMode}
      />

      <div className="flex-1 flex flex-col">
        <header className={`${cardBgClass} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} px-4 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="font-semibold">Multilingual Chat</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentConversation?.title || 'No conversation'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="text-xl">
                  {LANGUAGE_FLAGS[user.preferred_language]}
                </span>
                <span className="text-sm font-medium hidden sm:inline">
                  {LANGUAGE_NAMES[user.preferred_language]}
                </span>
              </button>

              {showLanguageMenu && (
                <div className={`absolute right-0 mt-2 ${cardBgClass} rounded-lg shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} py-2 min-w-[200px] z-10`}>
                  {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => handleLanguageChange(code)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <span className="text-xl">{LANGUAGE_FLAGS[code]}</span>
                      <span className="text-sm">{name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={signOut}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold mb-2">
                  Start a conversation
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Send a message in any supported language
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isDarkMode={isDarkMode}
              />
            ))
          )}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className={`${cardBgClass} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Paperclip className="w-5 h-5 text-gray-500" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className={`flex-1 px-4 py-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />

            <button
              type="button"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Mic className="w-5 h-5 text-gray-500" />
            </button>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
