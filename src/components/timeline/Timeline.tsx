'use client';

import { useState, useEffect } from 'react';
import { PostCard } from './PostCard';

// モックデータ
const mockPosts = [
  {
    id: 1,
    author: {
      id: 1,
      name: '山田太郎',
      department: 'エンジニアリング',
      avatar: null,
    },
    recipient: {
      id: 2,
      name: '田中花子',
      department: 'デザイン',
      avatar: null,
    },
    postType: 'gratitude',
    content: '新しいUIデザインの提案、本当に素晴らしかったです！ユーザビリティを考慮した細かな配慮に感動しました。',
    points: 200,
    reactions: [
      { type: 'like', count: 5 },
      { type: 'love', count: 2 },
      { type: 'celebrate', count: 3 },
    ],
    comments: [
      {
        id: 1,
        author: { name: '佐藤次郎' },
        content: '本当にその通りですね！',
        createdAt: '2024-01-15T10:30:00Z',
      },
    ],
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 2,
    author: {
      id: 3,
      name: '佐藤次郎',
      department: '営業',
      avatar: null,
    },
    recipient: {
      id: 4,
      name: '鈴木一郎',
      department: 'マーケティング',
      avatar: null,
    },
    postType: 'praise',
    content: '今月の売上目標を大幅に超えることができたのは、素晴らしいマーケティング戦略のおかげです！',
    points: 500,
    reactions: [
      { type: 'like', count: 8 },
      { type: 'celebrate', count: 12 },
    ],
    comments: [],
    createdAt: '2024-01-15T08:15:00Z',
  },
  {
    id: 3,
    author: {
      id: 5,
      name: '高橋美咲',
      department: 'カスタマーサポート',
      avatar: null,
    },
    recipient: {
      id: 6,
      name: '伊藤健太',
      department: 'エンジニアリング',
      avatar: null,
    },
    postType: 'gratitude',
    content: '緊急のバグ修正対応、本当にありがとうございました。お客様からもお褒めの言葉をいただきました！',
    points: 300,
    reactions: [
      { type: 'like', count: 6 },
      { type: 'thanks', count: 4 },
    ],
    comments: [
      {
        id: 1,
        author: { name: '伊藤健太' },
        content: 'チームワークの賜物です！',
        createdAt: '2024-01-15T07:45:00Z',
      },
      {
        id: 2,
        author: { name: '山田太郎' },
        content: '素晴らしい連携でした',
        createdAt: '2024-01-15T07:50:00Z',
      },
    ],
    createdAt: '2024-01-15T07:30:00Z',
  },
];

interface Post {
  id: string;
  content: string;
  points: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    department: string;
    image: string | null;
  };
  recipient: {
    id: string;
    name: string;
    department: string;
    image: string | null;
  };
  likes: any[];
  _count: {
    likes: number;
  };
}

export function Timeline() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // 投稿データを取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const postsData = await response.json();
          setPosts(postsData);
        }
      } catch (error) {
        console.error('投稿データ取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 投稿データをPostCardで使用する形式に変換
  const transformedPosts = posts.map((post) => ({
    id: parseInt(post.id),
    author: {
      id: parseInt(post.author.id),
      name: post.author.name || '名前未設定',
      department: post.author.department || '部署未設定',
      avatar: post.author.image,
    },
    recipient: {
      id: parseInt(post.recipient.id),
      name: post.recipient.name || '名前未設定',
      department: post.recipient.department || '部署未設定',
      avatar: post.recipient.image,
    },
    postType: 'gratitude',
    content: post.content,
    points: post.points,
    reactions: [
      { type: 'like', count: post._count.likes || 0 },
    ],
    comments: [],
    createdAt: post.createdAt,
  }));

  return (
    <div className="space-y-6">

      {/* 投稿一覧 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-white/60">
            <p>読み込み中...</p>
          </div>
        ) : transformedPosts.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <p>まだ投稿がありません</p>
          </div>
        ) : (
          transformedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}