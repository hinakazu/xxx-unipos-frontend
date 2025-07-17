'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileActivity } from '@/components/profile/ProfileActivity';
import { ProfileBadges } from '@/components/profile/ProfileBadges';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
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
    return null;
  }
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側：プロフィール情報 */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileInfo />
            <ProfileBadges />
          </div>
          
          {/* 右側：統計と活動 */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileStats />
            <ProfileActivity />
          </div>
        </div>
      </main>
    </div>
  );
}