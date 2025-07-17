'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Award, TrendingUp, MessageCircle, Heart, Users, Calendar } from 'lucide-react';

interface UserStats {
  totalPoints: number;
  postCount: number;
  receivedReactions: number;
  interactionCount: number;
}

interface Post {
  id: string;
  points: number;
  createdAt: string;
  author: { id: string; name: string; };
  recipient: { id: string; name: string; };
  _count: { likes: number; };
}

export function ProfileStats() {
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
          const allPosts: Post[] = await response.json();
          
          // 現在のユーザーに関連する投稿を抽出
          const userPosts = allPosts.filter(post => 
            post.author.id === session.user.id || post.recipient.id === session.user.id
          );
          
          // 統計を計算
          const sentPosts = userPosts.filter(post => post.author.id === session.user.id);
          const receivedPosts = userPosts.filter(post => post.recipient.id === session.user.id);
          
          const totalPoints = receivedPosts.reduce((sum, post) => sum + post.points, 0);
          const postCount = sentPosts.length;
          const receivedReactions = receivedPosts.reduce((sum, post) => sum + post._count.likes, 0);
          
          // 交流した人数（重複を除く）
          const interactedUsers = new Set([
            ...sentPosts.map(post => post.recipient.id),
            ...receivedPosts.map(post => post.author.id)
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

  const stats = [
    {
      label: '総獲得ポイント',
      value: userStats?.totalPoints?.toLocaleString() || '0',
      change: '+15.2%',
      trend: 'up',
      icon: Award,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      label: '投稿数',
      value: userStats?.postCount?.toString() || '0',
      change: '+8.7%',
      trend: 'up',
      icon: MessageCircle,
      color: 'from-blue-500 to-purple-500',
    },
    {
      label: '受けたリアクション',
      value: userStats?.receivedReactions?.toString() || '0',
      change: '+12.3%',
      trend: 'up',
      icon: Heart,
      color: 'from-pink-500 to-red-500',
    },
    {
      label: '交流した人数',
      value: userStats?.interactionCount?.toString() || '0',
      change: '+5.4%',
      trend: 'up',
      icon: Users,
      color: 'from-green-500 to-blue-500',
    },
  ];

  const monthlyStats = [
    { month: '1月', posts: 12, received: 980, sent: 750 },
    { month: '2月', posts: 15, received: 1200, sent: 890 },
    { month: '3月', posts: 18, received: 1450, sent: 1100 },
    { month: '4月', posts: 22, received: 1680, sent: 1350 },
    { month: '5月', posts: 19, received: 1520, sent: 1200 },
    { month: '6月', posts: 24, received: 1850, sent: 1580 },
  ];

  const recentAchievements = [
    {
      title: '月間ランキング5位',
      description: '今月の受け取りポイントでランクイン',
      date: '2024-01-15',
      icon: TrendingUp,
      color: 'from-blue-500 to-purple-500',
    },
    {
      title: '新バッジ獲得',
      description: '「感謝の達人」バッジを獲得',
      date: '2024-01-10',
      icon: Award,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      title: '投稿数マイルストーン',
      description: '150回の投稿を達成',
      date: '2024-01-05',
      icon: MessageCircle,
      color: 'from-green-500 to-blue-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="card-gradient p-6">
              <div className="text-center py-8 text-white/60">
                <p>読み込み中...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 主要統計 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card-gradient p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* 月次トレンド */}
      <div className="card-gradient p-6">
        <h2 className="text-xl font-bold text-white mb-4">月次パフォーマンス</h2>
        <div className="space-y-4">
          {monthlyStats.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-12 text-white/80 text-sm">{item.month}</div>
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-white/60">投稿数</div>
                  <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${(item.posts / 30) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-white font-semibold">{item.posts}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-white/60">受取ポイント</div>
                  <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${(item.received / 2000) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-white font-semibold">{item.received}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-white/60">送付ポイント</div>
                  <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                      style={{ width: `${(item.sent / 2000) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-white font-semibold">{item.sent}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 最近の実績 */}
      <div className="card-gradient p-6">
        <h2 className="text-xl font-bold text-white mb-4">最近の実績</h2>
        <div className="space-y-4">
          {recentAchievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div key={index} className="flex items-start space-x-4">
                <div className={`w-10 h-10 bg-gradient-to-r ${achievement.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">{achievement.title}</h3>
                  <p className="text-white/80 text-sm mb-1">{achievement.description}</p>
                  <div className="flex items-center space-x-1 text-white/60">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">{new Date(achievement.date).toLocaleDateString('ja-JP')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}