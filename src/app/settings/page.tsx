'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { EnhancedCard } from '@/components/ui/EnhancedCard';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import { Settings, User, Bell, Shield, Palette, Globe } from 'lucide-react';

export default function SettingsPage() {
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

  const settingsCategories = [
    {
      icon: User,
      title: 'アカウント設定',
      description: 'プロフィール情報やアカウント設定の管理',
      action: () => router.push('/profile'),
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Bell,
      title: '通知設定',
      description: '通知の設定やプッシュ通知の管理',
      action: () => alert('通知設定（実装予定）'),
      color: 'from-green-500 to-blue-500'
    },
    {
      icon: Shield,
      title: 'プライバシー設定',
      description: 'プライバシーとセキュリティの設定',
      action: () => alert('プライバシー設定（実装予定）'),
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Palette,
      title: 'テーマ設定',
      description: 'アプリのテーマや表示設定',
      action: () => alert('テーマ設定（実装予定）'),
      color: 'from-pink-500 to-violet-500'
    },
    {
      icon: Globe,
      title: '言語設定',
      description: 'アプリの言語や地域設定',
      action: () => alert('言語設定（実装予定）'),
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <motion.main 
        className="container mx-auto px-4 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Settings className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">設定</h1>
          </div>
          <p className="text-white/70">アプリの設定を管理できます</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <EnhancedCard 
                  variant="gradient" 
                  animated={true} 
                  hoverable={true}
                  className="h-full"
                >
                  <div className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {category.title}
                    </h3>
                    
                    <p className="text-white/70 text-sm mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    
                    <EnhancedButton
                      onClick={category.action}
                      variant="glass"
                      size="sm"
                      className="w-full"
                    >
                      設定を開く
                    </EnhancedButton>
                  </div>
                </EnhancedCard>
              </motion.div>
            );
          })}
        </div>

        {/* 危険な操作 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12"
        >
          <EnhancedCard variant="neon" className="border-red-500/30">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-400" />
                危険な操作
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">アカウントの削除</p>
                    <p className="text-white/60 text-sm">このアカウントを完全に削除します</p>
                  </div>
                  <EnhancedButton
                    variant="neon"
                    size="sm"
                    onClick={() => alert('アカウント削除（実装予定）')}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    削除
                  </EnhancedButton>
                </div>
              </div>
            </div>
          </EnhancedCard>
        </motion.div>
      </motion.main>
    </div>
  );
}