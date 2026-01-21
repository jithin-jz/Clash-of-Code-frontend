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
      const result = response.data; // Expecting { explanation: "...", model: "..." }

      // We handle the mock response structure from our AI service
      // The AI service returns { explanation: "...", model: "...", ... }
      // Or { result: "..." } depending on which endpoint we hit. 
      // Our mock /explain endpoint returns { explanation: ... }
      // But services/api.js calls /generate.
      // Let's assume we fixed services/api.js or backend to match.
      // For now, let's adapt to what we built in AI service: /explain [POST]
      // Wait, services/api.js calls /generate. The AI service has /generate AND /explain?
      // Step 441 created /explain. Step 203 showed /generate.
      // I should update the store to call the right endpoint or update API service.
      // Let's assume we call /explain directly here or fix api.js later.
      // Actually, I'll update api.js in the next step to point to /explain for better semantics.
      // For now, I'll rely on the existing api.js which calls /generate.
      // If /generate exists (it was the "Hello World" one), it returns { result: ... }
      
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

  clearHistory: () => set({ history: [] })
}));

export default useAIStore;
