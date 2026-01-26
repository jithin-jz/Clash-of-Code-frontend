import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';

const ProblemPane = ({ 
    challenge, 
    loading
}) => {
    if (loading) {
        return (
            <div className="w-1/3 bg-[#121212] flex flex-col border-b border-white/10 animate-pulse">
                 <div className="flex border-b border-white/10">
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
        <div className="w-1/3 bg-[#121212] flex flex-col">
            {/* Header */}
            <div className="flex border-b border-white/10">
                <div 
                    className="flex-1 py-3 text-sm font-bold uppercase tracking-wider text-center text-white border-b-2 border-purple-500 bg-white/5"
                >
                    Task
                </div>
            </div>

            <div className="h-1/2 overflow-y-auto relative">
                <div className="p-6">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Task Description</h2>
                        <div className="prose prose-invert prose-sm">
                           <ReactMarkdown>{challenge.description}</ReactMarkdown>
                        </div>
                </div>
            </div>
            {/* Console Pane is sibling in parent, not child here */}
        </div>
    );
};

export default memo(ProblemPane);
