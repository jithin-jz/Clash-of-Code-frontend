import React, { useEffect, useRef, useState, useCallback } from "react";
import useChatStore from "../../stores/useChatStore";
import useAuthStore from "../../stores/useAuthStore";
import { MessageSquare, Users, X } from "lucide-react";
import { AnimatePresence, motion as Motion } from "framer-motion";

// Subcomponents
import ChatInput from "../components/ChatInput";
import MessageList from "../components/MessageList";

const ChatDrawer = ({ isChatOpen, setChatOpen, user }) => {
  // ... refs and state ...
  const inputRef = useRef(null);
  const pickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  const {
    messages,
    onlineCount,
    isConnected,
    error,
    connect,
    sendMessage: sendStoreMessage,
  } = useChatStore();

  const [showPicker, setShowPicker] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(typeof window !== "undefined" ? window.innerHeight - 56 : 0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Handle mobile keyboard resize using VisualViewport API
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      const currentHeight = window.visualViewport.height;
      // We subtract the header height (56px)
      setViewportHeight(currentHeight - 56);
      
      // If visible height is significantly less than window height, keyboard is probably open
      setKeyboardVisible(currentHeight < window.innerHeight * 0.85);
    };

    window.visualViewport.addEventListener("resize", handleResize);
    window.visualViewport.addEventListener("scroll", handleResize);
    handleResize();

    return () => {
      window.visualViewport.removeEventListener("resize", handleResize);
      window.visualViewport.removeEventListener("scroll", handleResize);
    };
  }, []);

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
      // Don't close if clicking on the emoji button itself
      if (
        emojiButtonRef.current &&
        emojiButtonRef.current.contains(event.target)
      ) {
        return;
      }
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  /* --------------------------- websocket connect --------------------------- */

  /* --------------------------- websocket connect --------------------------- */
  useEffect(() => {
    let timeoutId;

    if (isChatOpen && user) {
      // Slight delay to ensure state is settled
      timeoutId = setTimeout(() => {
        connect();
      }, 100);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isChatOpen, user, connect]);

  // Handle Auth Error (Token Expiry)
  useEffect(() => {
    if (error === "Authentication failed" && isChatOpen && user) {
      useAuthStore
        .getState()
        .checkAuth()
        .then(() => {
          connect();
        });
    }
  }, [error, isChatOpen, user, connect]);

  /* ----------------------------- send message ------------------------------ */
  const sendMessage = useCallback(
    (message) => {
      if (!message?.trim() || !isConnected) return;

      sendStoreMessage(message.trim());
      setShowPicker(false);
    },
    [isConnected, sendStoreMessage],
  );

  return (
    <AnimatePresence>
      {isChatOpen && (
        <Motion.div
          className="fixed top-14 left-0 z-40 w-full sm:w-[390px]"
          style={{ 
            height: window.innerWidth < 640 ? `${viewportHeight}px` : "calc(100vh - 56px)"
          }}
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className={`w-full h-full bg-linear-to-b from-[#111d30]/95 via-[#0f1b2e]/95 to-[#0c1627]/95 backdrop-blur-3xl border-r border-white/15 flex flex-col pointer-events-auto shadow-2xl shadow-black/50 relative ${isKeyboardVisible ? "pb-0" : "pb-16 sm:pb-0"}`}>
        {/* Decorative gradient orb */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-[#3b82f6]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-12 w-36 h-36 bg-[#00af9b]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative h-14 border-b border-white/10 flex items-center justify-between px-5 bg-[#111d30]/90">
          {/* Header glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#7ea3d9]/30 to-transparent" />

          <div className="flex items-center gap-3">
            <button
              onClick={() => setChatOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Chat"
            >
              <X size={18} />
            </button>
            <div className="w-8 h-8 rounded-lg bg-[#162338] border border-white/15 flex items-center justify-center">
              <MessageSquare size={15} className="text-[#00af9b]" />
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">
              Chat
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#162338] border border-white/15 rounded-lg">
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-[#00af9b] rounded-full" />
              <div className="absolute inset-0 w-1.5 h-1.5 bg-[#00af9b] rounded-full animate-ping" />
            </div>
            <Users size={12} className="text-slate-200" />
            <span className="text-slate-200 text-xs font-semibold">
              {onlineCount}
            </span>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected && !error && (
          <div className="px-4 py-2 bg-[#ffa116]/10 border-b border-[#ffa116]/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#ffa116] rounded-full animate-pulse" />
            <span className="text-[#ffa116] text-xs font-medium">
              Connecting...
            </span>
          </div>
        )}

        {/* Rate Limit / Error Banner */}
        {error && (
          <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20">
            <span className="text-red-400 text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Messages Area */}
        <MessageList
          user={user}
          messages={messages}
          setChatOpen={setChatOpen}
          viewportHeight={viewportHeight}
        />

        {/* Input Area */}
        <ChatInput
          user={user}
          sendMessage={sendMessage}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
          inputRef={inputRef}
          pickerRef={pickerRef}
          emojiButtonRef={emojiButtonRef}
        />
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatDrawer;
