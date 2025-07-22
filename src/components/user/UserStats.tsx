'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Award, TrendingUp, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePoints } from '@/hooks/usePoints';
import { useRefresh } from '@/hooks/useRefresh';
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

interface RankingData {
  userRanking: {
    receivedPoints: number | null;
    sentPoints: number | null;
    postCount: number | null;
  };
  departmentRanking: Array<{
    rank: number;
    department: string;
    totalPoints: number;
    memberCount: number;
  }>;
  topUsers: {
    receivedPoints: Array<{
      rank: number;
      id: string;
      name: string;
      department: string;
      receivedPoints: number;
    }>;
    sentPoints: Array<{
      rank: number;
      id: string;
      name: string;
      department: string;
      sentPoints: number;
    }>;
    postCount: Array<{
      rank: number;
      id: string;
      name: string;
      department: string;
      postCount: number;
    }>;
  };
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
  const [rankingData, setRankingData] = useState<RankingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ユーザーデータと統計を取得
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
      const allPosts: Post[] = postsResponse.ok ? await postsResponse.json() : [];
      
      // ポイント取引履歴を取得
      const transactionsResponse = await fetch('/api/transactions');
      const allTransactions = transactionsResponse.ok ? await transactionsResponse.json() : [];
      
      if (postsResponse.ok) {
        const sentPosts = allPosts.filter(post => post.author.id === session.user.id);
        const receivedPosts = allPosts.filter(post => post.recipient.id === session.user.id);
        
        // 今月の開始日を取得
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // ポイント取引履歴から受け取ったポイントを計算
        const receivedTransactions = allTransactions.filter((t: any) => 
          t.userId === session.user.id && (t.type === 'POST_RECEIVE' || t.type === 'LIKE_RECEIVE')
        );
        
        const sentTransactions = allTransactions.filter((t: any) => 
          t.userId === session.user.id && (t.type === 'POST_SEND' || t.type === 'LIKE_SEND')
        );
        
        // デバッグログ
        console.log('受け取った取引:', receivedTransactions);
        console.log('送った取引:', sentTransactions);
        
        // 統計を計算（ポイント取引履歴ベース）
        const totalReceivedPoints = Math.round(receivedTransactions.reduce((sum: number, t: any) => sum + t.amount, 0) * 10) / 10;
        const totalSentPoints = Math.round(Math.abs(sentTransactions.reduce((sum: number, t: any) => sum + t.amount, 0)) * 10) / 10;
        const postCount = sentPosts.length;
        const reactionCount = receivedPosts.reduce((sum, post) => sum + post._count.likes, 0);
        
        // 今月の統計
        const thisMonthReceivedTransactions = receivedTransactions.filter((t: any) => 
          new Date(t.createdAt) >= thisMonthStart
        );
        const thisMonthSentTransactions = sentTransactions.filter((t: any) => 
          new Date(t.createdAt) >= thisMonthStart
        );
        
        const thisMonthReceived = Math.round(thisMonthReceivedTransactions.reduce((sum: number, t: any) => sum + t.amount, 0) * 10) / 10;
        const thisMonthSent = Math.round(Math.abs(thisMonthSentTransactions.reduce((sum: number, t: any) => sum + t.amount, 0)) * 10) / 10;
        
        console.log('今月受け取った取引:', thisMonthReceivedTransactions);
        console.log('今月の受け取りポイント:', thisMonthReceived);
        console.log('累積受け取りポイント:', totalReceivedPoints);
        
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

      // ランキングデータを取得
      const statsResponse = await fetch('/api/stats');
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setRankingData(stats);
      }
    } catch (error) {
      console.error('データ取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ユーザーデータと統計を取得
  useEffect(() => {
    fetchData();
  }, [session]);

  // 定期的にデータを更新（30秒ごと）
  useEffect(() => {
    if (session?.user?.id) {
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  // リフレッシュイベントを監視
  useRefresh(fetchData);

  // セッションが更新されたときにデータを再取得
  useEffect(() => {
    if (session?.user?.name) {
      const fetchData = async () => {
        try {
          const userResponse = await fetch('/api/users/me');
          if (userResponse.ok) {
            const user = await userResponse.json();
            setUserData(user);
          }
        } catch (error) {
          console.error('データ更新エラー:', error);
        }
      };
      
      fetchData();
    }
  }, [session?.user?.name]);
  
  return (
    <div className="space-y-6">
      {/* ユーザー情報 */}
      <div className="card-gradient p-6 backdrop-blur-xl">
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

      {/* 今月の統計 */}
      <div className="card-gradient p-6 backdrop-blur-xl">
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

      {/* ランキング */}
      <div className="card-gradient p-6 backdrop-blur-xl">
          <h3 className="font-semibold text-white mb-4">今月のランキング</h3>
          <div className="space-y-3">
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="text-sm text-white/80">受け取ったポイント</span>
              <span className="font-semibold text-blue-400">
                {rankingData?.userRanking.receivedPoints ? `#${rankingData.userRanking.receivedPoints}` : '---'}
              </span>
            </motion.div>
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-sm text-white/80">送ったポイント</span>
              <span className="font-semibold text-green-400">
                {rankingData?.userRanking.sentPoints ? `#${rankingData.userRanking.sentPoints}` : '---'}
              </span>
            </motion.div>
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="text-sm text-white/80">投稿数</span>
              <span className="font-semibold text-purple-400">
                {rankingData?.userRanking.postCount ? `#${rankingData.userRanking.postCount}` : '---'}
              </span>
            </motion.div>
          </div>
      </div>

      {/* 最近のバッジ */}
      <div className="card-gradient p-6 backdrop-blur-xl">
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

      {/* 部署ランキング */}
      <div className="card-gradient p-6 backdrop-blur-xl">
          <h3 className="font-semibold text-white mb-4">部署ランキング</h3>
          <div className="space-y-3">
            {rankingData?.departmentRanking.slice(0, 3).map((dept, index) => {
              const getRankColor = (rank: number) => {
                switch (rank) {
                  case 1: return 'from-yellow-400 to-orange-500';
                  case 2: return 'from-gray-400 to-gray-500';
                  case 3: return 'from-orange-400 to-red-500';
                  default: return 'from-blue-400 to-blue-500';
                }
              };

              return (
                <motion.div 
                  key={dept.department}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                >
                  <div className={`w-6 h-6 bg-gradient-to-r ${getRankColor(dept.rank)} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{dept.rank}</span>
                  </div>
                  <span className="text-sm text-white/80 flex-1">{dept.department}</span>
                  <span className="text-sm font-semibold text-white">{dept.totalPoints}pt</span>
                </motion.div>
              );
            })}
            {!rankingData?.departmentRanking.length && (
              <div className="text-center py-4 text-white/60">
                <p className="text-sm">データがありません</p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}