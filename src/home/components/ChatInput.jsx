import React, { memo } from 'react';
import { Send, Smile, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const ChatInput = ({ 
    user, 
    sendMessage, 
    showPicker, 
    setShowPicker, 
    inputRef, 
    pickerRef 
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
        <div className="p-4 bg-[#121212]/50 border-t border-white/5 backdrop-blur-md relative">
            {/* Emoji Picker */}
            {showPicker && (
                <div 
                    ref={pickerRef}
                    className="absolute bottom-full left-0 w-full p-4 mb-2 z-50 animate-in fade-in zoom-in-95 duration-200"
                >
                    <div className="bg-[#1a1a1a] rounded-xl border border-white/10 shadow-2xl overflow-hidden h-[400px] flex">
                        <EmojiPicker 
                            onEmojiClick={handleEmojiClick}
                            theme="dark"
                            width="100%"
                            height="100%"
                            lazyLoadEmojis={true}
                            previewConfig={{ showPreview: false }}
                        />
                    </div>
                </div>
            )}

            <div className="flex gap-3">
                <Button 
                    variant="ghost"
                    onClick={() => setShowPicker(!showPicker)}
                    disabled={!user}
                    className={`p-3 rounded-xl transition-all ${showPicker ? 'bg-[#FFD700] text-black' : 'bg-black/40 text-gray-400 hover:text-[#FFD700] hover:bg-black/60'} disabled:opacity-50 border border-white/10 h-auto w-auto`}
                >
                    {showPicker ? <X size={20} /> : <Smile size={20} />}
                </Button>
                
                <Input 
                    ref={inputRef}
                    type="text" 
                    placeholder={user ? "Type a message..." : "Login to chat..."} 
                    disabled={!user}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-black/40 border-white/10 rounded-xl px-4 py-6 text-white text-sm focus-visible:ring-[#FFD700]/50 focus-visible:bg-black/60 transition-all disabled:opacity-50 placeholder-gray-600" 
                />
                <Button 
                    disabled={!user} 
                    onClick={handleSend}
                    className="bg-[#FFD700] hover:bg-[#FDB931] text-black p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg shadow-yellow-900/20 h-auto w-auto"
                >
                    <Send size={18} />
                </Button>
            </div>
        </div>
    );
};

export default memo(ChatInput);
