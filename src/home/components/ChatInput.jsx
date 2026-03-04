import React, { memo } from "react";
import { Send, Smile, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const ChatInput = ({
  user,
  sendMessage,
  showPicker,
  setShowPicker,
  inputRef,
  pickerRef,
  emojiButtonRef,
}) => {
  const [inputMessage, setInputMessage] = React.useState("");

  const handleSend = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInputMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="relative px-6 py-5 bg-[#03070c]/95 backdrop-blur-3xl border-t border-white/[0.08] group">
      {/* Dynamic glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-primary/30 to-transparent transition-opacity duration-500 opacity-30 group-focus-within:opacity-100" />

      {/* Emoji Picker */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-0 w-full p-4 mb-2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="bg-[#0a0f18] rounded-2xl border border-white/[0.1] shadow-2xl shadow-black/80 overflow-hidden h-[380px] flex">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme="dark"
              width="100%"
              height="100%"
              lazyLoadEmojis={true}
              previewConfig={{ showPreview: false }}
              searchDisabled={false}
              skinTonesDisabled={true}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2.5 items-center">
        {/* Emoji Button */}
        <button
          ref={emojiButtonRef}
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          disabled={!user}
          className={`flex items-center justify-center h-10 w-10 min-w-10 rounded-xl transition-all duration-300 ${showPicker
              ? "bg-accent/20 text-accent shadow-[0_0_15px_rgba(255,161,22,0.15)] ring-1 ring-accent/30"
              : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] hover:scale-105 active:scale-95"
            } disabled:opacity-20`}
        >
          {showPicker ? <X size={20} strokeWidth={2.5} /> : <Smile size={20} strokeWidth={2} />}
        </button>

        {/* Input Wrapper */}
        <div className="relative flex-1 group/input">
          <Input
            ref={inputRef}
            type="text"
            placeholder={user ? "Type a message..." : "Login to chat..."}
            disabled={!user}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="w-full bg-white/[0.03] border-white/[0.1] focus-visible:border-primary/50 focus-visible:bg-white/[0.08] rounded-2xl px-5 h-11 text-white text-[13px] transition-all duration-300 placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="absolute bottom-0 left-4 right-4 h-px bg-primary/40 scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-500 origin-center" />
        </div>

        {/* Send Button */}
        <button
          disabled={!user || !inputMessage.trim()}
          onClick={handleSend}
          className={`flex items-center justify-center h-11 w-11 min-w-11 rounded-2xl transition-all duration-300 ${inputMessage.trim()
              ? "bg-primary text-primary-foreground shadow-[0_8px_25px_rgba(0,175,155,0.4)] hover:brightness-110 active:scale-90"
              : "bg-white/[0.03] text-slate-600"
            } disabled:opacity-20 disabled:cursor-not-allowed`}
        >
          <Send size={20} strokeWidth={2.5} className={inputMessage.trim() ? "translate-x-0.5" : ""} />
        </button>
      </div>

      {/* Bottom safety margin for mobile */}
      <div className="h-2 w-full sm:hidden" />
    </div>
  );
};

export default memo(ChatInput);
