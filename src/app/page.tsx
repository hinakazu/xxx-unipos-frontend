'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { PostForm } from '@/components/post/PostForm';
import { Timeline } from '@/components/timeline/Timeline';
import { UserStats } from '@/components/user/UserStats';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // まだ読み込み中
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">読み込み中...</div>
      </div>
    );
  }

  if (!session) {
    return null; // リダイレクト中
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            <PostForm />
            <Timeline />
          </div>
          
          {/* サイドバー */}
          <div className="lg:col-span-1">
            <UserStats />
          </div>
        </div>
      </main>
    </div>
  );
}