import React, { useEffect, useRef, useState, useCallback } from 'react';
import useChatStore from '../stores/useChatStore';
import useAuthStore from '../stores/useAuthStore';
import { MessageSquare, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

// Subcomponents
import ChatInput from './components/ChatInput';
import MessageList from './components/MessageList';

const ChatDrawer = ({ isChatOpen, setChatOpen, user }) => {
    // ... refs and state ...
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const pickerRef = useRef(null);
    
    // Use global store
    const { 
        messages, 
        onlineCount, 
        isConnected, 
        connect, 
        sendMessage: sendStoreMessage 
    } = useChatStore();

    const [inputMessage, setInputMessage] = useState("");
    const [showPicker, setShowPicker] = useState(false);

    // Auto-focus input when chat opens
    useEffect(() => {
        if (isChatOpen && user && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 100);
        }
    }, [isChatOpen, user]);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowPicker(false);
            }
        };

        if (showPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showPicker]);

    /* ----------------------------- scroll logic ----------------------------- */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /* --------------------------- websocket connect --------------------------- */
    useEffect(() => {
        if (isChatOpen && user) {
            const token = localStorage.getItem("access_token");
            if (token) {
                // Connect using store
                connect(token);
            }
        } 
        
        return () => {
             // Optional: disconnect on unmount 
        };
    }, [isChatOpen, user, connect]);

    // Handle Auth Error (Token Expiry)
    const { error, connect: reconnect } = useChatStore();
    useEffect(() => {
        if (error === "Authentication failed" && isChatOpen && user) {
            // Attempt to refresh token by triggering an auth check
            // which uses the interceptor to refresh if needed
            useAuthStore.getState().checkAuth().then(() => {
                const newToken = localStorage.getItem("access_token");
                if (newToken) {
                    reconnect(newToken);
                }
            });
        }
    }, [error, isChatOpen, user, reconnect]);

    /* ----------------------------- send message ------------------------------ */
    const sendMessage = useCallback((content = null) => {
        const messageToSend = content || inputMessage.trim();
        if (!messageToSend || !isConnected) return;

        sendStoreMessage(messageToSend);
        
        if (!content) setInputMessage(""); // Clear input only if sending text
        setShowPicker(false);
    }, [inputMessage, isConnected, sendStoreMessage]);


    return (
        <motion.div 
            className="fixed top-0 left-0 h-full z-40 w-[360px]"
            initial={{ x: "-100%" }}
            animate={{ x: isChatOpen ? 0 : "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="w-full h-full bg-[#0a0a0a]/95 backdrop-blur-3xl border-r border-white/10 flex flex-col pointer-events-auto shadow-2xl relative">
                
                {/* Header */}
                <div className="h-20 border-b border-white/5 flex items-center justify-between px-6 bg-[#121212]/50">
                    <div>
                        <span className="text-white font-black text-xl tracking-tight block">Global Chat</span>
                        <span className="text-[#FFD700] text-xs font-bold uppercase tracking-widest opacity-80">Live Feed</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                        <span className="text-green-400 text-xs font-bold">{onlineCount} Online</span>
                    </div>
                </div>

                {/* Messages Area */}
                <MessageList 
                    user={user}
                    messages={messages}
                    setChatOpen={setChatOpen}
                    messagesEndRef={messagesEndRef}
                />

                {/* Input Area */}
                <ChatInput 
                    user={user}
                    inputMessage={inputMessage}
                    setInputMessage={setInputMessage}
                    sendMessage={sendMessage}
                    showPicker={showPicker}
                    setShowPicker={setShowPicker}
                    inputRef={inputRef}
                    pickerRef={pickerRef}
                />

                {/* Toggle Button */}
                <Button
                    onClick={() => setChatOpen(!isChatOpen)}
                    className="absolute top-1/2 -right-12 -mt-10 w-12 h-20 bg-[#0a0a0a] border-y border-r border-[#FFD700]/30 rounded-r-2xl flex items-center justify-center shadow-2xl pointer-events-auto hover:bg-[#151515] hover:border-[#FFD700] transition-all group z-50 rounded-l-none"
                    style={{ filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.2))" }}
                >
                    {isChatOpen ? (
                        <ChevronLeft className="text-[#FFD700] drop-shadow-md" size={24} strokeWidth={3} />
                    ) : (
                        <MessageSquare className="text-[#FFD700] drop-shadow-md" size={24} strokeWidth={3} />
                    )}
                </Button>
            </div>
        </motion.div>
    );
};

export default ChatDrawer;
