import { useState, useEffect } from 'react';
import { checkInApi } from '../../services/checkInApi';
import useUserStore from '../../stores/useUserStore';
import useAuthStore from '../../stores/useAuthStore';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

// Subcomponents
import StreakStats from '../components/StreakStats';
import DayGrid from '../components/DayGrid';

const DailyCheckInModal = ({ isOpen, onClose, onClaim }) => {
  const [checkInStatus, setCheckInStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const { fetchCurrentUser } = useUserStore();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      loadCheckInStatus();
    }
  }, [isOpen]);

  const loadCheckInStatus = async () => {
    setLoading(true);
    try {
      const data = await checkInApi.getCheckInStatus();
      setCheckInStatus(data);
    } catch (error) {
      console.error('Failed to load check-in status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (day) => {
    const nextDay = checkInStatus?.checked_in_today 
      ? checkInStatus.current_streak + 1 
      : (checkInStatus?.current_streak || 0) + 1;
    
    if (day !== nextDay || checkInStatus?.checked_in_today) return;
    
    setCheckingIn(true);
    try {
      const data = await checkInApi.checkIn();
      setCheckInStatus({
        ...checkInStatus,
        checked_in_today: true,
        current_streak: data.streak_day,
        today_checkin: data.check_in,
        freezes_left: data.freezes_left
      });

      // Apply XP immediately for snappier UI feedback, then sync in background.
      if (user?.profile && typeof data.xp_earned === 'number') {
        setUser({
          ...user,
          profile: {
            ...user.profile,
            xp: (user.profile.xp || 0) + data.xp_earned,
          },
        });
      }

      if (fetchCurrentUser) {
        void fetchCurrentUser().catch(() => {});
      }
      if (onClaim) onClaim();
      
      if (data.streak_saved) {
        toast.info(`🔥 Streak Saved! Used 1 Freeze. ${data.freezes_left} left.`);
      } else {
        toast.success(`Day ${data.streak_day} claimed! +${data.xp_earned} XP`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to check in');
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-[#0f1b2e]/72 border border-[#7ea3d9]/25 text-white backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 border border-primary/25 rounded-xl backdrop-blur-md">
              <Calendar className="text-primary h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl text-white">Daily Check-In</DialogTitle>
              <DialogDescription className="text-gray-400">Claim your daily rewards</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Streak Stats */}
        <StreakStats checkInStatus={checkInStatus} />

        {/* Content */}
        <div className="space-y-4">
          {loading ? (
            <>
                {/* Skeleton state */}
                <p className="text-sm text-gray-400 text-center animate-pulse bg-white/10 mx-auto rounded-md h-4 w-64 mb-4"></p>
                <div className="grid grid-cols-7 gap-2 animate-pulse">
                     {[1, 2, 3, 4, 5, 6, 7].map(i => (
                         <div key={i} className="bg-[#162338]/70 border border-white/15 h-20 rounded-xl backdrop-blur-md"></div>
                     ))}
                </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-400 text-center">
                Click on the next day to claim your reward
              </p>

              {/* Calendar Grid */}
              <DayGrid 
                  checkInStatus={checkInStatus} 
                  handleCheckIn={handleCheckIn} 
                  checkingIn={checkingIn} 
              />


            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyCheckInModal;
