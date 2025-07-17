'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Award, TrendingUp, Users, Star } from 'lucide-react';
import { usePoints } from '@/hooks/usePoints';

interface UserData {
  id: string;
  name: string;
  email: string;
  department: string | null;
  position: string | null;
  pointsBalance: number;
}

export function UserStats() {
  const { data: session } = useSession();
  const { availablePoints, getTimeUntilReset } = usePoints();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ユーザーデータを取得
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return;
      
      try {
        const response = await fetch('/api/users/me');
        if (response.ok) {
          const user = await response.json();
          setUserData(user);
        }
      } catch (error) {
        console.error('ユーザーデータ取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session]);
  
  return (
    <div className="space-y-6">
      {/* ユーザー情報 */}
      <div className="card-gradient p-6">
        {isLoading ? (
          <div className="text-center py-4 text-white/60">
            <p>読み込み中...</p>
          </div>
        ) : userData ? (
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {userData.name ? userData.name.charAt(0) : 'U'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">{userData.name || 'ユーザー名未設定'}</h3>
              <p className="text-sm text-white/80">{userData.department || '部署未設定'}</p>
              <p className="text-sm text-white/80">{userData.position || '職位未設定'}</p>
              <p className="text-xs text-white/60">{userData.email}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-white/60">
            <p>ユーザーデータを取得できませんでした</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{availablePoints}</div>
            <div className="text-sm text-white/80">今週のポイント</div>
            <div className="text-xs text-white/60 mt-1">
              リセット: {getTimeUntilReset()}
            </div>
          </div>
        </div>
      </div>

      {/* 今月の統計 */}
      <div className="card-gradient p-6">
        <h3 className="font-semibold text-white mb-4">今月の統計</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/80">送ったポイント</span>
            </div>
            <span className="font-semibold text-white">800pt</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/80">受け取ったポイント</span>
            </div>
            <span className="font-semibold text-white">450pt</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-sm text-white/80">投稿数</span>
            </div>
            <span className="font-semibold text-white">12</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white/80">リアクション</span>
            </div>
            <span className="font-semibold text-white">28</span>
          </div>
        </div>
      </div>

      {/* ランキング */}
      <div className="card-gradient p-6">
        <h3 className="font-semibold text-white mb-4">今月のランキング</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">受け取ったポイント</span>
            <span className="font-semibold text-blue-400">#5</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">送ったポイント</span>
            <span className="font-semibold text-green-400">#3</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">投稿数</span>
            <span className="font-semibold text-purple-400">#8</span>
          </div>
        </div>
      </div>

      {/* 最近のバッジ */}
      <div className="card-gradient p-6">
        <h3 className="font-semibold text-white mb-4">最近のバッジ</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-white/80">感謝の達人</span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-white/80">成長株</span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-white/80">チームワーク</span>
          </div>
        </div>
      </div>

      {/* 部署ランキング */}
      <div className="card-gradient p-6">
        <h3 className="font-semibold text-white mb-4">部署ランキング</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">1</span>
            </div>
            <span className="text-sm text-white/80 flex-1">エンジニアリング</span>
            <span className="text-sm font-semibold text-white">3,200pt</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">2</span>
            </div>
            <span className="text-sm text-white/80 flex-1">営業</span>
            <span className="text-sm font-semibold text-white">2,800pt</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">3</span>
            </div>
            <span className="text-sm text-white/80 flex-1">マーケティング</span>
            <span className="text-sm font-semibold text-white">2,400pt</span>
          </div>
        </div>
      </div>
    </div>
  );
}