'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePoints } from '@/hooks/usePoints';
import { triggerRefresh } from '@/hooks/useRefresh';
import { EnhancedCard } from '@/components/ui/EnhancedCard';
import { EnhancedButton } from '@/components/ui/EnhancedButton';

interface User {
  id: string;
  name: string;
  department: string;
  email: string;
}

export function PostForm() {
  const [content, setContent] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [points, setPoints] = useState(50);
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

  // ユーザーリストを強制的に更新する関数
  const refreshUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      }
    } catch (error) {
      console.error('ユーザー更新エラー:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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
        setPoints(50);
        alert('投稿しました！');
        // 統計とタイムラインを更新
        triggerRefresh();
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
    
    setIsLoading(false);
  };

  return (
    <div className="card-gradient p-6 backdrop-blur-xl">
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >

        {/* 宛先選択 */}
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="text-sm font-medium text-foreground">宛先:</label>
          <motion.select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="flex-1 px-3 py-2 bg-default-200 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-foreground backdrop-blur-md transition-all duration-300 shadow-lg"
            required
            whileFocus={{ scale: 1.02 }}
          >
            <option value="" className="text-gray-900">メンバーを選択してください</option>
            {users.map((user) => (
              <option key={user.id} value={user.id} className="text-gray-900">
                {user.name} ({user.department || '部署未設定'})
              </option>
            ))}
          </motion.select>
        </motion.div>

        {/* メッセージ入力 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="感謝の気持ちを込めてメッセージを書いてください..."
            className="w-full px-4 py-3 bg-default-200 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none text-foreground placeholder:text-foreground/70 backdrop-blur-md transition-all duration-300 shadow-lg"
            rows={4}
            required
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>

        {/* ポイント選択 */}
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="text-sm font-medium text-foreground">ポイント:</label>
          <div className="flex space-x-2">
            {[50, 100, 200, 300].map((point, index) => (
              <motion.button
                key={point}
                type="button"
                onClick={() => setPoints(point)}
                disabled={availablePoints < point}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  points === point
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-foreground shadow-lg'
                    : availablePoints < point
                      ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                      : 'bg-default-200 text-foreground/90 hover:bg-default-300 border border-default-300'
                } backdrop-blur-md shadow-md`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                {point}pt
              </motion.button>
            ))}
          </div>
          <motion.div 
            className="text-sm text-foreground/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            残り: <span className="font-medium text-yellow-300">{availablePoints}pt</span>
            <br />
            <span className="text-xs">次回リセット: {getTimeUntilReset()}</span>
          </motion.div>
        </motion.div>

        {/* アクションボタン */}
        <motion.div 
          className="flex items-center justify-end"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <EnhancedButton
            type="submit"
            disabled={!content || !selectedUser || isLoading || availablePoints < points}
            variant="gradient"
            size="lg"
            loading={isLoading}
            icon={<Send className="w-4 h-4" />}
            glowEffect={true}
            rippleEffect={true}
          >
            {isLoading ? '投稿中...' : availablePoints < points ? 'ポイント不足' : '投稿する'}
          </EnhancedButton>
        </motion.div>
      </motion.form>
    </div>
  );
}