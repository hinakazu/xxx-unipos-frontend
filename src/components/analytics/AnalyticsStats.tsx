'use client';

import { TrendingUp, TrendingDown, Award, MessageCircle, Heart, Users } from 'lucide-react';

export function AnalyticsStats() {
  const stats = [
    {
      label: '総ポイント数',
      value: '12,450',
      change: '+15.2%',
      trend: 'up',
      icon: Award,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      label: '投稿数',
      value: '284',
      change: '+8.7%',
      trend: 'up',
      icon: MessageCircle,
      color: 'from-blue-500 to-purple-500',
    },
    {
      label: 'リアクション数',
      value: '1,856',
      change: '+12.3%',
      trend: 'up',
      icon: Heart,
      color: 'from-pink-500 to-red-500',
    },
    {
      label: 'アクティブユーザー',
      value: '89',
      change: '-2.1%',
      trend: 'down',
      icon: Users,
      color: 'from-green-500 to-blue-500',
    },
  ];

  const engagementData = [
    { department: 'エンジニアリング', score: 8.5, color: 'from-blue-500 to-purple-500' },
    { department: '営業', score: 7.8, color: 'from-green-500 to-blue-500' },
    { department: 'マーケティング', score: 8.2, color: 'from-pink-500 to-violet-500' },
    { department: 'デザイン', score: 9.1, color: 'from-yellow-400 to-orange-500' },
    { department: 'カスタマーサポート', score: 7.5, color: 'from-purple-500 to-pink-500' },
    { department: '人事', score: 8.0, color: 'from-orange-400 to-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* 主要指標 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card-gradient p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center space-x-1 ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* エンゲージメントスコア */}
      <div className="card-gradient p-6">
        <h2 className="text-xl font-bold text-white mb-4">部署別エンゲージメントスコア</h2>
        <div className="space-y-4">
          {engagementData.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-32 text-white/80 text-sm">{item.department}</div>
              <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                  style={{ width: `${(item.score / 10) * 100}%` }}
                />
              </div>
              <div className="w-12 text-white font-semibold text-right">{item.score}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 投稿タイプ別分析 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-gradient p-6">
          <h3 className="text-lg font-semibold text-white mb-4">投稿タイプ別</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80">感謝</span>
              <span className="text-white font-semibold">156 (55%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">称賛</span>
              <span className="text-white font-semibold">89 (31%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">成果報告</span>
              <span className="text-white font-semibold">39 (14%)</span>
            </div>
          </div>
        </div>

        <div className="card-gradient p-6">
          <h3 className="text-lg font-semibold text-white mb-4">時間帯別活動</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80">9-12時</span>
              <span className="text-white font-semibold">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">13-17時</span>
              <span className="text-white font-semibold">38%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">18-22時</span>
              <span className="text-white font-semibold">17%</span>
            </div>
          </div>
        </div>

        <div className="card-gradient p-6">
          <h3 className="text-lg font-semibold text-white mb-4">週間トレンド</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80">月曜日</span>
              <span className="text-white font-semibold">82</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">火曜日</span>
              <span className="text-white font-semibold">95</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">水曜日</span>
              <span className="text-white font-semibold">78</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">木曜日</span>
              <span className="text-white font-semibold">89</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">金曜日</span>
              <span className="text-white font-semibold">103</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}