import { create } from "zustand";
import { challengesApi } from "../services/challengesApi";

/**
 * Centralized store for challenge data management.
 * Provides caching, loading states, and reduces duplicate API calls.
 */
const useChallengesStore = create((set, get) => ({
  // State
  challenges: [],
  currentChallenge: null,
  isLoading: false,
  isLoadingChallenge: false,
  error: null,
  lastFetched: null,
  
  // Polling state
  isPollingForNewLevel: false,
  pollAttempts: 0,

  // Cache duration (5 minutes)
  CACHE_DURATION: 5 * 60 * 1000,

  /**
   * Fetch all challenges with smart caching.
   * Only refetches if cache is stale or force=true.
   */
  fetchChallenges: async (force = false) => {
    const state = get();
    const now = Date.now();

    // Use cache if valid and not forced
    if (
      !force &&
      state.lastFetched &&
      now - state.lastFetched < state.CACHE_DURATION &&
      state.challenges.length > 0
    ) {
      return state.challenges;
    }

    set({ isLoading: true, error: null });

    try {
      const data = await challengesApi.getAll();
      set({
        challenges: data,
        isLoading: false,
        lastFetched: now,
        error: null,
      });
      return data;
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
      set({
        isLoading: false,
        error: error.message || "Failed to fetch challenges",
      });
      return [];
    }
  },

  /**
   * Fetch a single challenge by slug.
   * Checks cache first before API call.
   */
  fetchChallenge: async (slug) => {
    const state = get();

    // Check if already in cache
    const cached = state.challenges.find((c) => c.slug === slug);
    if (cached && state.currentChallenge?.slug !== slug) {
      set({ currentChallenge: cached });
    }

    set({ isLoadingChallenge: true, error: null });

    try {
      const data = await challengesApi.getBySlug(slug);
      set({
        currentChallenge: data,
        isLoadingChallenge: false,
        error: null,
      });
      return data;
    } catch (error) {
      console.error("Failed to fetch challenge:", error);
      set({
        isLoadingChallenge: false,
        error: error.message || "Failed to fetch challenge",
      });
      return null;
    }
  },

  /**
   * Submit a challenge solution.
   */
  submitChallenge: async (slug, data) => {
    try {
      const result = await challengesApi.submit(slug, data);
      
      // If completed, update cache
      if (result.status === "completed" || result.status === "already_completed") {
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.slug === slug ? { ...c, status: "COMPLETED", stars: result.stars } : c
          ),
        }));
      }

      return result;
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  },

  /**
   * Start polling for a newly generated level.
   * Used after completing the last available level.
   */
  startPollingForNewLevel: (expectedOrder) => {
    const MAX_ATTEMPTS = 20;
    set({ isPollingForNewLevel: true, pollAttempts: 0 });

    const poll = async () => {
      const state = get();
      
      if (!state.isPollingForNewLevel) return;
      if (state.pollAttempts >= MAX_ATTEMPTS) {
        set({ isPollingForNewLevel: false, pollAttempts: 0 });
        return null;
      }

      set((s) => ({ pollAttempts: s.pollAttempts + 1 }));

      try {
        const data = await challengesApi.getAll();
        const newLevel = data.find((l) => l.order === expectedOrder);

        if (newLevel) {
          set({
            challenges: data,
            isPollingForNewLevel: false,
            pollAttempts: 0,
            lastFetched: Date.now(),
          });
          return newLevel;
        }
      } catch (error) {
        console.error("Polling error:", error);
      }

      // Continue polling after delay
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return poll();
    };

    return poll();
  },

  /**
   * Stop polling for new level.
   */
  stopPolling: () => {
    set({ isPollingForNewLevel: false, pollAttempts: 0 });
  },

  /**
   * Clear all cached data.
   */
  clearCache: () => {
    set({
      challenges: [],
      currentChallenge: null,
      lastFetched: null,
      error: null,
    });
  },

  /**
   * Update current challenge (for real-time updates like hints purchased).
   */
  updateCurrentChallenge: (updates) => {
    set((state) => ({
      currentChallenge: state.currentChallenge
        ? { ...state.currentChallenge, ...updates }
        : null,
    }));
  },
}));

export default useChallengesStore;
