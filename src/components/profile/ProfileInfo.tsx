'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Edit3, MapPin, Calendar, Mail, Phone, Building } from 'lucide-react';

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
  const { data: session } = useSession();
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
      // TODO: プロフィール更新API実装
      console.log('プロフィール更新:', profile);
      setIsEditing(false);
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
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
    <div className="card-gradient p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">プロフィール</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {/* アバターと基本情報 */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-3xl">
            {profile.name ? profile.name.charAt(0) : 'U'}
          </span>
        </div>
        
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
      </div>

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
        <div className="mt-6 flex space-x-3">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200"
          >
            保存
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            キャンセル
          </button>
        </div>
      )}
    </div>
  );
}