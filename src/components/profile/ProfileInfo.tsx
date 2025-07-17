'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Edit3, MapPin, Calendar, Mail, Phone, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { EnhancedCard } from '@/components/ui/EnhancedCard';
import { EnhancedButton } from '@/components/ui/EnhancedButton';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  department: string | null;
  position: string | null;
  createdAt: string;
  // 拡張プロフィール情報
  phone?: string;
  location?: string;
  bio?: string;
}

export function ProfileInfo() {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ユーザープロフィール取得
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return;
      
      try {
        const response = await fetch('/api/users/me');
        if (response.ok) {
          const userData = await response.json();
          setProfile({
            ...userData,
            phone: userData.phone || '',
            location: userData.location || '',
            bio: userData.bio || '',
          });
        }
      } catch (error) {
        console.error('プロフィール取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  const handleSave = async () => {
    if (!profile) return;
    
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          department: profile.department,
          position: profile.position,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(prevProfile => ({
          ...prevProfile!,
          ...updatedUser,
        }));
        
        // セッションデータを更新
        await update({
          ...session,
          user: {
            ...session?.user,
            name: updatedUser.name,
          },
        });
        
        setIsEditing(false);
        alert('プロフィールを更新しました！');
        
        // ページをリロードしてすべてのコンポーネントを更新
        window.location.reload();
      } else {
        const error = await response.json();
        alert('プロフィールの更新に失敗しました: ' + error.error);
      }
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
      alert('ネットワークエラーが発生しました');
    }
  };

  if (isLoading) {
    return (
      <div className="card-gradient p-6">
        <div className="text-center py-8 text-white/60">
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card-gradient p-6">
        <div className="text-center py-8 text-white/60">
          <p>プロフィールを取得できませんでした</p>
        </div>
      </div>
    );
  }

  return (
    <EnhancedCard variant="glass" animated={true} glowEffect={true}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.h2 
            className="text-xl font-bold text-white"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            プロフィール
          </motion.h2>
          <motion.button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors backdrop-blur-md"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Edit3 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* アバターと基本情報 */}
        <motion.div 
          className="text-center mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className="w-24 h-24 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1, rotate: 360 }}
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(236, 72, 153, 0.3)',
                '0 0 30px rgba(139, 92, 246, 0.3)',
                '0 0 20px rgba(236, 72, 153, 0.3)'
              ]
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-white font-bold text-3xl">
              {profile.name ? profile.name.charAt(0) : 'U'}
            </span>
          </motion.div>
        
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center"
                placeholder="名前"
              />
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{profile.name || 'ユーザー名未設定'}</h3>
              <p className="text-white/80">{profile.email}</p>
            </div>
          )}
        </motion.div>

      {/* 詳細情報 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Building className="w-4 h-4 text-white/60" />
          {isEditing ? (
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={profile.position || ''}
                onChange={(e) => setProfile({...profile, position: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="職位"
              />
              <input
                type="text"
                value={profile.department || ''}
                onChange={(e) => setProfile({...profile, department: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="部署"
              />
            </div>
          ) : (
            <div>
              <span className="text-white">{profile.position || '職位未設定'}</span>
              <span className="text-white/60 ml-2">({profile.department || '部署未設定'})</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Mail className="w-4 h-4 text-white/60" />
          <span className="text-white">{profile.email}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Phone className="w-4 h-4 text-white/60" />
          {isEditing ? (
            <input
              type="tel"
              value={profile.phone || ''}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              placeholder="電話番号"
            />
          ) : (
            <span className="text-white">{profile.phone || '電話番号未設定'}</span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <MapPin className="w-4 h-4 text-white/60" />
          {isEditing ? (
            <input
              type="text"
              value={profile.location || ''}
              onChange={(e) => setProfile({...profile, location: e.target.value})}
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              placeholder="所在地"
            />
          ) : (
            <span className="text-white">{profile.location || '所在地未設定'}</span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="w-4 h-4 text-white/60" />
          <span className="text-white">登録日: {new Date(profile.createdAt).toLocaleDateString('ja-JP')}</span>
        </div>
      </div>

      {/* 自己紹介 */}
      <div className="mt-6">
        <h4 className="text-white font-semibold mb-2">自己紹介</h4>
        {isEditing ? (
          <textarea
            value={profile.bio || ''}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white resize-none"
            rows={4}
            placeholder="自己紹介を入力してください"
          />
        ) : (
          <p className="text-white/80 leading-relaxed">
            {profile.bio || '自己紹介が設定されていません'}
          </p>
        )}
      </div>

        {/* 編集時の保存ボタン */}
        {isEditing && (
          <motion.div 
            className="mt-6 flex space-x-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <EnhancedButton
              onClick={handleSave}
              variant="cosmic"
              size="lg"
              className="flex-1"
              glowEffect={true}
            >
              保存
            </EnhancedButton>
            <EnhancedButton
              onClick={() => setIsEditing(false)}
              variant="glass"
              size="lg"
              className="flex-1"
            >
              キャンセル
            </EnhancedButton>
          </motion.div>
        )}
      </motion.div>
    </EnhancedCard>
  );
}