import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import useAuthStore from "../stores/useAuthStore";
import { useHomeData } from "../hooks/useHomeData";

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
  return (
    <div className="relative select-none text-white min-h-screen">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full relative"
          >
            <HomeSkeleton />
          </Motion.div>
        ) : (
          <Motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full relative"
          >
            <ChallengeMap
              user={user}
              levels={levels}
              handleLevelClick={handleLevelClick}
            />

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
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
