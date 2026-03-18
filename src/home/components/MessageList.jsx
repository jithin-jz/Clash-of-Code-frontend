import React, { memo, useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  MessageCircle,
  User,
  Edit,
  Trash2,
  Check,
  X,
  Pin,
  Smile,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const REACTION_EMOJIS = ["👍", "🔥", "😂", "❤️", "🎉", "💯"];

const ChatAvatar = ({ isOwn, avatarUrl, username }) => {
  const [hasError, setHasError] = useState(false);
  const showPlaceholder = !avatarUrl || hasError;

  return (
    <div className="w-full h-full relative group">
      {avatarUrl && !hasError && (
        <img
          src={avatarUrl}
          alt={username}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setHasError(true)}
        />
      )}
      {showPlaceholder && (
        <div
          className={`w-full h-full flex items-center justify-center text-[10px] font-black tracking-tighter ${
            isOwn ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
          }`}
        >
          {username?.charAt(0).toUpperCase() || <User size={12} />}
        </div>
      )}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-full" />
    </div>
  );
};

// Render message text with @mentions highlighted
const RenderMessage = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/(@\w+)/g);
  return (
    <p className="break-words font-medium">
      {parts.map((part, i) =>
        part.startsWith("@") ? (
          <Link
            key={i}
            to={`/profile/${part.slice(1)}`}
            className="text-amber-400 hover:text-amber-300 font-bold transition-colors"
          >
            {part}
          </Link>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  );
};

// Reaction display & picker
const ReactionBar = ({ reactions, onReact, username }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    if (showPicker) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPicker]);

  const hasReactions = reactions && Object.keys(reactions).length > 0;

  return (
    <div className="flex items-center gap-1 flex-wrap mt-1 relative">
      {hasReactions &&
        Object.entries(reactions).map(([emoji, users]) => (
          <button
            key={emoji}
            onClick={() => onReact(emoji)}
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] border transition-all ${
              users.includes(username)
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10"
            }`}
            title={users.join(", ")}
          >
            <span>{emoji}</span>
            <span className="font-mono text-[9px]">{users.length}</span>
          </button>
        ))}
      <div className="relative" ref={pickerRef}>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-5 h-5 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-400 hover:bg-white/5 transition-all"
          title="Add reaction"
        >
          <Smile size={10} />
        </button>
        <AnimatePresence>
          {showPicker && (
            <Motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              className="absolute bottom-7 left-0 z-50 flex gap-1 p-1.5 bg-[#111] border border-[#222] rounded-lg shadow-xl"
            >
              {REACTION_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact(emoji);
                    setShowPicker(false);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-sm"
                >
                  {emoji}
                </button>
              ))}
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MessageList = ({
  user,
  messages,
  viewportHeight,
  editMessage,
  deleteMessage,
  toggleReaction,
  pinMessage,
}) => {
  const scrollRef = React.useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const handleEditInit = (msg) => {
    setEditingMsgId(msg.timestamp);
    setEditContent(msg.message);
  };

  const handleEditSave = (timestamp) => {
    if (editContent.trim()) {
      editMessage(timestamp, editContent);
    }
    setEditingMsgId(null);
  };

  const handleDelete = (timestamp) => {
    deleteMessage(timestamp);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
    }
  }, [messages, shouldScrollToBottom, viewportHeight]);

  useEffect(() => {
    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 150);
    return () => clearTimeout(timer);
  }, [user]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldScrollToBottom(isAtBottom);
  };

  const userMetadata = useMemo(() => {
    const map = {};
    messages.forEach((msg) => {
      if (msg.user_id) {
        map[msg.user_id] = {
          username: msg.username,
          avatar_url: msg.avatar_url,
        };
      }
    });
    return map;
  }, [messages]);

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-[#03070c]">
        <Motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mb-8"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 shadow-[0_0_40px_rgba(0,175,155,0.15)] relative z-10">
            <Lock size={32} className="text-primary" />
          </div>
          <div className="absolute -inset-6 bg-primary/10 rounded-full blur-[40px] opacity-50" />
        </Motion.div>

        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">
          Secure Forge
        </h3>
        <p className="text-neutral-500 text-sm mb-8 max-w-[240px] leading-relaxed font-medium">
          The inner circle is restricted. Authenticate to join the real-time
          transmission.
        </p>

        <Link
          to="/login"
          className="px-8 py-3.5 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-95 shadow-[0_10px_30px_rgba(0,175,155,0.3)]"
        >
          Initiate Access
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar bg-transparent scroll-smooth"
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-white/[0.03] rounded-3xl flex items-center justify-center mb-5 border border-white/[0.06] shadow-inner">
            <MessageCircle size={28} className="text-neutral-700" />
          </div>
          <p className="text-neutral-400 text-sm font-bold uppercase tracking-widest">
            Quiet in the forge
          </p>
          <p className="text-neutral-600 text-[10px] mt-2 font-mono uppercase tracking-tighter">
            Waiting for transmission...
          </p>
        </div>
      )}

      {messages.map((msg, idx) => {
        const isOwn = msg.user_id === user?.id;
        const metadata = userMetadata[msg.user_id] || {
          username: msg.username,
          avatar_url: msg.avatar_url,
        };

        const apiURL = import.meta.env.VITE_API_URL || "http://localhost/api";
        const baseUrl = apiURL.replace("/api", "");
        const formattedAvatar = (() => {
          const rawUrl = isOwn
            ? user?.profile?.avatar_url
            : metadata.avatar_url;
          if (!rawUrl) return null;
          if (rawUrl.startsWith("http")) return rawUrl;
          return `${baseUrl}${rawUrl}`;
        })();

        return (
          <Motion.div
            key={idx}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex gap-3.5 ${isOwn ? "flex-row-reverse" : "flex-row"} group`}
          >
            {/* Avatar */}
            <Link
              to={`/profile/${metadata.username}`}
              className={`relative shrink-0 w-7 h-7 rounded-full overflow-hidden border transition-all duration-300 shadow-sm ${
                isOwn
                  ? "border-emerald-500/20 hover:border-emerald-500"
                  : "border-white/5 hover:border-white/20"
              }`}
            >
              <ChatAvatar
                isOwn={isOwn}
                avatarUrl={formattedAvatar}
                username={metadata.username}
              />
            </Link>

            {/* Message Content */}
            <div
              className={`flex flex-col gap-1 max-w-[80%] ${isOwn ? "items-end" : "items-start"}`}
            >
              {/* Username & Time */}
              <div
                className={`flex items-center gap-1.5 px-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
              >
                <Link
                  to={`/profile/${metadata.username}`}
                  className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${
                    isOwn
                      ? "text-emerald-500/70 hover:text-emerald-500"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {isOwn ? "You" : metadata.username}
                </Link>
                <span className="text-[8px] font-mono text-neutral-700 tracking-tighter">
                  {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
              </div>

              {/* Message Bubble & Actions */}
              <div
                className={`flex items-start gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`
                    relative px-2.5 py-1.5 text-[11px] leading-normal transition-all duration-300 rounded-lg shrink-0 max-w-full
                    ${
                      isOwn
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-100 rounded-tr-sm"
                        : "bg-[#161616] border border-[#222] text-neutral-300 rounded-tl-sm hover:bg-[#1a1a1a]"
                    }
                    ${msg.message?.startsWith("IMAGE:") ? "p-1" : ""}
                  `}
                >
                  {msg.message?.startsWith("IMAGE:") ? (
                    (() => {
                      const [imageUrl, ownerUsername] = msg.message
                        .replace("IMAGE:", "")
                        .split("|");
                      return (
                        <div className="space-y-2">
                          <Link
                            to={`/profile/${ownerUsername}`}
                            className="block overflow-hidden rounded-lg border border-white/5 shadow-lg"
                          >
                            <img
                              src={imageUrl}
                              alt=""
                              className="w-full h-auto"
                            />
                          </Link>
                          <div className="flex items-center justify-between px-1 py-0.5">
                            <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-600">
                              Transmission
                            </p>
                            <Link
                              to={`/profile/${ownerUsername}`}
                              className="text-[8px] font-bold uppercase tracking-widest text-emerald-500 hover:underline"
                            >
                              Verify
                            </Link>
                          </div>
                        </div>
                      );
                    })()
                  ) : editingMsgId === msg.timestamp ? (
                    <div className="flex flex-col gap-2 relative z-50">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="bg-black/40 border border-emerald-500/50 rounded px-2 py-1.5 text-emerald-100 outline-none w-full min-w-[200px]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditSave(msg.timestamp);
                          if (e.key === "Escape") setEditingMsgId(null);
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingMsgId(null)}
                          className="text-white/50 hover:text-white p-1 bg-black/50 rounded"
                        >
                          <X size={12} />
                        </button>
                        <button
                          onClick={() => handleEditSave(msg.timestamp)}
                          className="text-emerald-500 hover:text-emerald-400 p-1 bg-black/50 rounded"
                        >
                          <Check size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <RenderMessage text={msg.message} />
                  )}
                </div>

                {/* Action Buttons (visible on hover) */}
                {editingMsgId !== msg.timestamp && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 pt-0.5">
                    {isOwn && (
                      <>
                        <button
                          onClick={() => handleEditInit(msg)}
                          className="text-neutral-600 hover:text-emerald-500 transition-colors p-1 rounded hover:bg-white/5"
                          title="Edit"
                        >
                          <Edit size={11} />
                        </button>
                        <button
                          onClick={() => handleDelete(msg.timestamp)}
                          className="text-neutral-600 hover:text-red-500 transition-colors p-1 rounded hover:bg-white/5"
                          title="Delete"
                        >
                          <Trash2 size={11} />
                        </button>
                      </>
                    )}
                    {user?.is_admin && (
                      <button
                        onClick={() => pinMessage(msg.timestamp, msg.message)}
                        className="text-neutral-600 hover:text-amber-400 transition-colors p-1 rounded hover:bg-white/5"
                        title="Pin message"
                      >
                        <Pin size={11} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Reaction Bar */}
              <ReactionBar
                reactions={msg.reactions}
                onReact={(emoji) => toggleReaction(msg.timestamp, emoji)}
                username={user?.username}
              />
            </div>
          </Motion.div>
        );
      })}
      <div className="h-4 w-full shrink-0" />
    </div>
  );
};

export default memo(MessageList);
