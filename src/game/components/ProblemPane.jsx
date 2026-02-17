import React, { memo } from "react";
import ReactMarkdown from "react-markdown";

const ProblemPane = ({ challenge, loading }) => {
  if (loading) {
    return (
      <div className="flex-1 bg-[#1a1a1a] flex flex-col animate-pulse">
        <div className="flex border-b border-white/10 bg-[#262626]">
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
    );
  }

  return (
    <section className="flex-1 flex flex-col bg-[#262626] overflow-hidden m-0">
      <div className="flex-1 overflow-y-auto relative custom-scrollbar p-0 bg-[#262626]">
        <div className="p-6 max-w-3xl mx-auto">
          <div
            className="prose prose-invert prose-sm max-w-none 
                        prose-headings:text-white prose-headings:font-semibold
                        prose-p:text-gray-300 prose-p:leading-relaxed
                        prose-code:text-[#66d1c3] prose-code:bg-black/25 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[13px]
                        prose-strong:text-white prose-strong:font-semibold
                        prose-ul:text-gray-300 prose-li:marker:text-gray-500
                    "
          >
            <ReactMarkdown>{challenge.description}</ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(ProblemPane);
