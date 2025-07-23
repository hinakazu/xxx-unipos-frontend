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
        return 'card-gradient';
      case 'gradient':
        return 'card-gradient';
      case 'neon':
        return 'card-gradient';
      case 'cosmic':
        return 'card-gradient';
      default:
        return 'card-gradient';
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
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.10) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        {header && (
          <CardHeader className="pb-0" style={{ background: 'transparent' }}>
            {header}
          </CardHeader>
        )}
        <CardBody className="p-6" style={{ background: 'transparent' }}>
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