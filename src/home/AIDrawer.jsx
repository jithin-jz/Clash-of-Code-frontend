import React, { useEffect, useRef, useState } from 'react';
import useAIStore from '../stores/useAIStore';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { Bot, X, Trash2 } from 'lucide-react';

// Subcomponents
import AIInput from './components/AIInput';
import AIHistory from './components/AIHistory';

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
                    <div className="flex items-center">
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
                </div>

                {/* Content Area */}
                <AIHistory 
                    history={history}
                    loading={loading}
                    error={error}
                    messagesEndRef={messagesEndRef}
                />

                {/* Input Area */}
                <AIInput 
                    inputCode={inputCode}
                    setInputCode={setInputCode}
                    handleSend={handleSend}
                    loading={loading}
                    inputRef={inputRef}
                />
            </div>
        </motion.div>
    );
};

export default AIDrawer;
