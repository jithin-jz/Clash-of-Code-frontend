import React, { memo } from 'react';

const ConsolePane = ({ output, loading }) => {
    if (loading) {
         return (
            <div className="flex-1 flex flex-col bg-[#0a0a0a] border-t border-white/10 animate-pulse">
                <div className="px-4 py-2 border-b border-white/10 bg-[#1a1a1a]">
                    <div className="h-3 w-24 bg-white/10 rounded-md"></div>
                </div>
                <div className="flex-1 p-4">
                     <div className="h-3 w-48 bg-white/5 rounded-md"></div>
                </div>
            </div>
         );
    }
    return (
        <div className="flex-1 flex flex-col bg-[#0a0a0a] border-t border-white/10">
            <div className="px-4 py-2 border-b border-white/10 bg-[#1a1a1a]">
                <span className="text-xs font-bold text-gray-500 uppercase">Console Output</span>
            </div>
            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto font-['Fira_Code']">
                {output.length === 0 && <span className="text-gray-600 italic">Run your code to see output...</span>}
                {output.map((line, i) => (
                    <div key={i} className={`mb-1 ${line.type === 'error' ? 'text-red-400' : 'text-gray-300'}`}>
                        {line.type === 'error' ? '❌ ' : '> '}
                        {line.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default memo(ConsolePane);
