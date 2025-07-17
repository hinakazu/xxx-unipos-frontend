'use client';

import { BarChart3, LineChart, PieChart, Activity } from 'lucide-react';

export function AnalyticsCharts() {
  // モックデータ
  const monthlyData = [
    { month: '1月', posts: 45, points: 1200, reactions: 180 },
    { month: '2月', posts: 52, points: 1350, reactions: 210 },
    { month: '3月', posts: 48, points: 1180, reactions: 195 },
    { month: '4月', posts: 63, points: 1680, reactions: 245 },
    { month: '5月', posts: 58, points: 1520, reactions: 228 },
    { month: '6月', posts: 71, points: 1850, reactions: 287 },
  ];

  const departmentData = [
    { name: 'エンジニアリング', value: 35, color: 'from-blue-500 to-purple-500' },
    { name: '営業', value: 25, color: 'from-green-500 to-blue-500' },
    { name: 'マーケティング', value: 20, color: 'from-pink-500 to-violet-500' },
    { name: 'デザイン', value: 12, color: 'from-yellow-400 to-orange-500' },
    { name: 'その他', value: 8, color: 'from-gray-400 to-gray-500' },
  ];

  const weeklyTrend = [
    { day: '月', value: 82 },
    { day: '火', value: 95 },
    { day: '水', value: 78 },
    { day: '木', value: 89 },
    { day: '金', value: 103 },
    { day: '土', value: 45 },
    { day: '日', value: 38 },
  ];

  return (
    <div className="space-y-6">
      {/* 月次トレンド */}
      <div className="card-gradient p-6">
        <div className="flex items-center space-x-2 mb-6">
          <LineChart className="w-5 h-5 text-white" />
          <h2 className="text-xl font-bold text-white">月次トレンド</h2>
        </div>
        
        <div className="space-y-4">
          {monthlyData.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-8 text-white/80 text-sm">{item.month}</div>
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-white/60">投稿数</div>
                  <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${(item.posts / 100) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-white font-semibold">{item.posts}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-white/60">ポイント</div>
                  <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                      style={{ width: `${(item.points / 2000) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-white font-semibold">{item.points}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-white/60">リアクション</div>
                  <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-red-500 transition-all duration-500"
                      style={{ width: `${(item.reactions / 300) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-white font-semibold">{item.reactions}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 部署別分布 */}
        <div className="card-gradient p-6">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="w-5 h-5 text-white" />
            <h2 className="text-xl font-bold text-white">部署別投稿分布</h2>
          </div>
          
          <div className="space-y-4">
            {departmentData.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color}`} />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-white/80">{item.name}</span>
                  <span className="text-white font-semibold">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <div className="relative w-32 h-32">
              {/* 簡単な円グラフ風の表示 */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-2">
                <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white font-bold text-lg">284</div>
                    <div className="text-white/60 text-xs">総投稿数</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 週間活動パターン */}
        <div className="card-gradient p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-white" />
            <h2 className="text-xl font-bold text-white">週間活動パターン</h2>
          </div>
          
          <div className="space-y-4">
            {weeklyTrend.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-8 text-white/80 text-sm">{item.day}</div>
                <div className="flex-1 bg-white/10 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${(item.value / 120) * 100}%` }}
                  >
                    <span className="text-white text-xs font-semibold">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 詳細統計 */}
      <div className="card-gradient p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="w-5 h-5 text-white" />
          <h2 className="text-xl font-bold text-white">詳細統計</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">4.8</div>
            <div className="text-white/60 text-sm">平均投稿レート</div>
            <div className="text-white/60 text-xs">（投稿/日）</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">89.2%</div>
            <div className="text-white/60 text-sm">投稿回答率</div>
            <div className="text-white/60 text-xs">（リアクション率）</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">2.3</div>
            <div className="text-white/60 text-sm">平均リアクション数</div>
            <div className="text-white/60 text-xs">（リアクション/投稿）</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">156</div>
            <div className="text-white/60 text-sm">平均ポイント</div>
            <div className="text-white/60 text-xs">（ポイント/投稿）</div>
          </div>
        </div>
      </div>
    </div>
  );
}