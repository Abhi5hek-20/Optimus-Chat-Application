import { MessageCircleIcon } from "lucide-react";

function ChatLoader() {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-base-100">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <MessageCircleIcon className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="mt-6 text-center space-y-2">
        <p className="text-lg font-semibold text-base-content">Connecting to chat...</p>
        <p className="text-sm text-base-content/70">Setting up your secure conversation</p>
      </div>
      <div className="mt-8 flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}

export default ChatLoader;