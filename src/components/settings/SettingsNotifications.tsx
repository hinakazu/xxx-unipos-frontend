'use client';

import { useState } from 'react';
import { Bell, Mail, MessageCircle, Award, Users, Clock } from 'lucide-react';

export function SettingsNotifications() {
  const [notifications, setNotifications] = useState({
    email: {
      newPost: true,
      newReaction: false,
      newComment: true,
      pointsReceived: true,
      weeklyDigest: true,
      monthlyReport: true,
    },
    push: {
      newPost: true,
      newReaction: true,
      newComment: true,
      pointsReceived: true,
      mentions: true,
    },
    frequency: 'immediate',
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00',
    },
  });

  const handleNotificationChange = (category: string, key: string, value: any) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...(prev[category as keyof typeof prev] as any),
        [key]: value
      }
    }));
  };

  const notificationTypes = [
    { key: 'newPost', label: '新しい投稿', icon: MessageCircle },
    { key: 'newReaction', label: 'リアクション', icon: Award },
    { key: 'newComment', label: 'コメント', icon: MessageCircle },
    { key: 'pointsReceived', label: 'ポイント受信', icon: Award },
    { key: 'mentions', label: 'メンション', icon: Users },
  ];

  const emailTypes = [
    { key: 'newPost', label: '新しい投稿', icon: MessageCircle },
    { key: 'newReaction', label: 'リアクション', icon: Award },
    { key: 'newComment', label: 'コメント', icon: MessageCircle },
    { key: 'pointsReceived', label: 'ポイント受信', icon: Award },
    { key: 'weeklyDigest', label: '週次レポート', icon: Mail },
    { key: 'monthlyReport', label: '月次レポート', icon: Mail },
  ];

  return (
    <div className="card-gradient p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Bell className="w-5 h-5 text-white" />
        <h2 className="text-xl font-bold text-white">通知設定</h2>
      </div>

      <div className="space-y-6">
        {/* プッシュ通知 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">プッシュ通知</h3>
          <div className="space-y-3">
            {notificationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-white/60" />
                    <span className="text-white">{type.label}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.push[type.key as keyof typeof notifications.push]}
                      onChange={(e) => handleNotificationChange('push', type.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* メール通知 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">メール通知</h3>
          <div className="space-y-3">
            {emailTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-white/60" />
                    <span className="text-white">{type.label}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email[type.key as keyof typeof notifications.email]}
                      onChange={(e) => handleNotificationChange('email', type.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* 通知頻度 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">通知頻度</label>
          <select
            value={notifications.frequency}
            onChange={(e) => setNotifications(prev => ({...prev, frequency: e.target.value}))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
          >
            <option value="immediate" className="text-gray-900">即座に通知</option>
            <option value="hourly" className="text-gray-900">1時間ごと</option>
            <option value="daily" className="text-gray-900">1日1回</option>
            <option value="weekly" className="text-gray-900">週1回</option>
          </select>
        </div>

        {/* サイレント時間 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-white/60" />
              <span className="text-white font-medium">サイレント時間</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.quietHours.enabled}
                onChange={(e) => handleNotificationChange('quietHours', 'enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {notifications.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">開始時間</label>
                <input
                  type="time"
                  value={notifications.quietHours.start}
                  onChange={(e) => handleNotificationChange('quietHours', 'start', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">終了時間</label>
                <input
                  type="time"
                  value={notifications.quietHours.end}
                  onChange={(e) => handleNotificationChange('quietHours', 'end', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                />
              </div>
            </div>
          )}
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