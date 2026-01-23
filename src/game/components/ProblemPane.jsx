import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';

const ProblemPane = ({ 
    activeTab, 
    setActiveTab, 
    challenge, 
    hint, 
    aiLoading, 
    onGetHint,
    id,
    loading
}) => {
    if (loading) {
        return (
            <div className="w-1/3 bg-[#121212] flex flex-col border-b border-white/10 animate-pulse">
                 <div className="flex border-b border-white/10">
                     <div className="flex-1 py-3 bg-white/5 mx-1 my-1 rounded-sm"></div>
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
            {/* Tabs */}
            <div className="flex border-b border-white/10">
                <button 
                    onClick={() => setActiveTab('task')}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'task' ? 'text-white border-b-2 border-purple-500 bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Task
                </button>
                <button 
                    onClick={() => setActiveTab('ai')}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'ai' ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-500/5' : 'text-gray-500 hover:text-purple-400/70'}`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Sparkles size={14} /> AI Hints
                    </div>
                </button>
            </div>

            <div className="h-1/2 overflow-y-auto relative">
                {activeTab === 'task' ? (
                    <div className="p-6">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Task Description</h2>
                            <div className="prose prose-invert prose-sm">
                               <ReactMarkdown>{challenge.description}</ReactMarkdown>
                            </div>
                    </div>
                ) : (
                    <div className="p-6 flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto mb-4">
                            {!hint ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                                    <Bot size={48} className="text-purple-500/30 mb-4" />
                                    <p className="text-gray-400 text-sm max-w-[200px]">
                                        Stuck? Ask the AI for a hint based on your current code.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-3 text-purple-400 font-bold text-xs uppercase tracking-wider">
                                        <Sparkles size={12} /> AI Hint
                                    </div>
                                    <div className="prose prose-invert prose-sm text-sm text-gray-200">
                                        <ReactMarkdown>{hint}</ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <Button 
                            onClick={onGetHint}
                            disabled={aiLoading}
                            className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/20 border-0"
                        >
                            {aiLoading ? (
                                <><Loader2 className="animate-spin w-4 h-4 mr-2" /> Analyzing Code...</>
                            ) : (
                                <><Sparkles className="w-4 h-4 mr-2" /> Get Hint (10 XP)</>
                            )}
                        </Button>
                    </div>
                )}
            </div>
            {/* Console Pane is sibling in parent, not child here */}
        </div>
    );
};

export default memo(ProblemPane);
