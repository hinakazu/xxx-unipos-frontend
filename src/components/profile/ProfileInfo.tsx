'use client';

import { useState } from 'react';
import { Edit3, MapPin, Calendar, Mail, Phone, Building } from 'lucide-react';

export function ProfileInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '山田太郎',
    displayName: 'Taro Yamada',
    position: 'シニアエンジニア',
    department: 'エンジニアリング',
    email: 'taro.yamada@company.com',
    phone: '090-1234-5678',
    joinDate: '2020-04-01',
    location: '東京, 日本',
    bio: 'フルスタックエンジニアとして、チームのプロダクト開発をリードしています。新しい技術に挑戦することが好きで、チームメンバーとのコラボレーションを大切にしています。',
  });

  const handleSave = () => {
    setIsEditing(false);
    // TODO: プロフィール更新処理
  };

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
          <span className="text-white font-bold text-3xl">山</span>
        </div>
        
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center"
            />
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => setProfile({...profile, displayName: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/80 text-center"
            />
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{profile.name}</h3>
            <p className="text-white/80">{profile.displayName}</p>
          </div>
        )}
      </div>

      {/* 詳細情報 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Building className="w-4 h-4 text-white/60" />
          {isEditing ? (
            <input
              type="text"
              value={profile.position}
              onChange={(e) => setProfile({...profile, position: e.target.value})}
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          ) : (
            <div>
              <span className="text-white">{profile.position}</span>
              <span className="text-white/60 ml-2">({profile.department})</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Mail className="w-4 h-4 text-white/60" />
          {isEditing ? (
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          ) : (
            <span className="text-white">{profile.email}</span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Phone className="w-4 h-4 text-white/60" />
          {isEditing ? (
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          ) : (
            <span className="text-white">{profile.phone}</span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <MapPin className="w-4 h-4 text-white/60" />
          {isEditing ? (
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({...profile, location: e.target.value})}
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          ) : (
            <span className="text-white">{profile.location}</span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="w-4 h-4 text-white/60" />
          <span className="text-white">入社日: {new Date(profile.joinDate).toLocaleDateString('ja-JP')}</span>
        </div>
      </div>

      {/* 自己紹介 */}
      <div className="mt-6">
        <h4 className="text-white font-semibold mb-2">自己紹介</h4>
        {isEditing ? (
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white resize-none"
            rows={4}
          />
        ) : (
          <p className="text-white/80 leading-relaxed">{profile.bio}</p>
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