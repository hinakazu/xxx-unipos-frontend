import { Header } from '@/components/layout/Header';
import { RankingList } from '@/components/ranking/RankingList';
import { RankingFilters } from '@/components/ranking/RankingFilters';

export default function RankingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="card-gradient p-6">
            <h1 className="text-2xl font-bold text-white mb-2">ランキング</h1>
            <p className="text-white/80">チームメンバーの活動をランキング形式で確認できます</p>
          </div>
          
          <RankingFilters />
          <RankingList />
        </div>
      </main>
    </div>
  );
}