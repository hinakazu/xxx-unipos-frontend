'use client';

import { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, Globe, Users } from 'lucide-react';

export function SettingsPrivacy() {
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    activityVisibility: 'team',
    pointsVisibility: 'public',
    badgesVisibility: 'public',
    allowMentions: true,
    allowDirectMessages: true,
    showOnlineStatus: true,
    dataExport: false,
    analytics: true,
  });

  const handlePrivacyChange = (key: string, value: any) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const visibilityOptions = [
    { value: 'public', label: '全員', icon: Globe },
    { value: 'team', label: 'チームメンバー', icon: Users },
    { value: 'private', label: '非公開', icon: Lock },
  ];

  return (
    <div className="card-gradient p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="w-5 h-5 text-white" />
        <h2 className="text-xl font-bold text-white">プライバシー設定</h2>
      </div>

      <div className="space-y-6">
        {/* プロフィール公開設定 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">プロフィール公開範囲</label>
          <div className="grid grid-cols-3 gap-2">
            {visibilityOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => handlePrivacyChange('profileVisibility', option.value)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    privacy.profileVisibility === option.value
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <Icon className="w-4 h-4 text-white mx-auto mb-1" />
                  <div className="text-white text-xs">{option.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 活動履歴公開設定 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">活動履歴公開範囲</label>
          <div className="grid grid-cols-3 gap-2">
            {visibilityOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => handlePrivacyChange('activityVisibility', option.value)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    privacy.activityVisibility === option.value
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <Icon className="w-4 h-4 text-white mx-auto mb-1" />
                  <div className="text-white text-xs">{option.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ポイント公開設定 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">ポイント公開範囲</label>
          <div className="grid grid-cols-3 gap-2">
            {visibilityOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => handlePrivacyChange('pointsVisibility', option.value)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    privacy.pointsVisibility === option.value
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <Icon className="w-4 h-4 text-white mx-auto mb-1" />
                  <div className="text-white text-xs">{option.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* バッジ公開設定 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">バッジ公開範囲</label>
          <div className="grid grid-cols-3 gap-2">
            {visibilityOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => handlePrivacyChange('badgesVisibility', option.value)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    privacy.badgesVisibility === option.value
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <Icon className="w-4 h-4 text-white mx-auto mb-1" />
                  <div className="text-white text-xs">{option.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* その他の設定 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-white">メンション許可</label>
              <p className="text-white/60 text-sm">他のユーザーがあなたをメンションできるようにする</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.allowMentions}
                onChange={(e) => handlePrivacyChange('allowMentions', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-white">ダイレクトメッセージ許可</label>
              <p className="text-white/60 text-sm">他のユーザーからのダイレクトメッセージを受信する</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.allowDirectMessages}
                onChange={(e) => handlePrivacyChange('allowDirectMessages', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-white">オンライン状態表示</label>
              <p className="text-white/60 text-sm">他のユーザーにオンライン状態を表示する</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.showOnlineStatus}
                onChange={(e) => handlePrivacyChange('showOnlineStatus', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-white">分析データ使用許可</label>
              <p className="text-white/60 text-sm">サービス改善のための分析データ使用を許可する</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.analytics}
                onChange={(e) => handlePrivacyChange('analytics', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* データエクスポート */}
        <div className="pt-4 border-t border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="block text-sm font-medium text-white">データエクスポート</label>
              <p className="text-white/60 text-sm">あなたのデータをダウンロードする</p>
            </div>
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              エクスポート
            </button>
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="pt-4 border-t border-white/20">
          <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200">
            設定を保存
          </button>
        </div>
      </div>
    </div>
  );
}