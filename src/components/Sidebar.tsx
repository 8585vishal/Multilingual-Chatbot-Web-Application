import { Conversation } from '../lib/supabase';
import { Plus, MessageSquare, X } from 'lucide-react';

type SidebarProps = {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
};

export const Sidebar = ({
  conversations,
  currentConversation,
  onSelectConversation,
  onNewConversation,
  isOpen,
  onClose,
  isDarkMode,
}: SidebarProps) => {
  const bgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`${bgClass} border-r ${borderClass} w-80 flex flex-col fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b ${borderClass} flex items-center justify-between">
          <h2 className="font-semibold text-lg">Conversations</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={onNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    onSelectConversation(conversation);
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    currentConversation?.id === conversation.id
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : hoverClass
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{conversation.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(conversation.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
