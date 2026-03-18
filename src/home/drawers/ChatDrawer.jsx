import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from "react";
import { X, Pin, MessageSquare, Map, Users, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import useChatStore from "../../stores/useChatStore";
import ChatInput from "../components/ChatInput";
import MessageList from "../components/MessageList";

const ChatDrawer = ({ isOpen, setOpen, user }) => {
  const {
    messages,
    sendMessage,
    onlineCount,
    connect,
    editMessage,
    deleteMessage,
    sendTyping,
    toggleReaction,
    pinMessage,
    unpinMessage,
    typingUsers,
    pinnedMessage,
    currentRoom,
    activeDMs,
    switchRoom,
  } = useChatStore();

  const [showPicker, setShowPicker] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [view, setView] = useState("chat"); // "chat" or "rooms"

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

  // Visual Viewport API for flexible mobile heights
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
      connect(currentRoom);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 200);
    }
  }, [isOpen, connect, currentRoom]);

  const handleSendMessage = useCallback(
    (content) => {
      sendMessage(content);
      setShowPicker(false);
    },
    [sendMessage],
  );

  // Filter out own typing indicator
  const otherTyping = typingUsers.filter((t) => t.username !== user?.username);

  const isGlobal = currentRoom === "global";
  const dmTarget = useMemo(() => {
    if (isGlobal || !currentRoom.startsWith("dm_")) return null;
    const roomIds = currentRoom.split("_").slice(1).map(Number);
    return activeDMs.find(dm => roomIds.includes(Number(dm.id)));
  }, [isGlobal, currentRoom, activeDMs]);

  const chatPlaceholder = isGlobal 
    ? "Message global chat..." 
    : (dmTarget ? `Message @${dmTarget.username}...` : "Message private chat...");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setOpen(false);
              setShowPicker(false);
            }}
            className="fixed inset-0 z-50 bg-black/20"
          />

          {/* Drawer */}
          <Motion.div
            ref={drawerRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{
              height: isKeyboardVisible ? `${viewportHeight}px` : "100dvh",
              bottom: 0,
            }}
            className="fixed left-0 z-[60] w-full md:max-w-[360px] bg-[#050505] shadow-2xl flex flex-col md:border-r border-[#1a1a1a]"
          >
            {/* Header */}
            <header className="shrink-0 h-14 flex items-center justify-between px-4 border-b border-[#1a1a1a] bg-[#0a0a0a]">
              <div className="flex items-center gap-3">
                {view === "chat" ? (
                  <button 
                    onClick={() => setView("rooms")}
                    className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
                  >
                    <Users size={14} />
                  </button>
                ) : (
                  <button 
                    onClick={() => setView("chat")}
                    className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
                  >
                    <ArrowLeft size={14} />
                  </button>
                )}

                <div className="flex flex-col">
                  {view === "chat" ? (
                    <>
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#444] uppercase font-mono">
                        {isGlobal ? "Global Chat" : `DM: ${dmTarget?.username || "Private"}`}
                      </span>
                      {isGlobal && (
                        <div className="flex items-center gap-1 leading-none">
                          <span className="w-1 h-1 rounded-full bg-emerald-500" />
                          <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-tighter">
                            {onlineCount || 0} online
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#444] uppercase font-mono">
                      Conversations
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-6 w-6 rounded-md flex items-center justify-center text-neutral-600 hover:text-white hover:bg-[#1a1a1a] transition-all"
              >
                <X size={14} />
              </button>
            </header>

            {view === "rooms" ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Global Chat Entry */}
                <button
                  onClick={() => { switchRoom("global"); setView("chat"); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${isGlobal ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10"}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isGlobal ? "bg-emerald-500/20" : "bg-neutral-800"}`}>
                    <Map size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">Global Chat</p>
                    <p className="text-[10px] opacity-60">Open to everyone</p>
                  </div>
                </button>

                {/* DM Section */}
                <div className="pt-2">
                  <h3 className="text-[10px] font-bold text-[#333] uppercase tracking-[0.2em] mb-3 px-1">Direct Messages</h3>
                  {activeDMs.length === 0 ? (
                    <div className="text-center py-8 bg-white/[0.02] rounded-2xl border border-white/5">
                      <MessageSquare size={24} className="mx-auto text-neutral-800 mb-2" />
                      <p className="text-xs text-neutral-600">No active conversations</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeDMs.map((dm) => (
                        <button
                          key={dm.id}
                          onClick={() => { switchRoom(`dm_${[user?.id, dm.id].sort((a,b)=>a-b).join("_")}`); setView("chat"); }}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${currentRoom.includes(String(dm.id)) ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10"}`}
                        >
                          <img 
                            src={dm.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dm.username}`} 
                            alt={dm.username}
                            className="w-10 h-10 rounded-xl bg-neutral-800 grayscale"
                          />
                          <div className="text-left">
                            <p className="text-sm font-bold">@{dm.username}</p>
                            <p className="text-[10px] opacity-60">Private Message</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Pinned Message Banner */}
                <AnimatePresence>
                  {isGlobal && pinnedMessage && (
                    <Motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="shrink-0 border-b border-[#1a1a1a] bg-[#0d0d0d] overflow-hidden"
                    >
                      <div className="flex items-center gap-2 px-3 py-2">
                        <Pin size={12} className="text-amber-400 shrink-0" />
                        <p className="text-[11px] text-neutral-400 truncate flex-1">
                          {pinnedMessage.message}
                        </p>
                        {user?.is_admin && (
                          <button
                            onClick={() => unpinMessage(pinnedMessage.timestamp)}
                            className="text-[9px] text-neutral-600 hover:text-red-400 transition-colors shrink-0"
                          >
                            Unpin
                          </button>
                        )}
                      </div>
                    </Motion.div>
                  )}
                </AnimatePresence>

                {/* Messages Area */}
                <main className="flex-1 min-h-0 relative flex flex-col bg-[#050505]">
                  <div className="relative z-10 flex-1 min-h-0 h-full">
                    <MessageList
                      user={user}
                      messages={messages}
                      viewportHeight={viewportHeight}
                      editMessage={editMessage}
                      deleteMessage={deleteMessage}
                      toggleReaction={toggleReaction}
                      pinMessage={pinMessage}
                    />
                  </div>
                </main>

                {/* Typing Indicator */}
                <AnimatePresence>
                  {otherTyping.length > 0 && (
                    <Motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="shrink-0 px-4 py-1 bg-[#050505]"
                    >
                      <span className="text-[10px] text-neutral-500 italic">
                        {otherTyping.length === 1
                          ? `${otherTyping[0].username} is typing...`
                          : otherTyping.length === 2
                            ? `${otherTyping[0].username} and ${otherTyping[1].username} are typing...`
                            : `${otherTyping[0].username} and ${otherTyping.length - 1} others are typing...`}
                      </span>
                    </Motion.div>
                  )}
                </AnimatePresence>

                {/* Input */}
                <div className="shrink-0 relative z-20">
                  <ChatInput
                    user={user}
                    sendMessage={handleSendMessage}
                    showPicker={showPicker}
                    setShowPicker={setShowPicker}
                    inputRef={inputRef}
                    pickerRef={pickerRef}
                    emojiButtonRef={emojiButtonRef}
                    sendTyping={sendTyping}
                    placeholder={chatPlaceholder}
                  />
                </div>
              </>
            )}

            {/* Safety padding for non-keyboard mobile states */}
            {!isKeyboardVisible && (
              <div className="h-safe sm:h-0 bg-[#050505]" />
            )}
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default memo(ChatDrawer);
