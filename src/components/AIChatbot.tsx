import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Send, 
  RefreshCw, 
  History, 
  ChevronRight, 
  Terminal,
  MessageSquare,
  Trash2,
  Plus
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AIChatbotProps {
  showAIChat: boolean;
  setShowAIChat: (show: boolean) => void;
  currentLang: 'vi' | 'en';
  aiMessages: any[];
  aiInput: string;
  setAiInput: (input: string) => void;
  isCheckingCode: boolean;
  sendChatMessage: (input?: string) => Promise<void>;
  checkCodeWithAI: () => Promise<void>;
  chatSessions: any[];
  currentSessionId: string;
  setCurrentSessionId: (id: string) => void;
  setChatSessions: (updater: (prev: any[]) => any[]) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({
  showAIChat,
  setShowAIChat,
  currentLang,
  aiMessages,
  aiInput,
  setAiInput,
  isCheckingCode,
  sendChatMessage,
  checkCodeWithAI,
  chatSessions,
  currentSessionId,
  setCurrentSessionId,
  setChatSessions,
  showToast
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const currentSession = chatSessions.find(s => s.id === currentSessionId);

  const startNewSession = () => {
    const newId = Date.now().toString();
    setChatSessions(prev => [...prev, {
      id: newId,
      title: currentLang === 'vi' ? 'Phiên mới' : 'New Session',
      messages: [],
      timestamp: new Date().toISOString()
    }]);
    setCurrentSessionId(newId);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      const remaining = chatSessions.filter(s => s.id !== id);
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].id);
      } else {
        const newId = Date.now().toString();
        setChatSessions(() => [{
          id: newId,
          title: currentLang === 'vi' ? 'Phiên mới' : 'New Session',
          messages: [],
          timestamp: new Date().toISOString()
        }]);
        setCurrentSessionId(newId);
      }
    }
  };

  return (
    <AnimatePresence>
      {showAIChat && (
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-[450px] bg-[#121212]/95 backdrop-blur-xl border-l border-white/5 z-[100] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 border-bottom border-white/5 flex items-center justify-between bg-gradient-to-r from-[#4c97ff]/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#4c97ff] flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">AI ASSISTANT</h3>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowAIChat(false)}
              className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all transform hover:rotate-90"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex min-h-0">
            {/* Sidebar (History) */}
            <div className="w-20 border-r border-white/5 flex flex-col items-center py-4 gap-4 bg-black/20">
              <button 
                onClick={startNewSession}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#4c97ff] text-white transition-all flex items-center justify-center group"
                title={currentLang === 'vi' ? 'Phiên chat mới' : 'New chat session'}
              >
                <Plus size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto w-full px-4 items-center scrollbar-hide">
                {chatSessions.map((session, idx) => (
                  <div key={session.id} className="relative group">
                    <button
                      onClick={() => setCurrentSessionId(session.id)}
                      className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center border font-black text-xs ${
                        currentSessionId === session.id 
                          ? 'bg-[#4c97ff]/20 border-[#4c97ff] text-[#4c97ff]' 
                          : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10 hover:text-gray-300'
                      }`}
                    >
                      {idx + 1}
                    </button>
                    {chatSessions.length > 1 && (
                      <button 
                        onClick={(e) => deleteSession(session.id, e)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                      >
                        <Trash2 size={8} className="text-white" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                {aiMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white/5 rounded-2xl border border-white/5 m-4">
                    <div className="w-16 h-16 bg-[#4c97ff]/20 rounded-2xl flex items-center justify-center mb-4">
                      <MessageSquare size={32} className="text-[#4c97ff]" />
                    </div>
                    <h4 className="text-lg font-black text-white mb-2 uppercase tracking-tight">
                      {currentLang === 'vi' ? 'Sẵn sàng hỗ trợ!' : 'Ready to help!'}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-[200px] font-medium uppercase text-[10px] tracking-widest">
                      {currentLang === 'vi' 
                        ? 'Chào bạn! Tôi có thể giúp bạn xây dựng game Roblox bằng khối lệnh.' 
                        : 'Hi! I can help you build Roblox games using blocks.'}
                    </p>
                    <div className="mt-8 grid grid-cols-1 gap-2 w-full max-w-[240px]">
                      <button 
                        onClick={() => setAiInput(currentLang === 'vi' ? 'Làm thế nào để tạo vật thể rực lửa?' : 'How to create a burning part?')}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-all border border-white/5 group"
                      >
                        <p className="text-[10px] text-[#4c97ff] font-black uppercase mb-1">Example</p>
                        <p className="text-xs text-gray-400 group-hover:text-white">Create a burning part</p>
                      </button>
                      <button 
                        onClick={() => checkCodeWithAI()}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-all border border-white/5 group"
                      >
                        <p className="text-[10px] text-[#4c97ff] font-black uppercase mb-1">Tools</p>
                        <p className="text-xs text-gray-400 group-hover:text-white">Debug current workspace</p>
                      </button>
                    </div>
                  </div>
                ) : (
                  aiMessages.map((msg, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i} 
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`p-4 rounded-2xl max-w-[90%] text-sm relative group ${
                        msg.role === 'user' 
                          ? 'bg-[#4c97ff] text-white rounded-tr-none shadow-lg shadow-blue-500/20' 
                          : 'bg-[#1a1a1a] text-gray-200 border border-white/5 rounded-tl-none'
                      }`}>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {msg.role === 'ai' && (
                             <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                               <RefreshCw size={12} />
                             </button>
                          )}
                        </div>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <Markdown
                            components={{
                              code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                  <div className="relative group/code my-4">
                                    <div className="absolute -top-3 left-4 px-2 py-0.5 bg-gray-800 text-[9px] font-black text-[#4c97ff] rounded uppercase tracking-widest border border-white/10 z-10">
                                      {match[1]}
                                    </div>
                                    <SyntaxHighlighter
                                      style={vscDarkPlus}
                                      language={match[1]}
                                      PreTag="div"
                                      className="!rounded-xl !bg-black/40 !pt-6 !border !border-white/5"
                                      {...props}
                                    >
                                      {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                  </div>
                                ) : (
                                  <code className={`${className} bg-white/10 px-1.5 py-0.5 rounded text-[#4c97ff] font-mono`} {...props}>
                                    {children}
                                  </code>
                                );
                              }
                            }}
                          >
                            {msg.content}
                          </Markdown>
                        </div>
                        <span className="text-[10px] text-white/40 font-black mt-2 block uppercase tracking-widest">
                          {msg.role === 'user' ? 'You' : 'BlockLua AI'}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-[#1a1a1a] border-t border-white/5">
                <div className="flex gap-2 mb-3 px-1 overflow-x-auto scrollbar-hide no-select">
                  <button 
                    onClick={() => sendChatMessage(currentLang === 'vi' ? 'Tiếp tục' : 'Continue')}
                    className="shrink-0 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-black rounded-full transition-all border border-white/5 uppercase tracking-widest flex items-center gap-2 group"
                  >
                    <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    {currentLang === 'vi' ? 'Tiếp tục' : 'Continue'}
                  </button>
                  <button 
                    onClick={() => checkCodeWithAI()}
                    className="shrink-0 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-black rounded-full transition-all border border-white/5 uppercase tracking-widest flex items-center gap-2 group"
                  >
                    <Terminal size={12} className="group-hover:rotate-12 transition-transform" />
                    {currentLang === 'vi' ? 'Kiểm tra lỗi' : 'Debug Code'}
                  </button>
                </div>
                <div className="relative group">
                  <textarea 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendChatMessage();
                      }
                    }}
                    placeholder={currentLang === 'vi' ? "Nhập tin nhắn..." : "Type a message..."}
                    className="w-full bg-black/40 border border-white/5 text-gray-200 text-sm rounded-2xl p-4 pr-12 focus:outline-none focus:border-[#4c97ff]/50 transition-all resize-none h-[100px] placeholder:text-gray-600 placeholder:uppercase placeholder:text-[10px] placeholder:font-black placeholder:tracking-widest"
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    {isCheckingCode ? (
                      <div className="p-2.5 bg-[#4c97ff]/20 text-[#4c97ff] rounded-xl">
                        <RefreshCw size={18} className="animate-spin" />
                      </div>
                    ) : (
                      <button 
                        onClick={() => sendChatMessage()}
                        disabled={!aiInput.trim()}
                        className={`p-2.5 rounded-xl transition-all flex items-center justify-center hover:scale-110 active:scale-95 ${
                          aiInput.trim() 
                            ? 'bg-[#4c97ff] text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-white/5 text-gray-600'
                        }`}
                      >
                        <Send size={18} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between px-1">
                  <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">
                    Gemini 3.1 Pro Preview
                  </p>
                  <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">
                    Shift + Enter for new line
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
