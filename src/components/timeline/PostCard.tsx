'use client';

import { useState } from 'react';
import { Award, ThumbsUp, Heart, Star, Smile } from 'lucide-react';
import { usePoints } from '@/hooks/usePoints';

interface PostCardProps {
  post: {
    id: number;
    author: {
      id: number;
      name: string;
      department: string;
      avatar: string | null;
    };
    recipient: {
      id: number;
      name: string;
      department: string;
      avatar: string | null;
    };
    postType: string;
    content: string;
    points: number;
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
  const [goodCount, setGoodCount] = useState(0);
  const { availablePoints, usePoints: consumePoints } = usePoints();

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

  const handleGoodClick = () => {
    if (consumePoints(1)) {
      setGoodCount(prev => prev + 1);
      console.log('Good clicked, point sent');
    } else {
      alert('ポイントが不足しています');
    }
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
      {post.points > 0 && (
        <div className="mb-4">
          <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-3 py-1">
            <Award className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">{post.points}pt</span>
          </div>
        </div>
      )}

      {/* リアクション */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleGoodClick}
            disabled={availablePoints < 1}
            className="flex items-center space-x-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 disabled:bg-gray-500/20 disabled:cursor-not-allowed transition-colors"
          >
            <ThumbsUp className="w-4 h-4 text-white" />
            <span className="text-sm text-white">グッド {goodCount > 0 && `(${goodCount})`}</span>
          </button>
        </div>
      </div>

    </div>
  );
}