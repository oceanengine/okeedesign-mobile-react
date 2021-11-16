import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function useControlled<T>(
  value: T | undefined,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [activeValue, setActiveValue] = useState(() => {
    return typeof value !== 'undefined' ? value : defaultValue;
  });

  useEffect(() => {
    if (typeof value === 'undefined') return;
    setActiveValue(value!);
  }, [value]);

  return [activeValue, setActiveValue];
}
