import { create } from "zustand";
import api from "../services/api";

// We use the 'api' instance which might need a custom endpoint for AI 
// if it's not under /api. But per our architecture, AI is at /api/ai.
// The services/api.js `aiAPI` helper uses VITE_AI_URL which is http://localhost/api/ai
// So we should use that.

import { aiAPI } from "../services/api";

const useAIStore = create((set, get) => ({
  // State
  history: [], // Array of { prompt: string, response: string, timestamp: Date }
  loading: false,
  error: null,

  // Actions
  generateExplanation: async (code, language = "python") => {
    set({ loading: true, error: null });
    try {
      // Construct prompt
      const prompt = `Explain this ${language} code:\n\n${code}`;
      
      const response = await aiAPI.generate(prompt);
      const result = response.data;
      
      const explanation = result.explanation || result.result || "No response";

      set((state) => ({
        loading: false,
        history: [
            { 
                prompt: code, 
                response: explanation, 
                timestamp: new Date() 
            },
            ...state.history
        ]
      }));

      return explanation;
    } catch (error) {
      console.error("AI Error:", error);
      set({ 
        loading: false, 
        error: error.response?.data?.detail || "Failed to generate explanation" 
      });
      throw error;
    }
  },

  generateHint: async (taskDescription, code, language = "python") => {
    set({ loading: true, error: null });
    try {
        const prompt = `Task: ${taskDescription}\n\nUser Code:\n${code}\n\nProvide a helpful hint to solve the task without giving the full solution. Focus on logic and algorithm.`;
        
        const response = await aiAPI.generate(prompt);
        const result = response.data;
        const hint = result.explanation || result.result || "No hint generated.";

        set({ loading: false });
        // We don't add hints to the main history to keep it clean, or we could? 
        // For now, let's just return it and let the component handle display.
        return hint;
    } catch (error) {
        console.error("AI Hint Error:", error);
        set({ 
            loading: false, 
            error: error.response?.data?.detail || "Failed to generate hint" 
        });
        throw error;
    }
  },

  clearHistory: () => set({ history: [] })
}));

export default useAIStore;
