import { Message } from '../lib/supabase';
import { User, Bot, CheckCheck, Clock } from 'lucide-react';

type MessageBubbleProps = {
  message: Message;
  isDarkMode: boolean;
};

export const MessageBubble = ({ message, isDarkMode }: MessageBubbleProps) => {
  const isUser = message.role === 'user';
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}>
      {!isUser && (
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      )}

      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : isDarkMode
            ? 'bg-gray-700 text-gray-100 rounded-bl-sm'
            : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

        {message.attachment_url && (
          <div className="mt-2">
            {message.attachment_type?.startsWith('image/') ? (
              <img
                src={message.attachment_url}
                alt="Attachment"
                className="rounded-lg max-w-full"
              />
            ) : (
              <a
                href={message.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline"
              >
                View attachment
              </a>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-1 mt-1">
          <span
            className={`text-xs ${
              isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {time}
          </span>
          {isUser && (
            <span>
              {message.status === 'delivered' ? (
                <CheckCheck className="w-3 h-3 text-blue-100" />
              ) : (
                <Clock className="w-3 h-3 text-blue-100" />
              )}
            </span>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
      )}
    </div>
  );
};
