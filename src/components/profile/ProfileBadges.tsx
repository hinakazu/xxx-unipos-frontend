'use client';

import { Award, TrendingUp, Users, Heart, Star, Crown } from 'lucide-react';

export function ProfileBadges() {
  const badges = [
    {
      id: 1,
      name: '感謝の達人',
      description: '100回以上の感謝を送信',
      icon: Heart,
      color: 'from-pink-500 to-red-500',
      earnedAt: '2024-01-15',
      rarity: 'common',
    },
    {
      id: 2,
      name: 'チームワーク',
      description: '50人以上との交流',
      icon: Users,
      color: 'from-green-500 to-blue-500',
      earnedAt: '2024-01-10',
      rarity: 'common',
    },
    {
      id: 3,
      name: '成長株',
      description: '月間ポイント増加率トップ10',
      icon: TrendingUp,
      color: 'from-blue-500 to-purple-500',
      earnedAt: '2024-01-05',
      rarity: 'rare',
    },
    {
      id: 4,
      name: 'スーパースター',
      description: '月間ランキング1位',
      icon: Star,
      color: 'from-yellow-400 to-orange-500',
      earnedAt: '2023-12-28',
      rarity: 'epic',
    },
    {
      id: 5,
      name: 'キング',
      description: '年間ランキング1位',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      earnedAt: '2023-12-31',
      rarity: 'legendary',
    },
  ];

  const upcomingBadges = [
    {
      name: 'コミュニケーター',
      description: '200回の投稿',
      progress: 156,
      total: 200,
      icon: Award,
    },
    {
      name: 'インフルエンサー',
      description: '500回のリアクション獲得',
      progress: 342,
      total: 500,
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

  return (
    <div className="space-y-6">
      {/* 獲得済みバッジ */}
      <div className="card-gradient p-6">
        <h2 className="text-xl font-bold text-white mb-4">獲得バッジ</h2>
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge) => {
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
            <span className="text-white font-semibold">5 / 12</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80">レア度の高いバッジ</span>
            <span className="text-white font-semibold">2</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80">完了率</span>
            <span className="text-white font-semibold">42%</span>
          </div>
        </div>
      </div>
    </div>
  );
}