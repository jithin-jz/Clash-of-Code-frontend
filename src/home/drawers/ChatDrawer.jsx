import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import { X, MessageSquare, Users, Sparkles, Send } from "lucide-react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import useChatStore from "../../stores/useChatStore";
import ChatInput from "../components/ChatInput";
import MessageList from "../components/MessageList";

const ChatDrawer = ({ isOpen, setOpen, user }) => {
  const { messages, sendMessage, onlineCount, connect } = useChatStore();
  const [showPicker, setShowPicker] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  const pickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const inputRef = useRef(null);
  const drawerRef = useRef(null);

  // Close picker on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        showPicker &&
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        !emojiButtonRef.current.contains(e.target)
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPicker]);

  // Visual Viewport API for flexible mobile heights (prevents keyboard hiding input)
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      const vh = window.visualViewport.height;
      setViewportHeight(vh);
      const isVisible = vh < window.innerHeight * 0.85;
      setIsKeyboardVisible(isVisible);
    };

    window.visualViewport.addEventListener("resize", handleResize);
    window.visualViewport.addEventListener("scroll", handleResize);
    return () => {
      window.visualViewport.removeEventListener("resize", handleResize);
      window.visualViewport.removeEventListener("scroll", handleResize);
    };
  }, []);

  // Connect to websocket when drawer is open
  useEffect(() => {
    if (isOpen) {
      connect();
    }
    // We don't disconnect immediately on close to keep history/messages
    // and because users might toggle it frequently.
  }, [isOpen, connect]);

  const handleSendMessage = useCallback((content) => {
    sendMessage(content);
    setShowPicker(false);
  }, [sendMessage]);

  // Removed unread/markRead logic as it's not in the store yet
  // If needed, it should be implemented in useChatStore first.

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (Glass) */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setOpen(false);
              setShowPicker(false);
            }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
          />

          {/* Drawer Wrapper (Flexible Height Control) */}
          <Motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              height: isKeyboardVisible ? `${viewportHeight}px` : "100dvh",
              bottom: 0,
            }}
            className="fixed right-0 z-[60] w-full max-w-[440px] bg-[#03070c] shadow-2xl flex flex-col border-l border-white/[0.08]"
          >
            {/* Glossy Header */}
            <header className="relative shrink-0 h-14 bg-[#0a0f18]/95 backdrop-blur-2xl flex items-center justify-between px-6 border-b border-white/[0.08] group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center relative overflow-hidden">
                  <MessageSquare size={18} className="text-primary animate-pulse" />
                  <div className="absolute inset-0 bg-primary/20 blur-xl opacity-20" />
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-widest text-white uppercase font-sans">
                    Live Forge
                  </h2>
                  <div className="flex items-center gap-1.5 leading-none mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,175,155,0.6)]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {onlineCount || 0} online
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </header>

            {/* Messages Area - Constrained for scrolling */}
            <main className="flex-1 min-h-0 relative flex flex-col bg-[#03070c]">
              {/* Ambient background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

              <div className="relative z-10 flex-1 min-h-0 h-full">
                <MessageList user={user} messages={messages} viewportHeight={viewportHeight} />
              </div>
            </main>

            {/* Input Hook */}
            <div className="shrink-0 relative z-20">
              <ChatInput
                user={user}
                sendMessage={handleSendMessage}
                showPicker={showPicker}
                setShowPicker={setShowPicker}
                inputRef={inputRef}
                pickerRef={pickerRef}
                emojiButtonRef={emojiButtonRef}
              />
            </div>

            {/* Safety padding for non-keyboard mobile states */}
            {!isKeyboardVisible && <div className="h-safe sm:h-0 bg-[#03070c]" />}
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default memo(ChatDrawer);
