import React, { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import { useCompositionInput } from '../../hooks';
import createBEM from '../../utils/create/createBEM';
import { preventDefault } from '../../utils/dom/event';
import { UnionOmit } from '../../utils/types';
import Icon from '../icon';

export type SearchSize = 'normal' | 'large';
export type SearchType = 'plain' | 'stroke' | 'center';
export type SearchShape = 'square' | 'round';
export type SearchSelf = {
  value: string;
  placeholder: string;
  clearable: boolean;
  cancelable: boolean;
  size: SearchSize;
  shape: SearchShape;
  type: SearchType;
  autoFocus: boolean;

  onSearch?(value: string): void;
  onChange?(value: string): void;
  onClear?(): void;
  onCancel?(): void;
  onFocus?(): void;
  onBlur?(): void;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
};

export type SearchProps = UnionOmit<SearchSelf, HTMLAttributes<HTMLInputElement>>;

const bem = createBEM('search');

function Search(props: SearchProps): JSX.Element {
  const {
    value,
    placeholder,
    clearable,
    cancelable,
    size,
    shape,
    type,
    autoFocus,

    onSearch,
    onChange,
    onClear,
    onCancel,
    onFocus: propsOnFocus,
    onBlur: propsOnBlur,
    onKeyPress: propsOnKeyPress,
    onCompositionStart: propsOnCompositionStart,
    onCompositionUpdate: propsOnCompositionUpdate,
    onCompositionEnd: propsOnCompositionEnd,
  } = props;

  const [controlledValue, setControlledValue] = useState(value);
  const [focused, setFocused] = useState(false);

  const className = bem([type, size]);

  const inputRef = useRef<HTMLInputElement>(null);

  const compositionCallbacks = useCompositionInput({
    onValueChange: v => {
      setControlledValue(value);
      onChange?.(v);
    },
    onChange: e => {
      setControlledValue(e.target.value);
    },
    onCompositionStart: propsOnCompositionStart,
    onCompositionUpdate: propsOnCompositionUpdate,
    onCompositionEnd: propsOnCompositionEnd,
  });

  const onFocus = (): void => {
    setFocused(true);
    propsOnFocus?.();
  };

  const onBlur = (): void => {
    setFocused(false);
    propsOnBlur?.();
  };

  const onKeyPress: React.KeyboardEventHandler<HTMLInputElement> = event => {
    const ENTER_CODE = 13;

    const keyCode = event.which || event.keyCode;
    if (keyCode === ENTER_CODE) {
      // @ts-ignore
      preventDefault(event);
      onSearch?.(value);
    }
    propsOnKeyPress?.(event);
  };

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    setControlledValue(value);
  }, [value]);

  const onClearClick = useCallback(() => {
    onChange?.('');
    onClear?.();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [onChange, onClear]);

  const onBtnClick = useCallback(() => {
    onChange?.('');
    onCancel?.();
  }, [onChange, onCancel]);

  return (
    <div className={className}>
      <form action="/" className={bem('content', [shape])}>
        <Icon className={bem('icon')} name="QuestionMark" />
        <input
          ref={inputRef}
          type="search"
          value={controlledValue}
          className={bem('input')}
          placeholder={placeholder}
          onKeyPress={onKeyPress}
          onFocus={onFocus}
          onBlur={onBlur}
          {...compositionCallbacks}
        />
        {clearable && value && focused && (
          <Icon
            className={bem('clear')}
            name="CloseOne"
            onMouseDown={onClearClick}
            onTouchStart={onClearClick}
          />
        )}
      </form>
      {cancelable && (
        <span className={bem('btn')} onMouseDown={onBtnClick} onTouchStart={onBtnClick}>
          取消
        </span>
      )}
    </div>
  );
}

Search.defaultProps = {
  value: '',
  placeholder: '请输入内容',
  clearable: true,
  cancelable: false,
  size: 'normal',
  shape: 'round',
  type: 'plain',
  autoFocus: false,
};

export default Search;
