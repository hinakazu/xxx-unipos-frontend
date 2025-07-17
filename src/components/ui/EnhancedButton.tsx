'use client';

import { Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface EnhancedButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'gradient' | 'glass' | 'neon' | 'cosmic';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  glowEffect?: boolean;
  rippleEffect?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function EnhancedButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  loading = false,
  icon,
  glowEffect = false,
  rippleEffect = true,
  type = 'button',
}: EnhancedButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600';
      case 'secondary':
        return 'bg-white/10 text-white border-white/20 hover:bg-white/20';
      case 'gradient':
        return 'bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-600 hover:to-violet-600';
      case 'glass':
        return 'bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20';
      case 'neon':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25';
      case 'cosmic':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25';
      default:
        return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600';
    }
  };

  const glowClass = glowEffect ? 'animate-glow' : '';

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={glowClass}
    >
      <Button
        type={type}
        size={size}
        className={`${getVariantClasses()} ${className} transition-all duration-300 relative overflow-hidden`}
        onClick={onClick}
        disabled={disabled || loading}
        startContent={icon}
      >
        {/* リップル効果 */}
        {rippleEffect && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 4, opacity: [0, 1, 0] }}
            transition={{ duration: 0.4 }}
          />
        )}
        
        {/* 光沢効果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
        
        {/* コンテンツ */}
        <span className="relative z-10 flex items-center gap-2">
          {loading && (
            <motion.div
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
          {children}
        </span>
      </Button>
    </motion.div>
  );
}

export function PulseButton({ children, className = '', ...props }: Omit<EnhancedButtonProps, 'variant'>) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.02, 1],
        boxShadow: [
          '0 0 0 0 rgba(59, 130, 246, 0.4)',
          '0 0 0 10px rgba(59, 130, 246, 0)',
          '0 0 0 0 rgba(59, 130, 246, 0)'
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`rounded-full ${className}`}
    >
      <EnhancedButton variant="primary" {...props}>
        {children}
      </EnhancedButton>
    </motion.div>
  );
}