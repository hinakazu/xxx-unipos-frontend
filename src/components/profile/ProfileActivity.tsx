'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MessageCircle, Heart, Award, Calendar } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  points: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  recipient: {
    id: string;
    name: string;
  };
  _count: {
    likes: number;
  };
}

export function ProfileActivity() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ユーザーの投稿履歴を取得
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const allPosts = await response.json();
          // 現在のユーザーが関係する投稿のみフィルタリング
          const userPosts = allPosts.filter((post: Post) => 
            post.author.id === session.user.id || post.recipient.id === session.user.id
          );
          setPosts(userPosts);
        }
      } catch (error) {
        console.error('投稿履歴取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [session]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '数分前';
    if (diffInHours < 24) return `${diffInHours}時間前`;
    return date.toLocaleDateString('ja-JP');
  };

  const activities = {
    posts: posts.map(post => ({
      id: post.id,
      type: post.author.id === session?.user?.id ? 'sent' : 'received',
      recipient: post.recipient.name,
      sender: post.author.name,
      content: post.content,
      points: post.points,
      reactions: post._count.likes,
      comments: 0, // コメント機能は未実装
      createdAt: post.createdAt,
    })),
    reactions: [], // リアクション機能は未実装
    points: posts.map(post => ({
      id: post.id,
      type: post.author.id === session?.user?.id ? 'sent' : 'received',
      from: post.author.name,
      to: post.recipient.name,
      amount: post.points,
      reason: post.content.length > 30 ? post.content.substring(0, 30) + '...' : post.content,
      createdAt: post.createdAt,
    })),
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
        {isLoading ? (
          <div className="text-center py-8 text-white/60">
            <p>読み込み中...</p>
          </div>
        ) : (
          <>
            {activeTab === 'posts' && (
              <>
                {activities.posts.length > 0 ? (
                  activities.posts.map((post) => (
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
                  ))
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-white/40" />
                    <p>まだ投稿がありません</p>
                    <p className="text-sm mt-2">最初の投稿をしてみましょう！</p>
                  </div>
                )}
              </>
            )}
          </>
        )}

            {activeTab === 'reactions' && (
              <>
                <div className="text-center py-8 text-white/60">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-white/40" />
                  <p>まだリアクションがありません</p>
                  <p className="text-sm mt-2">投稿にリアクションしてみましょう！</p>
                </div>
              </>
            )}

            {activeTab === 'points' && (
              <>
                {activities.points.length > 0 ? (
                  activities.points.map((point) => (
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
                  ))
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <Award className="w-12 h-12 mx-auto mb-4 text-white/40" />
                    <p>まだポイント履歴がありません</p>
                    <p className="text-sm mt-2">ポイントを送信または受信してみましょう！</p>
                  </div>
                )}
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