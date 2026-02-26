import { useState, useEffect, memo } from 'react';
import { checkInApi } from '../../services/checkInApi';
import useUserStore from '../../stores/useUserStore';
import useAuthStore from '../../stores/useAuthStore';
import { Calendar, X, Sparkles, Flame, Snowflake } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { motion as Motion, AnimatePresence } from 'framer-motion';

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
        toast.info(`Streak Saved!`, {
          description: `Used 1 Freeze. ${data.freezes_left} remains.`,
          icon: <Snowflake className="text-blue-400" size={18} />
        });
      } else {
        toast.success(`Day ${data.streak_day} Claimed!`, {
          description: `+${data.xp_earned} XP added to your core.`,
          icon: <Sparkles className="text-primary" size={18} />
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Transmission failed');
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-[#03070c]/95 border-white/[0.08] text-white backdrop-blur-3xl shadow-premium p-0 overflow-hidden rounded-3xl">
        {/* Header Decor */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
        
        <div className="p-8">
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-2xl shadow-[0_0_30px_rgba(0,175,155,0.1)]">
                <Calendar className="text-primary h-6 w-6" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-xl font-black uppercase tracking-widest text-white">Daily Extraction</DialogTitle>
                <DialogDescription className="text-slate-500 font-bold text-[10px] uppercase tracking-tighter mt-1">Claim your recurring resource allocation</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Streak Stats */}
          <div className="mb-8">
            <StreakStats checkInStatus={checkInStatus} />
          </div>

          {/* Content */}
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-white/[0.03] rounded-full w-48 mx-auto animate-pulse" />
                <div className="grid grid-cols-7 gap-3">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-20 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 text-center mb-6">
                  Select Pending Vector to Initiate Claim
                </p>

                <DayGrid 
                    checkInStatus={checkInStatus} 
                    handleCheckIn={handleCheckIn} 
                    checkingIn={checkingIn} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-white/[0.02] border-t border-white/[0.05] p-4 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <Flame size={14} className="text-accent" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Current Streak: {checkInStatus?.current_streak || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Snowflake size={14} className="text-blue-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Freezes: {checkInStatus?.freezes_left || 0}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(DailyCheckInModal);
