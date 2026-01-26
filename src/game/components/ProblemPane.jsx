import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';

const ProblemPane = ({ 
    challenge, 
    loading
}) => {
    if (loading) {
        return (
            <div className="flex-1 bg-[#0a0a0a] flex flex-col animate-pulse">
                 <div className="flex border-b border-white/10 bg-[#1a1a1a]">
                     <div className="flex-1 py-3 bg-white/5 mx-1 my-1 rounded-sm"></div>
                 </div>
                 <div className="p-6 space-y-4">
                     <div className="h-4 w-32 bg-white/10 rounded-md"></div>
                     <div className="space-y-2">
                         <div className="h-3 w-full bg-white/5 rounded-md"></div>
                         <div className="h-3 w-5/6 bg-white/5 rounded-md"></div>
                         <div className="h-3 w-4/6 bg-white/5 rounded-md"></div>
                     </div>
                 </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden">
            {/* Header */}
            <div className="flex border-b border-white/10 bg-[#1a1a1a]">
                <div 
                    className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center text-white border-b-2 border-purple-500 bg-white/5"
                >
                    Task
                </div>
            </div>

            <div className="flex-1 overflow-y-auto relative custom-scrollbar">
                <div className="p-6">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Task Description</h2>
                        <div className="prose prose-invert prose-sm max-w-none">
                           <ReactMarkdown>{challenge.description}</ReactMarkdown>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ProblemPane);
