'use client';

import { useState } from 'react';
import { Calendar, TrendingUp, Users, BarChart3 } from 'lucide-react';

export function AnalyticsFilters() {
  const [period, setPeriod] = useState('monthly');
  const [metric, setMetric] = useState('all');
  const [department, setDepartment] = useState('all');

  return (
    <div className="card-gradient p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 期間選択 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            期間
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
          >
            <option value="weekly" className="text-gray-900">過去7日間</option>
            <option value="monthly" className="text-gray-900">過去30日間</option>
            <option value="quarterly" className="text-gray-900">過去90日間</option>
            <option value="yearly" className="text-gray-900">過去1年間</option>
          </select>
        </div>

        {/* 指標選択 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <BarChart3 className="w-4 h-4 inline mr-2" />
            指標
          </label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
          >
            <option value="all" className="text-gray-900">全指標</option>
            <option value="points" className="text-gray-900">ポイント</option>
            <option value="posts" className="text-gray-900">投稿数</option>
            <option value="reactions" className="text-gray-900">リアクション</option>
            <option value="engagement" className="text-gray-900">エンゲージメント</option>
          </select>
        </div>

        {/* 部署選択 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            部署
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
          >
            <option value="all" className="text-gray-900">全部署</option>
            <option value="engineering" className="text-gray-900">エンジニアリング</option>
            <option value="sales" className="text-gray-900">営業</option>
            <option value="marketing" className="text-gray-900">マーケティング</option>
            <option value="hr" className="text-gray-900">人事</option>
            <option value="design" className="text-gray-900">デザイン</option>
          </select>
        </div>

        {/* 比較モード */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <TrendingUp className="w-4 h-4 inline mr-2" />
            比較
          </label>
          <select
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
          >
            <option value="none" className="text-gray-900">比較なし</option>
            <option value="previous" className="text-gray-900">前期間と比較</option>
            <option value="departments" className="text-gray-900">部署間比較</option>
            <option value="yearly" className="text-gray-900">昨年同期比較</option>
          </select>
        </div>
      </div>
    </div>
  );
}