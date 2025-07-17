'use client';

import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { ReactNode } from 'react';

interface EnhancedCardProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  variant?: 'default' | 'glass' | 'gradient' | 'neon' | 'cosmic';
  hoverable?: boolean;
  animated?: boolean;
  glowEffect?: boolean;
}

export function EnhancedCard({
  children,
  className = '',
  header,
  variant = 'default',
  hoverable = true,
  animated = true,
  glowEffect = false,
}: EnhancedCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/20 backdrop-blur-xl border-white/30';
      case 'gradient':
        return 'bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-xl border-white/30';
      case 'neon':
        return 'bg-gradient-to-br from-purple-500/25 to-pink-500/25 border-purple-500/40 backdrop-blur-xl';
      case 'cosmic':
        return 'bg-gradient-to-br from-blue-500/25 to-cyan-500/25 border-cyan-500/40 backdrop-blur-xl';
      default:
        return 'bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-xl border-white/30';
    }
  };

  const motionProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
    whileHover: hoverable ? { 
      y: -8, 
      scale: 1.02,
      transition: { duration: 0.2 }
    } : {},
  } : {};

  const glowClass = glowEffect ? 'animate-glow' : '';

  return (
    <motion.div {...motionProps} className={`${glowClass} ${className}`}>
      <Card
        className={`${getVariantClasses()} shadow-2xl ${
          hoverable ? 'hover:shadow-3xl hover:border-white/40' : ''
        } transition-all duration-300`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        {header && (
          <CardHeader className="pb-0">
            {header}
          </CardHeader>
        )}
        <CardBody className="p-6">
          {children}
        </CardBody>
      </Card>
    </motion.div>
  );
}

export function AnimatedGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid gap-6 ${className}`}>
      {Array.isArray(children) ? children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
          className="bounce-in"
          style={{ '--index': index } as React.CSSProperties}
        >
          {child}
        </motion.div>
      )) : children}
    </div>
  );
}

export function FloatingCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={`animate-float ${className}`}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}