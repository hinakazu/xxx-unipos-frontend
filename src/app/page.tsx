'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { PostForm } from '@/components/post/PostForm';
import { Timeline } from '@/components/timeline/Timeline';
import { UserStats } from '@/components/user/UserStats';
import { AnimatedGrid } from '@/components/ui/EnhancedCard';

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
    <div className="min-h-screen relative">
      <Header />
      
      <motion.main 
        className="container mx-auto px-4 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* メインコンテンツ */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <PostForm />
            <Timeline />
          </motion.div>
          
          {/* サイドバー */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <UserStats />
          </motion.div>
        </div>
      </motion.main>
      
      {/* 背景エフェクト */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        {/* 浮遊するシェイプ */}
        <motion.div
          className="absolute w-64 h-64 bg-white/5 rounded-full blur-3xl"
          style={{ top: '20%', left: '10%' }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-48 h-48 bg-white/5 rounded-full blur-3xl"
          style={{ top: '60%', right: '15%' }}
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}