'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Award, TrendingUp, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePoints } from '@/hooks/usePoints';
import { EnhancedCard } from '@/components/ui/EnhancedCard';

interface UserData {
  id: string;
  name: string;
  email: string;
  department: string | null;
  position: string | null;
  pointsBalance: number;
}

interface UserStats {
  totalReceivedPoints: number;
  totalSentPoints: number;
  postCount: number;
  reactionCount: number;
  thisMonthReceived: number;
  thisMonthSent: number;
  thisMonthPosts: number;
  thisMonthReactions: number;
}

interface Post {
  id: string;
  points: number;
  createdAt: string;
  author: { id: string; name: string; };
  recipient: { id: string; name: string; };
  _count: { likes: number; };
}

export function UserStats() {
  const { data: session } = useSession();
  const { availablePoints, getTimeUntilReset } = usePoints();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ユーザーデータと統計を取得
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;
      
      try {
        // ユーザーデータを取得
        const userResponse = await fetch('/api/users/me');
        if (userResponse.ok) {
          const user = await userResponse.json();
          setUserData(user);
        }

        // 投稿データを取得して統計を計算
        const postsResponse = await fetch('/api/posts');
        if (postsResponse.ok) {
          const allPosts: Post[] = await postsResponse.json();
          
          // 現在のユーザーに関連する投稿を抽出
          const userPosts = allPosts.filter(post => 
            post.author.id === session.user.id || post.recipient.id === session.user.id
          );
          
          const sentPosts = allPosts.filter(post => post.author.id === session.user.id);
          const receivedPosts = allPosts.filter(post => post.recipient.id === session.user.id);
          
          // 今月の開始日を取得
          const now = new Date();
          const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          
          // 統計を計算
          const totalReceivedPoints = receivedPosts.reduce((sum, post) => sum + post.points, 0);
          const totalSentPoints = sentPosts.reduce((sum, post) => sum + post.points, 0);
          const postCount = sentPosts.length;
          const reactionCount = receivedPosts.reduce((sum, post) => sum + post._count.likes, 0);
          
          // 今月の統計
          const thisMonthReceived = receivedPosts
            .filter(post => new Date(post.createdAt) >= thisMonthStart)
            .reduce((sum, post) => sum + post.points, 0);
          
          const thisMonthSent = sentPosts
            .filter(post => new Date(post.createdAt) >= thisMonthStart)
            .reduce((sum, post) => sum + post.points, 0);
          
          const thisMonthPosts = sentPosts
            .filter(post => new Date(post.createdAt) >= thisMonthStart)
            .length;
          
          const thisMonthReactions = receivedPosts
            .filter(post => new Date(post.createdAt) >= thisMonthStart)
            .reduce((sum, post) => sum + post._count.likes, 0);
          
          setUserStats({
            totalReceivedPoints,
            totalSentPoints,
            postCount,
            reactionCount,
            thisMonthReceived,
            thisMonthSent,
            thisMonthPosts,
            thisMonthReactions
          });
        }
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);
  
  return (
    <div className="space-y-6">
      {/* ユーザー情報 */}
      <EnhancedCard variant="gradient" animated={true} glowEffect={true}>
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-4 text-white/60">
              <p>読み込み中...</p>
            </div>
          ) : userData ? (
            <motion.div 
              className="flex items-center space-x-4 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
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
            </motion.div>
          ) : (
            <div className="text-center py-4 text-white/60">
              <p>ユーザーデータを取得できませんでした</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-2xl font-bold text-blue-400">{availablePoints}</div>
              <div className="text-sm text-white/80">今週のポイント</div>
              <div className="text-xs text-white/60 mt-1">
                リセット: {getTimeUntilReset()}
              </div>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-2xl font-bold text-green-400">{userStats?.totalReceivedPoints || 0}</div>
              <div className="text-sm text-white/80">累積受取ポイント</div>
              <div className="text-xs text-white/60 mt-1">
                総合計
              </div>
            </motion.div>
          </div>
        </div>
      </EnhancedCard>

      {/* 今月の統計 */}
      <EnhancedCard variant="glass" animated={true} hoverable={true}>
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">今月の統計</h3>
          <div className="space-y-4">
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white/80">送ったポイント</span>
              </div>
              <span className="font-semibold text-white">{userStats?.thisMonthSent || 0}pt</span>
            </motion.div>
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white/80">受け取ったポイント</span>
              </div>
              <span className="font-semibold text-white">{userStats?.thisMonthReceived || 0}pt</span>
            </motion.div>
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white/80">投稿数</span>
              </div>
              <span className="font-semibold text-white">{userStats?.thisMonthPosts || 0}</span>
            </motion.div>
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white/80">リアクション</span>
              </div>
              <span className="font-semibold text-white">{userStats?.thisMonthReactions || 0}</span>
            </motion.div>
          </div>
        </div>
      </EnhancedCard>

      {/* ランキング */}
      <EnhancedCard variant="neon" animated={true} hoverable={true}>
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">今月のランキング</h3>
          <div className="space-y-3">
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="text-sm text-white/80">受け取ったポイント</span>
              <span className="font-semibold text-blue-400">#5</span>
            </motion.div>
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-sm text-white/80">送ったポイント</span>
              <span className="font-semibold text-green-400">#3</span>
            </motion.div>
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="text-sm text-white/80">投稿数</span>
              <span className="font-semibold text-purple-400">#8</span>
            </motion.div>
          </div>
        </div>
      </EnhancedCard>

      {/* 最近のバッジ */}
      <EnhancedCard variant="gradient" animated={true} hoverable={true}>
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">最近のバッジ</h3>
          <div className="grid grid-cols-3 gap-3">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-white/80">感謝の達人</span>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-white/80">成長株</span>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-white/80">チームワーク</span>
            </motion.div>
          </div>
        </div>
      </EnhancedCard>

      {/* 部署ランキング */}
      <EnhancedCard variant="glass" animated={true} hoverable={true}>
        <div className="p-6">
          <h3 className="font-semibold text-white mb-4">部署ランキング</h3>
          <div className="space-y-3">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <span className="text-sm text-white/80 flex-1">エンジニアリング</span>
              <span className="text-sm font-semibold text-white">3,200pt</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <span className="text-sm text-white/80 flex-1">営業</span>
              <span className="text-sm font-semibold text-white">2,800pt</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <span className="text-sm text-white/80 flex-1">マーケティング</span>
              <span className="text-sm font-semibold text-white">2,400pt</span>
            </motion.div>
          </div>
        </div>
      </EnhancedCard>
    </div>
  );
}