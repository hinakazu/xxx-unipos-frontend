'use client';

import { useState } from 'react';
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

export function Timeline() {
  const [posts] = useState(mockPosts);
  const [filter, setFilter] = useState('all');

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.postType === filter;
  });

  return (
    <div className="space-y-6">

      {/* 投稿一覧 */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* 読み込み完了メッセージ */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-white/60">
          <p>まだ投稿がありません</p>
        </div>
      )}
    </div>
  );
}