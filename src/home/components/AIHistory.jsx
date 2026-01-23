import React, { memo } from 'react';
import { Sparkles, Bot, Code2, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AIHistory = ({ 
    history, 
    loading, 
    error, 
    messagesEndRef 
}) => {
    return (
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
    );
};

export default memo(AIHistory);
