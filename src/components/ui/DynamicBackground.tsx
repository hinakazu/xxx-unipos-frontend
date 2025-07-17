'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BackgroundProps {
  variant?: 'aurora' | 'cosmic' | 'neon' | 'warm' | 'sunset' | 'ocean';
  children?: React.ReactNode;
}

export function DynamicBackground({ variant = 'aurora', children }: BackgroundProps) {
  const [currentVariant, setCurrentVariant] = useState(variant);
  
  // 自動的に背景を変更（5分ごと）
  useEffect(() => {
    const variants = ['aurora', 'cosmic', 'neon', 'warm', 'sunset', 'ocean'];
    const interval = setInterval(() => {
      setCurrentVariant(prev => {
        const currentIndex = variants.indexOf(prev);
        const nextIndex = (currentIndex + 1) % variants.length;
        return variants[nextIndex] as typeof variant;
      });
    }, 300000); // 5分ごと

    return () => clearInterval(interval);
  }, []);

  const getBackgroundClass = () => {
    switch (currentVariant) {
      case 'aurora':
        return 'aurora-bg';
      case 'cosmic':
        return 'cosmic-gradient';
      case 'neon':
        return 'neon-gradient';
      case 'warm':
        return 'warm-gradient';
      case 'sunset':
        return 'sunset-gradient';
      case 'ocean':
        return 'ocean-gradient';
      default:
        return 'aurora-bg';
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 動的背景 */}
      <motion.div
        key={currentVariant}
        className={`fixed inset-0 ${getBackgroundClass()}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{ zIndex: -1 }}
      />

      {/* 追加のエフェクト */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        {/* 浮遊する光の粒子 */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* 大きな光の円 */}
        <motion.div
          className="absolute w-96 h-96 bg-white rounded-full opacity-5"
          style={{
            left: '10%',
            top: '20%',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />

        <motion.div
          className="absolute w-64 h-64 bg-white rounded-full opacity-5"
          style={{
            right: '20%',
            bottom: '30%',
            filter: 'blur(60px)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}