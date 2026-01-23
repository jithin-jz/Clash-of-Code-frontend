import React, { memo } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';

const AIInput = ({ 
    inputCode, 
    setInputCode, 
    handleSend, 
    loading, 
    inputRef 
}) => {
    return (
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
    );
};

export default memo(AIInput);
