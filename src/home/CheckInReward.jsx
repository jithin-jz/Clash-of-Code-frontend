import { useState, useEffect } from 'react';
import { checkInApi } from '../services/checkInApi';
import useUserStore from '../stores/useUserStore';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

// Subcomponents
import StreakStats from './components/StreakStats';
import DayGrid from './components/DayGrid';

const CheckInReward = ({ isOpen, onClose, onClaim }) => {
  const [checkInStatus, setCheckInStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const { fetchCurrentUser } = useUserStore();

  useEffect(() => {
    if (isOpen) {
      loadCheckInStatus();
    }
  }, [isOpen]);

  const loadCheckInStatus = async () => {
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
      if (fetchCurrentUser) await fetchCurrentUser();
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
      <DialogContent className="sm:max-w-2xl bg-[#09090b] border-white/10 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl">
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
                <p className="text-sm text-gray-400 text-center animate-pulse bg-white/5 mx-auto rounded-md h-4 w-64 mb-4"></p>
                <div className="grid grid-cols-7 gap-2 animate-pulse">
                     {[1, 2, 3, 4, 5, 6, 7].map(i => (
                         <div key={i} className="bg-[#1a1a1a] border border-white/5 h-20 rounded-xl"></div>
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

              {/* Recent Check-ins */}
              {checkInStatus?.recent_checkins?.length > 0 && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Recent Check-ins
                    </h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {checkInStatus.recent_checkins.slice(0, 5).map((checkin) => (
                        <div
                          key={checkin.id}
                          className="flex items-center justify-between text-xs py-1.5 px-2 bg-background rounded-lg"
                        >
                          <span className="text-muted-foreground">{checkin.check_in_date}</span>
                          <span className="text-muted-foreground">Day {checkin.streak_day}</span>
                          <Badge variant="outline" className="text-primary border-primary/50">
                            +{checkin.xp_earned} XP
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInReward;