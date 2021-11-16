/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable semi */
import { Dispatch, SetStateAction, useRef, useState } from 'react';

/**
 * Returns a stateful value in record like object type, a function to update it.
 * The new state object can be partial, the hook will merge new and old object automatically.
 */
export function useRecord<S extends Record<string, string | number | boolean>>(
  initState: S | (() => S),
): [S, Dispatch<SetStateAction<Partial<S>>>] {
  const ref = useRef<{ value: S }>();
  if (!ref.current) {
    ref.current = {
      value: typeof initState === 'function' ? initState() : initState,
    };
  }
  const [record, setState] = useState(initState);
  const callbackRef = useRef<Dispatch<SetStateAction<Partial<S>>>>(partial => {
    const newRecord = {
      ...ref.current!.value,
      ...partial,
    };
    ref.current!.value = newRecord;
    setState(newRecord);
  });
  return [record, callbackRef.current];
}
