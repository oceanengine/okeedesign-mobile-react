/* eslint-disable semi */
import React, {
  AllHTMLAttributes,
  FC,
  FocusEventHandler,
  MouseEventHandler,
  useRef,
  RefObject,
  useState,
  useEffect,
  useMemo,
  TouchEventHandler,
} from 'react';

import createBEM, { addClass } from '../../utils/create/createBEM';
import { isDef } from '../../utils';
import { getStringLen } from '../../utils/format/string';
import { RenderContent } from '../../utils/types';
import { useCompositionInput } from '../../hooks';

import Icon from '../icon';

const bem = createBEM('field');

export type FieldType = 'text' | 'number' | 'textarea';

export type FieldSize = 'normal' | 'large';

export interface FieldPropsDeclared {
  /**
   * @default 'text'
   */
  type?: FieldType;

  value?: string | number;

  defaultValue?: string | number;

  onInput?(value: string | number): void;

  // onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;

  // onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;

  onClick?: MouseEventHandler<HTMLDivElement>;

  onClear?: TouchEventHandler<HTMLElement>;

  /**
   * @default 'normal'
   */
  size?: FieldSize;

  /**
   * @default true
   */
  border?: boolean;

  /**
   * @default true
   */
  resetScroll?: boolean;

  clearable?: boolean;

  label?: RenderContent;

  labelBlock?: boolean;

  unit?: string;

  errorText?: string;

  byte?: number;
}

export type FieldProps = FieldPropsDeclared &
  Omit<AllHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, keyof FieldPropsDeclared>;

const Field: FC<FieldProps> = (props: FieldProps) => {
  const {
    className,
    style,

    type = 'text',
    value,
    defaultValue,
    onInput: propsOnInput,
    onChange: propsOnChange,
    onCompositionStart: propsOnCompositionStart,
    onCompositionUpdate: propsOnCompositionUpdate,
    onCompositionEnd: propsOnCompositionEnd,
    onFocus,
    onBlur,
    onClick,
    onClear,

    size,
    border,
    resetScroll,
    clearable,
    label,
    labelBlock,
    unit,
    errorText,
    byte,

    placeholder,
    disabled,
    readOnly,
    maxLength,

    ...attributes
  } = props;

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const [rawValue, setRawValue] = useState(value || defaultValue);
  const [focused, setFocused] = useState(false);
  const [inputLength, setInputLength] = useState(0);

  // to fixed uncontrolled issue
  // follow the value of "value"
  const shadowValue = useRef(value);
  const shadowRawValue = useRef(rawValue);

  const correctTextLength = (text: string): string => {
    const { length } = text;
    const temp = [];
    if (maxLength && byte) {
      const byteLength = getStringLen(text);
      const max = maxLength * byte;
      if (byteLength > max) {
        for (let i = 0; i < length; i++) {
          temp.push(text[i]);
          const currentLength = getStringLen(temp.join(''));
          if (currentLength >= max - 1) {
            if (currentLength + getStringLen(text[i + 1]) <= max) {
              temp.push(text[i + 1]);
            }
            return temp.join('');
          }
        }
      }
      setInputLength(Math.floor(byteLength / byte));
    } else if (maxLength) {
      for (let i = 0; i < length; i++) {
        temp.push(text[i]);
        if (i >= maxLength - 1) {
          return temp.join('');
        }
      }
    }

    return text;
  };

  useEffect(() => {
    if (typeof value === 'undefined') {
      return;
    }

    if (value !== rawValue) {
      setRawValue(value);
      shadowValue.current = value;
    }

    // transform to string
    const text = value + '';
    let newInputLength = inputLength;

    if (maxLength && byte) {
      newInputLength = Math.floor(getStringLen(text) / byte);
    } else if (maxLength) {
      newInputLength = text.length;
    }

    if (newInputLength !== inputLength) {
      setInputLength(newInputLength);
    }
  }, [value, shadowValue.current]);

  const showClear = useMemo(
    () => clearable && focused && value !== '' && isDef(value) && !readOnly,
    [clearable, focused, value, readOnly],
  );

  const isTextarea = type === 'textarea';

  const compositionCallbacks = useCompositionInput({
    onValueChange: v => {
      const correctedValue = correctTextLength(v);
      setRawValue(() => {
        return shadowValue.current;
      });
      shadowValue.current = correctedValue;
      propsOnInput?.(correctedValue);
    },
    onChange: e => {
      propsOnChange?.(e);
      setRawValue(() => {
        return shadowRawValue.current;
      });
      shadowRawValue.current = e.target.value;
    },
    onCompositionStart: propsOnCompositionStart,
    onCompositionUpdate: propsOnCompositionUpdate,
    onCompositionEnd: propsOnCompositionEnd,
  });

  const focusHandler: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = event => {
    setFocused(true);
    onFocus && onFocus(event);
    if (readOnly) {
      inputRef.current?.blur();
    }
  };

  const blurHandler: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = event => {
    setFocused(false);
    onBlur && onBlur(event);
    if (resetScroll) {
      // TODO
    }
  };

  const clearHandler: TouchEventHandler<HTMLElement> = event => {
    event.preventDefault();
    event.stopPropagation();

    if (typeof value === 'undefined') {
      setRawValue('');
    } else {
      propsOnInput?.('');
      shadowValue.current = '';
    }
    onClear && onClear(event);

    // 聚焦
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    });
  };

  const classes = bem([
    size,
    {
      disabled,
      readonly: readOnly,
      border,
      maxlength: maxLength,
      input: !isTextarea,
      'label--block': labelBlock,
      textarea: isTextarea,
      'no-border': isTextarea && !border,
      error: !!errorText,
    },
  ]);

  const labelElem = !!label && (
    <div
      className={addClass(
        bem('label', { block: labelBlock }),
        !labelBlock && !isTextarea && bem('item'),
      )}
    >
      {typeof label === 'function' ? label({}) : label}
    </div>
  );

  const inputProps: AllHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> = {
    ...attributes,
    className: addClass(bem('input'), !isTextarea && bem('item')),
    value: rawValue,
    placeholder: (placeholder === undefined && '请输入内容') || placeholder, // TODO: i18n
    disabled,
    readOnly,
    // maxLength,
    ...compositionCallbacks,
    onFocus: focusHandler,
    onBlur: blurHandler,
  };

  const inputElem = isTextarea ? (
    <textarea {...inputProps} ref={inputRef as RefObject<HTMLTextAreaElement>}></textarea>
  ) : (
    <input {...inputProps} type={type} ref={inputRef as RefObject<HTMLInputElement>}></input>
  );

  const clearElem = showClear && (
    <Icon
      className={addClass(bem('clear'), bem('item'))}
      name="CloseOne"
      onTouchStart={clearHandler}
    ></Icon>
  );

  const unitElem = !!unit && !isTextarea && (
    <div className={addClass(bem('label-right'), bem('item'))}>{unit}</div>
  );

  const wordLimitElem = !!maxLength && (
    <div className={addClass(bem('word-limit'), !isTextarea && bem('item'))}>
      {inputLength}/{maxLength}
    </div>
  );

  return (
    <div className={addClass(classes, className)} style={style} onClick={onClick}>
      <div className={bem('body')}>
        {labelElem}
        {inputElem}
        {clearElem}
        {unitElem}
        {wordLimitElem}
      </div>
    </div>
  );
};

Field.defaultProps = {
  defaultValue: '',
};

Field.displayName = 'Field';

export default Field;
