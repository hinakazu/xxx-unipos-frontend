'use client';

import { useState } from 'react';
import { MessageCircle, Heart, Award, Calendar } from 'lucide-react';

export function ProfileActivity() {
  const [activeTab, setActiveTab] = useState('posts');

  const activities = {
    posts: [
      {
        id: 1,
        type: 'sent',
        recipient: '田中花子',
        content: '新しいUIデザインの提案、本当に素晴らしかったです！',
        points: 200,
        reactions: 5,
        comments: 2,
        createdAt: '2024-01-15T10:30:00Z',
      },
      {
        id: 2,
        type: 'received',
        sender: '佐藤次郎',
        content: '緊急のバグ修正対応、本当にありがとうございました。',
        points: 300,
        reactions: 8,
        comments: 3,
        createdAt: '2024-01-14T15:45:00Z',
      },
      {
        id: 3,
        type: 'sent',
        recipient: '鈴木一郎',
        content: 'チーム会議での積極的な発言、チームの士気向上に貢献してくれました。',
        points: 150,
        reactions: 3,
        comments: 1,
        createdAt: '2024-01-13T09:15:00Z',
      },
    ],
    reactions: [
      {
        id: 1,
        type: 'gave',
        postAuthor: '高橋美咲',
        reactionType: 'heart',
        postContent: '新しいマーケティング戦略の提案...',
        createdAt: '2024-01-15T14:20:00Z',
      },
      {
        id: 2,
        type: 'received',
        user: '伊藤健太',
        reactionType: 'celebrate',
        postContent: '今月の目標達成しました！',
        createdAt: '2024-01-15T11:30:00Z',
      },
      {
        id: 3,
        type: 'gave',
        postAuthor: '田中花子',
        reactionType: 'like',
        postContent: 'デザインレビューでの素晴らしい指摘...',
        createdAt: '2024-01-14T16:45:00Z',
      },
    ],
    points: [
      {
        id: 1,
        type: 'received',
        from: '佐藤次郎',
        amount: 300,
        reason: '緊急のバグ修正対応',
        createdAt: '2024-01-15T10:30:00Z',
      },
      {
        id: 2,
        type: 'sent',
        to: '田中花子',
        amount: 200,
        reason: '新しいUIデザインの提案',
        createdAt: '2024-01-14T15:45:00Z',
      },
      {
        id: 3,
        type: 'received',
        from: '高橋美咲',
        amount: 150,
        reason: 'プロジェクトの協力',
        createdAt: '2024-01-13T09:15:00Z',
      },
    ],
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '数分前';
    if (diffInHours < 24) return `${diffInHours}時間前`;
    return date.toLocaleDateString('ja-JP');
  };

  const getReactionIcon = (type: string) => {
    switch (type) {
      case 'heart': return '❤️';
      case 'like': return '👍';
      case 'celebrate': return '🎉';
      case 'thanks': return '🙏';
      default: return '👍';
    }
  };

  return (
    <div className="card-gradient p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">活動履歴</h2>
      </div>

      {/* タブ */}
      <div className="flex space-x-1 mb-6">
        {[
          { key: 'posts', label: '投稿', icon: MessageCircle },
          { key: 'reactions', label: 'リアクション', icon: Heart },
          { key: 'points', label: 'ポイント', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 活動内容 */}
      <div className="space-y-4">
        {activeTab === 'posts' && (
          <>
            {activities.posts.map((post) => (
              <div key={post.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {post.type === 'sent' ? post.recipient?.charAt(0) : post.sender?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white font-semibold">
                        {post.type === 'sent' ? `${post.recipient}さんに送信` : `${post.sender}さんから受信`}
                      </span>
                      <span className="text-white/60 text-sm">{formatDate(post.createdAt)}</span>
                    </div>
                    <p className="text-white/80 text-sm mb-2">{post.content}</p>
                    <div className="flex items-center space-x-4 text-white/60 text-sm">
                      <div className="flex items-center space-x-1">
                        <Award className="w-3 h-3" />
                        <span>{post.points}pt</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{post.reactions}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'reactions' && (
          <>
            {activities.reactions.map((reaction) => (
              <div key={reaction.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getReactionIcon(reaction.reactionType)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white font-semibold">
                        {reaction.type === 'gave' 
                          ? `${reaction.postAuthor}さんの投稿にリアクション` 
                          : `${reaction.user}さんがリアクション`}
                      </span>
                      <span className="text-white/60 text-sm">{formatDate(reaction.createdAt)}</span>
                    </div>
                    <p className="text-white/80 text-sm">{reaction.postContent}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'points' && (
          <>
            {activities.points.map((point) => (
              <div key={point.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    point.type === 'received' 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                  }`}>
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white font-semibold">
                        {point.type === 'received' 
                          ? `${point.from}さんから ${point.amount}pt 受信` 
                          : `${point.to}さんに ${point.amount}pt 送信`}
                      </span>
                      <span className="text-white/60 text-sm">{formatDate(point.createdAt)}</span>
                    </div>
                    <p className="text-white/80 text-sm">{point.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* もっと見るボタン */}
      <div className="mt-6 text-center">
        <button className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
          もっと見る
        </button>
      </div>
    </div>
  );
}