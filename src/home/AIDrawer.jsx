import React, { useEffect, useRef, useState } from 'react';
import useAIStore from '../stores/useAIStore';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles, X, Send, Bot, Loader2, Code2, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

const AIDrawer = ({ isOpen, onClose }) => {
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);
    
    // Store
    const { history, loading, error, generateExplanation, clearHistory } = useAIStore();
    
    // Local state
    const [inputCode, setInputCode] = useState("");

    // Auto-scroll to bottom of history
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history, loading]);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!inputCode.trim() || loading) return;
        
        try {
            await generateExplanation(inputCode);
            setInputCode("");
        } catch {
            // Error handled in store
        }
    };

    return (
        <motion.div 
            className="fixed top-0 right-0 h-full z-40 w-[400px] pointer-events-none"
            initial={{ x: "100%" }}
            animate={{ x: isOpen ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="w-full h-full bg-[#0a0a0a]/95 backdrop-blur-3xl border-l border-white/10 flex flex-col pointer-events-auto shadow-2xl relative">
                
                {/* Header */}
                <div className="h-20 border-b border-white/5 flex items-center justify-between px-6 bg-[#121212]/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/20">
                            <Bot className="text-white" size={24} />
                        </div>
                        <div>
                            <span className="text-white font-black text-xl tracking-tight block">AI Oracle</span>
                            <span className="text-purple-400 text-xs font-bold uppercase tracking-widest opacity-80">Code Explainer</span>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        onClick={clearHistory}
                        disabled={history.length === 0}
                        className="text-gray-400 hover:text-red-400 mr-1"
                        title="Clear History"
                    >
                        <Trash2 size={20} />
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </Button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-linear-to-b from-transparent to-black/30 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    
                    {history.length === 0 && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
                                <Sparkles size={32} className="text-purple-400" />
                            </div>
                            <p className="text-white font-bold text-lg mb-2">Ask the Oracle</p>
                            <p className="text-gray-400 text-sm mb-6 max-w-[250px]">
                                Paste any code snippet below to get an instant explanation powered by AI.
                            </p>
                        </div>
                    )}

                    {history.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                            {/* User Question */}
                            <div className="flex gap-3 justify-end">
                                <div className="max-w-[85%] bg-[#1a1a1a] border border-white/5 rounded-2xl rounded-tr-sm p-4 text-sm text-gray-300 font-mono overflow-hidden">
                                    <pre className="whitespace-pre-wrap break-words">{item.prompt}</pre>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                    <Code2 size={16} className="text-gray-400" />
                                </div>
                            </div>

                            {/* AI Response */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                                    <Bot size={16} className="text-white" />
                                </div>
                                <div className="max-w-[90%] bg-purple-500/5 border border-purple-500/20 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-200">
                                    <ReactMarkdown 
                                        className="prose prose-invert prose-sm"
                                        components={{
                                            code: ({inline, children, ...props}) => {
                                                return inline ? (
                                                    <code className="bg-black/30 px-1 py-0.5 rounded text-purple-300" {...props}>{children}</code>
                                                ) : (
                                                    <code className="block bg-black/30 p-2 rounded my-2 overflow-x-auto" {...props}>{children}</code>
                                                )
                                            }
                                        }}
                                    >
                                        {item.response}
                                    </ReactMarkdown>
                                    <div className="mt-2 text-[10px] text-purple-400/50 uppercase tracking-wider font-bold">
                                        AI Oracle • {new Date(item.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                                <Loader2 size={16} className="text-white animate-spin" />
                            </div>
                            <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[#121212]/50 border-t border-white/5 backdrop-blur-md">
                    <div className="relative">
                        <textarea
                            ref={inputRef}
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Paste your code here..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder-gray-600 min-h-[100px] resize-none font-mono"
                        />
                        <Button 
                            onClick={handleSend}
                            disabled={!inputCode.trim() || loading}
                            className={cn(
                                "absolute bottom-3 right-3 p-2 h-auto w-auto rounded-lg transition-all",
                                inputCode.trim() ? "bg-purple-600 hover:bg-purple-500 text-white" : "bg-white/5 text-gray-500"
                            )}
                        >
                            <Send size={16} />
                        </Button>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-gray-600">
                            AI may produce inaccurate information about code functionality.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AIDrawer;
