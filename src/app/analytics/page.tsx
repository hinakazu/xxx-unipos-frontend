import { Header } from '@/components/layout/Header';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { AnalyticsStats } from '@/components/analytics/AnalyticsStats';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="card-gradient p-6">
            <h1 className="text-2xl font-bold text-white mb-2">分析</h1>
            <p className="text-white/80">チームのコミュニケーション状況を詳しく分析できます</p>
          </div>
          
          <AnalyticsFilters />
          <AnalyticsStats />
          <AnalyticsCharts />
        </div>
      </main>
    </div>
  );
}