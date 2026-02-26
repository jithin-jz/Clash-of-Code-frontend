import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import { useHomeData } from "../hooks/useHomeData";
import { Play } from "lucide-react";

// Components
import HomeSkeleton from "./HomeSkeleton";
import LevelModal from "../game/LevelModal";
import { ChallengeMap } from "../home";
import CertificateModal from "../components/CertificateModal";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Use centralized data hook
  const {
    levels,
    isLoading,
    certificateModalOpen,
    setCertificateModalOpen,
    userCertificate,
    isCertificateLoading,
    handleCertificateClick,
    CERTIFICATE_SLUG
  } = useHomeData(user);

  // Local UI State
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleLevelClick = async (level) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (level.unlocked) {
      const isCertificate =
        level.slug === CERTIFICATE_SLUG || level.type === "CERTIFICATE";
      if (isCertificate) {
        handleCertificateClick();
      } else {
        setSelectedLevel(level);
      }
    }
  };

  // Removed internal user check as routing is now handled in App.jsx
  if (isLoading) {
    return (
      <div className="relative select-none text-white min-h-screen">
        <HomeSkeleton />
      </div>
    );
  }

  const normalLevels = levels.filter((l) => l.slug !== CERTIFICATE_SLUG && l.type !== "CERTIFICATE");
  const currentLevel = normalLevels.find((l) => l.unlocked && !l.completed) ||
    [...normalLevels].reverse().find((l) => l.unlocked) ||
    normalLevels[0];

  return (
    <div className="relative select-none text-white min-h-screen">
      <div className="w-full relative">
        <ChallengeMap
          user={user}
          levels={levels}
          handleLevelClick={handleLevelClick}
        />

        {/* Floating Play Button (Desktop) */}
        {user && currentLevel && (
          <div className="hidden md:flex fixed bottom-8 right-8 z-40 items-center gap-4 group">
            <div className="flex flex-col items-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 backdrop-blur-md">
                Resume Journey
              </span>
              <span className="text-sm font-bold text-white drop-shadow-lg mt-1">
                {currentLevel.title || currentLevel.name}
              </span>
            </div>

            <button
              onClick={() => navigate(`/level/${currentLevel.slug}`)}
              className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-[0_15px_50px_rgba(0,175,155,0.5)] transition-all duration-500 hover:scale-110 active:scale-95 border-4 border-white/10 group/btn relative"
            >
              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 group-hover/btn:opacity-40 transition-opacity" />
              <Play size={32} fill="currentColor" className="ml-1.5 relative z-10 transition-transform group-hover/btn:scale-110" />
            </button>
          </div>
        )}

        {selectedLevel && (
          <LevelModal
            selectedLevel={selectedLevel}
            onClose={() => setSelectedLevel(null)}
          />
        )}

        <CertificateModal
          isOpen={certificateModalOpen}
          onClose={() => setCertificateModalOpen(false)}
          certificate={userCertificate}
          isLoading={isCertificateLoading}
        />
      </div>
    </div>
  );
};

export default Home;
