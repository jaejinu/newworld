'use client';

import { useCallback, useEffect } from 'react';

const DEFAULT_CLASS_NAME = 'mobileMenuOpen';

export default function useMobileMenuClass(className = DEFAULT_CLASS_NAME) {
  const toggle = useCallback(() => {
    document.documentElement.classList.toggle(className);
  }, [className]);

  const open = useCallback(() => {
    document.documentElement.classList.add(className);
  }, [className]);

  const close = useCallback(() => {
    document.documentElement.classList.remove(className);
  }, [className]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove(className);
    };
  }, [className]);

  return { toggle, open, close };
}

