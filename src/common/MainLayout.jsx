import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import useAuthStore from "../stores/useAuthStore";
import useChallengesStore from "../stores/useChallengesStore";
import {
    HomeTopNav,
    ChatDrawer,
    LeaderboardDrawer,
    NotificationDrawer,
    DailyCheckInModal,
    SiteFooter
} from "../home";
import { checkInApi } from "../services/checkInApi";

/**
 * MainLayout — Single persistent layout wrapping all authenticated routes.
 *
 * Performance optimisations applied:
 *  1. useShallow selectors on Zustand stores → prevents re-render when
 *     unrelated store slices change (e.g. marketplace mutations).
 *  2. useCallback on every handler → stable references for memoised children.
 *  3. React.memo on the export → avoids parent-triggered re-renders.
 *  4. Memoised hideNav / showFooter flags.
 */
const MainLayout = memo(({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // ---- Zustand Selectors (shallow) ----
    const { user, userId, logout } = useAuthStore(
        useShallow((s) => ({ user: s.user, userId: s.user?.id, logout: s.logout }))
    );
    const { apiLevels, fetchChallenges, ensureFreshChallenges } = useChallengesStore(
        useShallow((s) => ({
            apiLevels: s.challenges,
            fetchChallenges: s.fetchChallenges,
            ensureFreshChallenges: s.ensureFreshChallenges,
        }))
    );

    // ---- Local UI State ----
    const [isChatOpen, setChatOpen] = useState(false);
    const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [checkInOpen, setCheckInOpen] = useState(false);
    const [hasUnclaimedReward, setHasUnclaimedReward] = useState(false);

    // ---- Derived state (memoised) ----
    const hideNav = useMemo(() =>
        location.pathname.startsWith("/level/") || location.pathname.startsWith("/admin/"),
        [location.pathname]);
    const showFooter = useMemo(() => location.pathname === "/", [location.pathname]);
    const isPublicLanding = useMemo(
        () => location.pathname === "/" && !user,
        [location.pathname, user],
    );

    // ---- Data Fetching ----
    useEffect(() => {
        if (userId) fetchChallenges();
    }, [userId, fetchChallenges]);

    useEffect(() => {
        if (!userId) return undefined;

        const refreshIfNeeded = () => {
            ensureFreshChallenges(20000);
        };

        const onVisible = () => {
            if (document.visibilityState === "visible") {
                refreshIfNeeded();
            }
        };

        window.addEventListener("focus", refreshIfNeeded);
        document.addEventListener("visibilitychange", onVisible);

        const intervalId = setInterval(() => {
            if (document.visibilityState === "visible") {
                refreshIfNeeded();
            }
        }, 30000);

        return () => {
            window.removeEventListener("focus", refreshIfNeeded);
            document.removeEventListener("visibilitychange", onVisible);
            clearInterval(intervalId);
        };
    }, [userId, ensureFreshChallenges]);

    useEffect(() => {
        if (!userId) return;
        let cancelled = false;
        (async () => {
            try {
                const data = await checkInApi.getCheckInStatus();
                if (!cancelled) setHasUnclaimedReward(!data.checked_in_today);
            } catch (error) {
                console.error("Failed to check reward status:", error);
            }
        })();
        return () => { cancelled = true; };
    }, [userId]);

    // ---- Stable Callbacks ----
    const handleLogout = useCallback(async () => {
        await logout();
        navigate("/");
    }, [logout, navigate]);

    const handleCloseNotification = useCallback(() => setNotificationOpen(false), []);
    const handleCloseCheckIn = useCallback(() => setCheckInOpen(false), []);
    const handleClaimReward = useCallback(() => setHasUnclaimedReward(false), []);

    // ---- Keyboard Shortcuts ----
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            if (!(e.ctrlKey || e.metaKey)) return;

            switch (key) {
                case "b":
                    e.preventDefault();
                    setChatOpen((prev) => !prev);
                    break;
                case "l":
                    e.preventDefault();
                    setLeaderboardOpen((prev) => !prev);
                    break;
                case "p":
                    e.preventDefault();
                    if (user) navigate("/profile");
                    break;
                case "x":
                    e.preventDefault();
                    if (user) navigate("/shop");
                    break;
                case "s":
                    e.preventDefault();
                    if (user) navigate("/store");
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [user, navigate]);

    // ---- Early exit for gameplay screens ----
    if (hideNav) return children;

    return (
        <div className="min-h-screen relative overflow-x-hidden w-full max-w-[100vw] bg-[#0a0f18] text-white selection:bg-[#38bdf8]/30">
            {/* Global Fixed Background */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[#0a0f18]" />

            {/* Noise texture overlay */}
            <div
                className="fixed inset-0 z-0 pointer-events-none opacity-[0.015] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundSize: '150px 150px'
                }}
            />

            {isPublicLanding && (
                <div className="fixed inset-x-0 bottom-0 top-14 z-0 pointer-events-none bg-[radial-gradient(circle_at_18%_20%,rgba(20,184,166,0.18),transparent_45%),radial-gradient(circle_at_78%_84%,rgba(14,165,233,0.12),transparent_42%)]" />
            )}

            {isPublicLanding && (
                <div
                    className="fixed inset-x-0 bottom-0 top-14 z-0 pointer-events-none opacity-[0.06]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgba(148,163,184,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.16) 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                    }}
                />
            )}

            <div className="relative z-10 flex min-h-screen flex-col">
                <HomeTopNav
                    user={user}
                    levels={apiLevels}
                    handleLogout={handleLogout}
                    setChatOpen={setChatOpen}
                    isChatOpen={isChatOpen}
                    checkInOpen={checkInOpen}
                    setCheckInOpen={setCheckInOpen}
                    setLeaderboardOpen={setLeaderboardOpen}
                    setNotificationOpen={setNotificationOpen}
                    notificationOpen={isNotificationOpen}
                    hasUnclaimedReward={hasUnclaimedReward}
                />

                <ChatDrawer
                    isChatOpen={isChatOpen}
                    setChatOpen={setChatOpen}
                    user={user}
                />

                <LeaderboardDrawer
                    isLeaderboardOpen={isLeaderboardOpen}
                    setLeaderboardOpen={setLeaderboardOpen}
                />

                <NotificationDrawer
                    isOpen={isNotificationOpen}
                    onClose={handleCloseNotification}
                />

                <DailyCheckInModal
                    isOpen={checkInOpen}
                    onClose={handleCloseCheckIn}
                    onClaim={handleClaimReward}
                />

                <main className="flex-1 pt-14">
                    {children}
                </main>

                {showFooter && (
                    <div className={user ? "pb-16 sm:pb-0" : ""}>
                        <SiteFooter />
                    </div>
                )}
            </div>
        </div>
    );
});

MainLayout.displayName = "MainLayout";

export default MainLayout;
