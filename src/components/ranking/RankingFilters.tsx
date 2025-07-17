'use client';

import { useState } from 'react';
import { Calendar, Users, Award } from 'lucide-react';

export function RankingFilters() {
  const [period, setPeriod] = useState('monthly');
  const [metric, setMetric] = useState('received');
  const [department, setDepartment] = useState('all');

  return (
    <div className="card-gradient p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <option value="weekly" className="text-gray-900">今週</option>
            <option value="monthly" className="text-gray-900">今月</option>
            <option value="quarterly" className="text-gray-900">今四半期</option>
            <option value="yearly" className="text-gray-900">今年</option>
          </select>
        </div>

        {/* 指標選択 */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Award className="w-4 h-4 inline mr-2" />
            指標
          </label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
          >
            <option value="received" className="text-gray-900">受け取ったポイント</option>
            <option value="sent" className="text-gray-900">送ったポイント</option>
            <option value="posts" className="text-gray-900">投稿数</option>
            <option value="reactions" className="text-gray-900">リアクション数</option>
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
      </div>
    </div>
  );
}