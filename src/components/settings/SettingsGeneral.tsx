'use client';

import { useState } from 'react';
import { Settings, Monitor, Moon, Sun, Globe, Palette } from 'lucide-react';

export function SettingsGeneral() {
  const [settings, setSettings] = useState({
    theme: 'system',
    language: 'ja',
    timezone: 'Asia/Tokyo',
    colorScheme: 'default',
    animations: true,
    compactMode: false,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="card-gradient p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-5 h-5 text-white" />
        <h2 className="text-xl font-bold text-white">一般設定</h2>
      </div>

      <div className="space-y-6">
        {/* テーマ設定 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">テーマ</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'light', label: 'ライト', icon: Sun },
              { value: 'dark', label: 'ダーク', icon: Moon },
              { value: 'system', label: 'システム', icon: Monitor },
            ].map((theme) => {
              const Icon = theme.icon;
              return (
                <button
                  key={theme.value}
                  onClick={() => handleSettingChange('theme', theme.value)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    settings.theme === theme.value
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <Icon className="w-5 h-5 text-white mx-auto mb-1" />
                  <div className="text-white text-sm">{theme.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 言語設定 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Globe className="w-4 h-4 inline mr-2" />
            言語
          </label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
          >
            <option value="ja" className="text-gray-900">日本語</option>
            <option value="en" className="text-gray-900">English</option>
            <option value="ko" className="text-gray-900">한국어</option>
            <option value="zh" className="text-gray-900">中文</option>
          </select>
        </div>

        {/* タイムゾーン設定 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">タイムゾーン</label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange('timezone', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
          >
            <option value="Asia/Tokyo" className="text-gray-900">東京 (GMT+9)</option>
            <option value="UTC" className="text-gray-900">UTC (GMT+0)</option>
            <option value="America/New_York" className="text-gray-900">ニューヨーク (GMT-5)</option>
            <option value="Europe/London" className="text-gray-900">ロンドン (GMT+0)</option>
          </select>
        </div>

        {/* カラーテーマ設定 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Palette className="w-4 h-4 inline mr-2" />
            カラーテーマ
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: 'default', colors: ['from-blue-500', 'to-purple-500'] },
              { value: 'warm', colors: ['from-orange-500', 'to-pink-500'] },
              { value: 'cool', colors: ['from-green-500', 'to-blue-500'] },
              { value: 'sunset', colors: ['from-yellow-500', 'to-red-500'] },
            ].map((scheme) => (
              <button
                key={scheme.value}
                onClick={() => handleSettingChange('colorScheme', scheme.value)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  settings.colorScheme === scheme.value
                    ? 'border-blue-500'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <div className={`w-full h-6 rounded bg-gradient-to-r ${scheme.colors[0]} ${scheme.colors[1]}`} />
              </button>
            ))}
          </div>
        </div>

        {/* アニメーション設定 */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-white">アニメーション</label>
            <p className="text-white/60 text-sm">画面遷移やエフェクトのアニメーションを有効にする</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.animations}
              onChange={(e) => handleSettingChange('animations', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* コンパクトモード設定 */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-white">コンパクトモード</label>
            <p className="text-white/60 text-sm">UI要素を小さくして、より多くの情報を表示する</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
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