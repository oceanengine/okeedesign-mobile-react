import { ChangeEventHandler, CompositionEventHandler, useRef } from 'react';
import { useConstCallback, useRefCallback } from '../callback';

/**
 * The options type of the hook `useCompositionInput`.
 */
export interface UseCompositionInputOptions {
  /**
   * The callback when value change finally after composition end.
   * @param value The final value after composition end.
   */
  onValueChange(value: string): void;

  /**
   * The optional callback when input value changed (raw react change event).
   * You can pass the callback if needed.
   */
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;

  /**
   * The callback when input composition start.
   */
  onCompositionStart?: CompositionEventHandler<HTMLInputElement | HTMLTextAreaElement>;

  /**
   * The callback when input composition update.
   */
  onCompositionUpdate?: CompositionEventHandler<HTMLInputElement | HTMLTextAreaElement>;

  /**
   * The optional callback when input composition end.
   */
  onCompositionEnd?: CompositionEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

/**
 * The return type of the hook `useCompositionInput`.
 * the object includes several event callbacks to apply on the target element (<input> or <textarea>).
 */
export interface UseCompositionInputReturns {
  /**
   * The callback when input value changed.
   * Must be applied on the target element.
   */
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;

  /**
   * The callback when input composition start.
   * Must be applied on the target element.
   */
  onCompositionStart: CompositionEventHandler<HTMLInputElement | HTMLTextAreaElement>;

  /**
   * The callback when input composition update.
   * Must be applied on the target element.
   */
  onCompositionUpdate: CompositionEventHandler<HTMLInputElement | HTMLTextAreaElement>;

  /**
   * The callback when input composition end.
   * Must be applied on the target element.
   */
  onCompositionEnd: CompositionEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

/**
 * The hooks for processing composition input with IME.
 * Returns a object included several event callbacks to apply on the <input> or <textarea> element.
 * @param options
 */
export function useCompositionInput(
  options: UseCompositionInputOptions,
): UseCompositionInputReturns {
  const onValueChangeCallback = useRefCallback(options.onValueChange);

  const onChangeCallback = useRefCallback(options.onChange);
  const onCompositionStartCallback = useRefCallback(options.onCompositionStart);
  const onCompositionUpdateCallback = useRefCallback(options.onCompositionUpdate);
  const onCompositionEndCallback = useRefCallback(options.onCompositionEnd);

  const composingRef = useRef(false);
  const valueRef = useRef('');

  const onChange = useConstCallback<ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>>(
    e => {
      valueRef.current = e.target.value;
      onChangeCallback(e);
      if (!composingRef.current) {
        onValueChangeCallback(valueRef.current);
      }
    },
  );
  const onCompositionStart = useConstCallback<
    CompositionEventHandler<HTMLInputElement | HTMLTextAreaElement>
  >(e => {
    composingRef.current = true;
    onCompositionStartCallback(e);
  });
  const onCompositionUpdate = useConstCallback<
    CompositionEventHandler<HTMLInputElement | HTMLTextAreaElement>
  >(e => {
    composingRef.current = true;
    onCompositionUpdateCallback(e);
  });
  const onCompositionEnd = useConstCallback<
    CompositionEventHandler<HTMLInputElement | HTMLTextAreaElement>
  >(e => {
    composingRef.current = false;
    onCompositionEndCallback(e);
    onValueChangeCallback(valueRef.current);
  });

  return {
    onChange,
    onCompositionStart,
    onCompositionUpdate,
    onCompositionEnd,
  };
}
