'use client';

import { useState, useEffect } from 'react';

// グローバルなリフレッシュイベントを管理
let refreshCallbacks: (() => void)[] = [];

export const triggerRefresh = () => {
  refreshCallbacks.forEach(callback => callback());
};

export const useRefresh = (callback: () => void) => {
  useEffect(() => {
    refreshCallbacks.push(callback);
    
    return () => {
      refreshCallbacks = refreshCallbacks.filter(cb => cb !== callback);
    };
  }, [callback]);
};