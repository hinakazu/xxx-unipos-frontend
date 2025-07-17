'use client';

import { useState, useEffect } from 'react';

interface PointsData {
  availablePoints: number;
  lastResetDate: Date;
  nextResetDate: Date;
}

export function usePoints() {
  const [pointsData, setPointsData] = useState<PointsData>({
    availablePoints: 400,
    lastResetDate: new Date(),
    nextResetDate: new Date(),
  });

  // 次の月曜日を取得する関数
  const getNextMonday = (date: Date): Date => {
    const nextMonday = new Date(date);
    const dayOfWeek = nextMonday.getDay();
    const daysToAdd = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // 0は日曜日
    nextMonday.setDate(nextMonday.getDate() + daysToAdd);
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
  };

  // 最後の月曜日を取得する関数
  const getLastMonday = (date: Date): Date => {
    const lastMonday = new Date(date);
    const dayOfWeek = lastMonday.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0は日曜日
    lastMonday.setDate(lastMonday.getDate() - daysToSubtract);
    lastMonday.setHours(0, 0, 0, 0);
    return lastMonday;
  };

  // ポイントリセットチェック
  const checkPointsReset = () => {
    const now = new Date();
    const lastMonday = getLastMonday(now);
    const nextMonday = getNextMonday(now);

    // 今日が月曜日で、まだリセットされていない場合
    if (now.getDay() === 1 && now >= lastMonday) {
      const storedResetDate = localStorage.getItem('lastPointsReset');
      if (!storedResetDate || new Date(storedResetDate) < lastMonday) {
        // ポイントをリセット
        setPointsData({
          availablePoints: 400,
          lastResetDate: lastMonday,
          nextResetDate: nextMonday,
        });
        localStorage.setItem('lastPointsReset', lastMonday.toISOString());
        localStorage.setItem('availablePoints', '400');
        return;
      }
    }

    // 既存のポイントを復元
    const storedPoints = localStorage.getItem('availablePoints');
    const storedResetDate = localStorage.getItem('lastPointsReset');
    
    setPointsData({
      availablePoints: storedPoints ? parseInt(storedPoints) : 400,
      lastResetDate: storedResetDate ? new Date(storedResetDate) : lastMonday,
      nextResetDate: nextMonday,
    });
  };

  // ポイントを使用する関数
  const usePoints = (amount: number): boolean => {
    if (pointsData.availablePoints >= amount) {
      const newPoints = pointsData.availablePoints - amount;
      setPointsData(prev => ({
        ...prev,
        availablePoints: newPoints,
      }));
      localStorage.setItem('availablePoints', newPoints.toString());
      return true;
    }
    return false;
  };

  // 次のリセットまでの残り時間を取得
  const getTimeUntilReset = (): string => {
    const now = new Date();
    const diff = pointsData.nextResetDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'リセット予定';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}日${hours}時間後`;
    } else if (hours > 0) {
      return `${hours}時間${minutes}分後`;
    } else {
      return `${minutes}分後`;
    }
  };

  useEffect(() => {
    checkPointsReset();
    
    // 1分ごとにチェック
    const interval = setInterval(checkPointsReset, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    availablePoints: pointsData.availablePoints,
    lastResetDate: pointsData.lastResetDate,
    nextResetDate: pointsData.nextResetDate,
    usePoints,
    getTimeUntilReset,
  };
}