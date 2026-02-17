import React, { memo } from 'react';
import { Flame } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

const StreakStats = ({ checkInStatus }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
          <Card className="bg-linear-to-r from-orange-500/20 to-red-500/15 border-orange-400/30 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/25 border border-orange-300/20 rounded-lg">
                  <Flame className="text-orange-400 h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Current Cycle</p>
                  <p className="text-lg font-bold text-white">
                    Day {checkInStatus?.cycle_day || 1}{' '}
                    <span className="text-gray-500">/ 7</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    );
};

export default memo(StreakStats);
