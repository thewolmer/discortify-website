'use client';

import { useEffect, useState } from 'react';

export const useLocalStorage = (key: string, initialValue: unknown) => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    if (item) {
      setStoredValue(JSON.parse(item));
    }
  }, [key]);

  const setValue = (value: unknown) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
};
