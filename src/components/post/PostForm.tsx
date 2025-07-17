'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { usePoints } from '@/hooks/usePoints';

interface User {
  id: string;
  name: string;
  department: string;
  email: string;
}

export function PostForm() {
  const [content, setContent] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [points, setPoints] = useState(100);
  const [postType, setPostType] = useState('gratitude');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { availablePoints, usePoints: consumePoints, getTimeUntilReset } = usePoints();

  // ユーザー一覧を取得
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const userData = await response.json();
          setUsers(userData);
        }
      } catch (error) {
        console.error('ユーザー取得エラー:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // ポイントを使用
    if (consumePoints(points)) {
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content,
            recipientId: selectedUser,
            points,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('投稿成功:', result);
          setContent('');
          setSelectedUser('');
          setPoints(100);
          alert('投稿しました！');
          // ページをリロードしてタイムラインを更新
          window.location.reload();
        } else {
          const error = await response.json();
          console.error('投稿エラー:', error);
          alert('投稿に失敗しました: ' + error.error);
        }
      } catch (error) {
        console.error('ネットワークエラー:', error);
        alert('ネットワークエラーが発生しました');
      }
    } else {
      alert('ポイントが不足しています');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="card-gradient p-6">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* 宛先選択 */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-white">宛先:</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white"
            required
          >
            <option value="" className="text-gray-900">メンバーを選択してください</option>
            {users.map((user) => (
              <option key={user.id} value={user.id} className="text-gray-900">
                {user.name} ({user.department || '部署未設定'})
              </option>
            ))}
          </select>
        </div>

        {/* メッセージ入力 */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="感謝の気持ちを込めてメッセージを書いてください..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent resize-none text-white placeholder:text-white/60"
            rows={4}
            required
          />
        </div>

        {/* ポイント選択 */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-white">ポイント:</label>
          <div className="flex space-x-2">
            {[50, 100, 200, 500].map((point) => (
              <button
                key={point}
                type="button"
                onClick={() => setPoints(point)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  points === point
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {point}pt
              </button>
            ))}
          </div>
          <div className="text-sm text-white/60">
            残り: <span className="font-medium text-yellow-300">{availablePoints}pt</span>
            <br />
            <span className="text-xs">次回リセット: {getTimeUntilReset()}</span>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={!content || !selectedUser || availablePoints < points || isLoading}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg hover:from-pink-600 hover:to-violet-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            <Send className="w-4 h-4" />
            <span>{isLoading ? '投稿中...' : '投稿する'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}