import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Trash2 } from 'lucide-react';
import useStore from '../store/useStore';

export default function ChatPane({ onSendMessage }) {
    const { messages, isLoading, clearChat } = useStore();
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-[500px] lg:h-full bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/60" data-testid="chat-pane">
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 p-5 text-white shadow-md relative z-10 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-3 tracking-wide">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_8px_rgba(7ade80,0.8)]"></span>
                        </span>
                        AI Architect
                    </h2>
                    <p className="text-indigo-100 text-sm mt-1 font-medium drop-shadow-sm">Describe the form you need to build</p>
                </div>
                {messages.length > 0 && (
                    <button 
                        onClick={clearChat}
                        className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-indigo-100 hover:text-white"
                        title="Clear Conversation"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>
            
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent scrollbar-custom scroll-smooth"
            >
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-fade-in-up">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center shadow-inner">
                            <span className="text-2xl">✨</span>
                        </div>
                        <p className="text-gray-500 font-medium max-w-xs">
                            Ask me to build a form! Start with something like "I need a booking form".
                        </p>
                    </div>
                )}
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`} style={{animationDelay: '50ms'}}>
                        <div className={`max-w-[85%] rounded-3xl p-4 shadow-sm transition-transform hover:-translate-y-0.5 ${
                            message.role === 'user' 
                            ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-tr-sm shadow-indigo-200/50' 
                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-gray-200/50'
                        }`}>
                            <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
                            {message.questions && (
                                <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm marker:text-indigo-400">
                                    {message.questions.map((q, i) => <li key={i}>{q}</li>)}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start animate-fade-in-up">
                        <div className="bg-white shadow-sm border border-gray-100 text-gray-800 rounded-3xl rounded-tl-sm p-4 flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                            <span className="text-gray-500 text-sm font-medium">Designing your schema...</span>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-white/50 backdrop-blur-md border-t border-gray-100/50">
                <div className="relative flex items-center group shadow-sm rounded-2xl bg-white transition-shadow focus-within:shadow-md border border-gray-200 focus-within:border-indigo-300">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full pl-5 pr-14 py-4 rounded-2xl bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all active:scale-95 shadow-sm hover:shadow-indigo-200"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
