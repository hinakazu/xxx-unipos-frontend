'use client';

import { useState, useTransition } from 'react';
import { Award, ThumbsUp, Heart, Star, Smile } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePoints } from '@/hooks/usePoints';
import { triggerRefresh } from '@/hooks/useRefresh';

interface PostCardProps {
  post: {
    id: string;
    author: {
      id: string;
      name: string;
      department: string;
      avatar: string | null;
    };
    recipient: {
      id: string;
      name: string;
      department: string;
      avatar: string | null;
    };
    postType: string;
    content: string;
    points: number;
    goodCount: number;
    reactions: Array<{
      type: string;
      count: number;
    }>;
    comments: Array<{
      id: number;
      author: { name: string };
      content: string;
      createdAt: string;
    }>;
    createdAt: string;
  };
}

export function PostCard({ post }: PostCardProps) {
  const [goodCount, setGoodCount] = useState(post.goodCount);
  const [isPending, startTransition] = useTransition();
  const { availablePoints, usePoints: consumePoints, refundPoints } = usePoints();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '数分前';
    if (diffInHours < 24) return `${diffInHours}時間前`;
    return date.toLocaleDateString('ja-JP');
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'gratitude': return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white';
      case 'praise': return 'bg-gradient-to-r from-green-500 to-blue-500 text-white';
      case 'achievement': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default: return 'bg-white/20 text-white';
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'gratitude': return '感謝';
      case 'praise': return '称賛';
      case 'achievement': return '成果報告';
      default: return type;
    }
  };

  const getReactionIcon = (type: string) => {
    switch (type) {
      case 'like': return <ThumbsUp className="w-4 h-4" />;
      case 'love': return <Heart className="w-4 h-4" />;
      case 'celebrate': return <Award className="w-4 h-4" />;
      case 'thanks': return <Star className="w-4 h-4" />;
      default: return <Smile className="w-4 h-4" />;
    }
  };

  const handleGoodClick = async () => {
    // 連続クリック防止（ただし、UI更新は即座に行う）
    if (isPending) return;
    
    // ポイント不足チェック
    if (availablePoints < 1) {
      alert('ポイントが不足しています');
      return;
    }

    // 1. オプティミスティックアップデート：UIを即座に更新
    const originalGoodCount = goodCount;
    const newGoodCount = goodCount + 1;
    setGoodCount(newGoodCount);
    
    // ポイントを即座に消費（オプティミスティック）
    if (!consumePoints(1)) {
      // もしここで失敗したら、UIを元に戻す
      setGoodCount(originalGoodCount);
      alert('ポイントが不足しています');
      return;
    }

    // 2. バックグラウンドでAPI通信
    startTransition(async () => {
      try {
        const response = await fetch(`/api/posts/${post.id}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          // サーバーからの正確な値でUIを同期
          setGoodCount(result.goodCount);
          console.log('Good clicked, point sent');
          // 統計を更新
          triggerRefresh();
        } else {
          // 3. API失敗時：UIとポイントをロールバック
          const error = await response.json();
          setGoodCount(originalGoodCount);
          refundPoints(1);
          alert(error.error || 'エラーが発生しました');
        }
      } catch (error) {
        // 3. ネットワークエラー時：UIとポイントをロールバック
        console.error('Error liking post:', error);
        setGoodCount(originalGoodCount);
        refundPoints(1);
        alert('ネットワークエラーが発生しました');
      }
    });
  };

  return (
    <div className="card-gradient p-6 backdrop-blur-xl">
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {post.author.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-white">{post.author.name}</span>
              <span className="text-sm text-white/60">→</span>
              <span className="font-semibold text-white">{post.recipient.name}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-white/60">{post.author.department}</span>
              <span className="text-sm text-white/60">→</span>
              <span className="text-sm text-white/60">{post.recipient.department}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.postType)}`}>
            {getPostTypeLabel(post.postType)}
          </span>
          <span className="text-sm text-white/60">{formatDate(post.createdAt)}</span>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="mb-4">
        <p className="text-white leading-relaxed">{post.content}</p>
      </div>

      {/* ポイント */}
      {(post.points > 0 || goodCount > 0) && (
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            {post.points > 0 && (
              <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-3 py-1">
                <Award className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">{post.points}pt</span>
              </div>
            )}
            {goodCount > 0 && (
              <motion.div 
                className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full px-3 py-1.5 shadow-lg shadow-emerald-500/25"
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <ThumbsUp className="w-4 h-4 text-white" />
                </motion.div>
                <motion.span 
                  className="text-sm font-medium text-white"
                  key={goodCount}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {goodCount}
                </motion.span>
                <span className="text-xs text-white/80 font-medium">グッド</span>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* リアクション */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <motion.button 
            onClick={handleGoodClick}
            disabled={availablePoints < 1}
            className="group relative flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 hover:from-emerald-500/30 hover:to-blue-500/30 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/25 disabled:from-gray-500/10 disabled:to-gray-500/10 disabled:border-gray-500/20 disabled:cursor-not-allowed transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div 
                className="relative"
                animate={isPending ? { rotate: [0, 15, -15, 0] } : {}}
                transition={{ duration: 0.6, repeat: isPending ? Infinity : 0 }}
              >
                <ThumbsUp className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                {isPending && (
                  <motion.div 
                    className="absolute -inset-1 bg-emerald-400/30 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-white leading-tight">
                  グッド
                </span>
                {goodCount > 0 && (
                  <motion.div 
                    className="flex items-center space-x-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-emerald-300 font-semibold">
                      {goodCount}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Hover効果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-blue-500/0 group-hover:from-emerald-500/5 group-hover:to-blue-500/5 rounded-xl transition-all duration-300" />
            
            {/* グロー効果 */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-all duration-300" />
          </motion.button>
        </div>
      </div>

    </div>
  );
}