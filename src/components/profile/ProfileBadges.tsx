'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Award, TrendingUp, Users, Heart, Star, Crown } from 'lucide-react';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: any;
  color: string;
  earnedAt: string;
  rarity: string;
  earned: boolean;
}

interface UserStats {
  postCount: number;
  receivedReactions: number;
  interactionCount: number;
  totalPoints: number;
}

export function ProfileBadges() {
  const { data: session } = useSession();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // ユーザー統計を取得
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const allPosts = await response.json();
          
          // 現在のユーザーに関連する投稿を抽出
          const userPosts = allPosts.filter((post: any) => 
            post.author.id === session.user.id || post.recipient.id === session.user.id
          );
          
          // 統計を計算
          const sentPosts = userPosts.filter((post: any) => post.author.id === session.user.id);
          const receivedPosts = userPosts.filter((post: any) => post.recipient.id === session.user.id);
          
          const totalPoints = receivedPosts.reduce((sum: number, post: any) => sum + post.points, 0);
          const postCount = sentPosts.length;
          const receivedReactions = receivedPosts.reduce((sum: number, post: any) => sum + post._count.likes, 0);
          
          // 交流した人数（重複を除く）
          const interactedUsers = new Set([
            ...sentPosts.map((post: any) => post.recipient.id),
            ...receivedPosts.map((post: any) => post.author.id)
          ]);
          
          setUserStats({
            totalPoints,
            postCount,
            receivedReactions,
            interactionCount: interactedUsers.size
          });
        }
      } catch (error) {
        console.error('統計取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [session]);

  // バッジ定義（動的に獲得状況を判定）
  const badgeDefinitions = [
    {
      id: 1,
      name: '感謝の達人',
      description: '10回以上の感謝を送信',
      icon: Heart,
      color: 'from-pink-500 to-red-500',
      rarity: 'common',
      condition: (stats: UserStats) => stats.postCount >= 10,
    },
    {
      id: 2,
      name: 'チームワーク',
      description: '5人以上との交流',
      icon: Users,
      color: 'from-green-500 to-blue-500',
      rarity: 'common',
      condition: (stats: UserStats) => stats.interactionCount >= 5,
    },
    {
      id: 3,
      name: '成長株',
      description: '100ポイント以上獲得',
      icon: TrendingUp,
      color: 'from-blue-500 to-purple-500',
      rarity: 'rare',
      condition: (stats: UserStats) => stats.totalPoints >= 100,
    },
    {
      id: 4,
      name: 'スーパースター',
      description: '50回以上の投稿',
      icon: Star,
      color: 'from-yellow-400 to-orange-500',
      rarity: 'epic',
      condition: (stats: UserStats) => stats.postCount >= 50,
    },
    {
      id: 5,
      name: 'キング',
      description: '1000ポイント以上獲得',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      rarity: 'legendary',
      condition: (stats: UserStats) => stats.totalPoints >= 1000,
    },
  ];

  const badges = badgeDefinitions.map(badge => ({
    ...badge,
    earned: userStats ? badge.condition(userStats) : false,
    earnedAt: new Date().toISOString().split('T')[0], // 実際の実装では獲得日時を保存
  }));

  const earnedBadges = badges.filter(badge => badge.earned);
  
  const upcomingBadges = [
    {
      name: 'コミュニケーター',
      description: '200回の投稿',
      progress: Math.min(userStats?.postCount || 0, 200),
      total: 200,
      icon: Award,
    },
    {
      name: 'インフルエンサー',
      description: '100回のリアクション獲得',
      progress: Math.min(userStats?.receivedReactions || 0, 100),
      total: 100,
      icon: Star,
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'ring-gray-400';
      case 'rare': return 'ring-blue-400';
      case 'epic': return 'ring-purple-400';
      case 'legendary': return 'ring-yellow-400';
      default: return 'ring-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="card-gradient p-6">
          <div className="text-center py-8 text-white/60">
            <p>読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 獲得済みバッジ */}
      <div className="card-gradient p-6">
        <h2 className="text-xl font-bold text-white mb-4">獲得バッジ</h2>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {earnedBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`p-4 bg-white/5 rounded-lg ring-2 ${getRarityColor(badge.rarity)} relative`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${badge.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm text-center mb-1">{badge.name}</h3>
                  <p className="text-white/60 text-xs text-center mb-2">{badge.description}</p>
                  <div className="text-white/40 text-xs text-center">
                    {new Date(badge.earnedAt).toLocaleDateString('ja-JP')}
                  </div>
                  
                  {/* レア度インジケーター */}
                  <div className="absolute top-1 right-1">
                    <div className={`w-2 h-2 rounded-full ${badge.rarity === 'legendary' ? 'bg-yellow-400' : 
                      badge.rarity === 'epic' ? 'bg-purple-400' : 
                      badge.rarity === 'rare' ? 'bg-blue-400' : 'bg-gray-400'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-white/60">
            <Award className="w-12 h-12 mx-auto mb-4 text-white/40" />
            <p>まだバッジがありません</p>
            <p className="text-sm mt-2">活動してバッジを獲得しましょう！</p>
          </div>
        )}
      </div>

      {/* 進行中のバッジ */}
      <div className="card-gradient p-6">
        <h2 className="text-xl font-bold text-white mb-4">進行中のバッジ</h2>
        <div className="space-y-4">
          {upcomingBadges.map((badge, index) => {
            const Icon = badge.icon;
            const progress = (badge.progress / badge.total) * 100;
            
            return (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold text-sm">{badge.name}</h3>
                    <span className="text-white/60 text-xs">{badge.progress}/{badge.total}</span>
                  </div>
                  <p className="text-white/60 text-xs mb-2">{badge.description}</p>
                  <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* バッジ統計 */}
      <div className="card-gradient p-6">
        <h2 className="text-xl font-bold text-white mb-4">バッジ統計</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/80">獲得バッジ数</span>
            <span className="text-white font-semibold">{earnedBadges.length} / {badges.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80">レア度の高いバッジ</span>
            <span className="text-white font-semibold">{earnedBadges.filter(b => b.rarity === 'rare' || b.rarity === 'epic' || b.rarity === 'legendary').length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80">完了率</span>
            <span className="text-white font-semibold">{Math.round((earnedBadges.length / badges.length) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}