'use client';

import { Trophy, Medal, Award, TrendingUp, Crown } from 'lucide-react';

// モックデータ
const mockRankings = [
  {
    id: 1,
    rank: 1,
    user: {
      name: '田中花子',
      department: 'エンジニアリング',
      avatar: null,
    },
    points: 1250,
    change: '+5',
    badge: 'gold',
  },
  {
    id: 2,
    rank: 2,
    user: {
      name: '佐藤次郎',
      department: '営業',
      avatar: null,
    },
    points: 1180,
    change: '+2',
    badge: 'silver',
  },
  {
    id: 3,
    rank: 3,
    user: {
      name: '鈴木一郎',
      department: 'マーケティング',
      avatar: null,
    },
    points: 1050,
    change: '-1',
    badge: 'bronze',
  },
  {
    id: 4,
    rank: 4,
    user: {
      name: '高橋美咲',
      department: 'デザイン',
      avatar: null,
    },
    points: 980,
    change: '+3',
    badge: null,
  },
  {
    id: 5,
    rank: 5,
    user: {
      name: '山田太郎',
      department: 'エンジニアリング',
      avatar: null,
    },
    points: 920,
    change: '0',
    badge: null,
  },
  {
    id: 6,
    rank: 6,
    user: {
      name: '伊藤健太',
      department: 'カスタマーサポート',
      avatar: null,
    },
    points: 850,
    change: '-2',
    badge: null,
  },
];

export function RankingList() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-white font-bold">{rank}</span>;
    }
  };

  const getRankBadge = (badge: string | null) => {
    if (!badge) return null;
    
    const badgeClasses = {
      gold: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      silver: 'bg-gradient-to-r from-gray-300 to-gray-400',
      bronze: 'bg-gradient-to-r from-orange-400 to-red-500',
    };

    return (
      <div className={`w-3 h-3 rounded-full ${badgeClasses[badge as keyof typeof badgeClasses]}`} />
    );
  };

  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-green-400';
    if (change.startsWith('-')) return 'text-red-400';
    return 'text-white/60';
  };

  const getChangeIcon = (change: string) => {
    if (change.startsWith('+')) return <TrendingUp className="w-3 h-3" />;
    if (change.startsWith('-')) return <TrendingUp className="w-3 h-3 rotate-180" />;
    return null;
  };

  return (
    <div className="space-y-4">
      {/* トップ3の特別表示 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {mockRankings.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className={`card-gradient p-6 text-center ${
              item.rank === 1 ? 'ring-2 ring-yellow-400/50' : ''
            }`}
          >
            <div className="flex justify-center mb-4">
              {getRankIcon(item.rank)}
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">
                {item.user.name.charAt(0)}
              </span>
            </div>
            <h3 className="font-bold text-white mb-1">{item.user.name}</h3>
            <p className="text-white/60 text-sm mb-2">{item.user.department}</p>
            <div className="text-2xl font-bold text-white mb-2">
              {item.points.toLocaleString()}pt
            </div>
            <div className={`flex items-center justify-center space-x-1 ${getChangeColor(item.change)}`}>
              {getChangeIcon(item.change)}
              <span className="text-sm">{item.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 4位以下のリスト表示 */}
      <div className="card-gradient p-6">
        <h2 className="text-xl font-bold text-white mb-4">全ランキング</h2>
        <div className="space-y-3">
          {mockRankings.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3 w-8">
                {getRankIcon(item.rank)}
                {getRankBadge(item.badge)}
              </div>
              
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {item.user.name.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white">{item.user.name}</span>
                  <span className="text-white/60 text-sm">{item.user.department}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-white">{item.points.toLocaleString()}pt</div>
                <div className={`flex items-center space-x-1 ${getChangeColor(item.change)}`}>
                  {getChangeIcon(item.change)}
                  <span className="text-sm">{item.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 部署別ランキング */}
      <div className="card-gradient p-6">
        <h2 className="text-xl font-bold text-white mb-4">部署別ランキング</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'エンジニアリング', points: 3450, members: 12 },
            { name: '営業', points: 2980, members: 8 },
            { name: 'マーケティング', points: 2650, members: 6 },
            { name: 'デザイン', points: 2200, members: 4 },
            { name: 'カスタマーサポート', points: 1800, members: 5 },
            { name: '人事', points: 1500, members: 3 },
          ].map((dept, index) => (
            <div key={dept.name} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">{dept.name}</div>
                <div className="text-white/60 text-sm">{dept.members}名</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">{dept.points.toLocaleString()}pt</div>
                <div className="text-white/60 text-sm">平均: {Math.round(dept.points / dept.members)}pt</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}