import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const NeuralLinkPane = ({ onGetHint, hint, isHintLoading }) => {
  return (
    <Card className="flex-1 flex flex-col bg-[#09090b] border-none rounded-none overflow-hidden m-0">
      <CardHeader className="border-b border-white/5 px-4 py-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          AI Assistant
        </CardTitle>
        {!hint && (
          <Button
            onClick={onGetHint}
            disabled={isHintLoading}
            variant="outline"
            size="sm"
            className="h-7 px-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20 hover:border-blue-500/30 text-xs font-medium rounded-md transition-all"
          >
            {isHintLoading ? (
              <Loader2 className="w-3 h-3 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-3 h-3 mr-2" />
            )}
            {isHintLoading ? "Loading..." : "Get Hint"}
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto relative custom-scrollbar p-0 bg-[#09090b]">
        {!hint && !isHintLoading && (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
            <div className="max-w-xs space-y-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto border border-blue-500/10">
                <Sparkles size={20} className="text-blue-500/60" />
              </div>
              <p className="text-gray-500 text-xs font-medium">
                Need help? Ask the AI Assistant for a hint.
              </p>
            </div>
          </div>
        )}

        {isHintLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin opacity-70" />
              <p className="text-xs font-medium text-gray-500">
                Generating Hint...
              </p>
            </div>
          </div>
        )}

        {hint && (
          <div className="p-6 max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-5">
              <div
                className="prose prose-invert prose-sm max-w-none 
                        prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-sm
                        prose-code:text-blue-300 prose-code:bg-blue-900/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs
                        prose-strong:text-white prose-strong:font-semibold
                    "
              >
                <ReactMarkdown>{hint}</ReactMarkdown>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                onClick={onGetHint}
                disabled={isHintLoading}
                variant="ghost"
                size="sm"
                className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              >
                Get another hint
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(NeuralLinkPane);
