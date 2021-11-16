import * as React from 'react';
import ReactDOM from 'react-dom';
import throttle from 'lodash.throttle';
import { useRefCallback } from '../../hooks';
import createBEM, { addClass } from '../../utils/create/createBEM';
import { off, on } from '../../utils/dom/event';
import { RenderFunction, render } from '../../utils/types';
import Loading from '../loading';
import { useContainerResize } from '../../hooks/dom';

export interface InfiniteScrollProps extends React.HTMLAttributes<HTMLElement> {
  appendToBody?: boolean;
  distance?: number;
  end?: boolean;
  isLoading?: boolean;
  loading?: string | JSX.Element | RenderFunction<void>;
  preloadClassName?: string;
  onTouch?: () => void;
}

const bem = createBEM('infinite-scroll');

const THROTTLE_DURATION = 200;
function InfiniteScroll(props: InfiniteScrollProps): JSX.Element | null {
  const {
    appendToBody,
    className,
    loading,
    preloadClassName,
    children,
    distance,
    end,
    isLoading,
    onTouch,

    ...attrs
  } = props;

  const onTouchRef = useRefCallback(() => {
    onTouch?.();
  });

  const isLoadingRef = React.useRef(isLoading!);
  isLoadingRef.current = isLoading!;

  const containerRef = React.useRef<HTMLDivElement>(null);

  // whether has a vertical scroll bar
  const [scrolling, setScrolling] = React.useState(false);
  const isListen = React.useMemo(() => {
    return !end && scrolling;
  }, [end, scrolling]);
  const isListenRef = React.useRef(isListen);
  isListenRef.current = isListen;

  const InfiniteScrollLoading = (): JSX.Element | null => {
    if (!isListen) {
      return null;
    }
    return (
      <div className={addClass(bem('preload'), preloadClassName)}>
        {loading ? render(loading) : <Loading size="24" />}
      </div>
    );
  };

  const scrollCallbackRef = React.useRef<() => void>();

  const resizeCallback = React.useCallback(() => {
    if (appendToBody) {
      const scrollElement = document.scrollingElement;
      if (scrollElement && scrollElement.scrollHeight - window.innerHeight > 0) {
        if (scrollCallbackRef.current) {
          off(document, 'scroll', scrollCallbackRef.current);
        }
        scrollCallbackRef.current = throttle(
          (): void => {
            if (isLoadingRef.current || !isListenRef.current) {
              return;
            }
            if (
              scrollElement.scrollHeight - window.innerHeight - scrollElement.scrollTop <
              distance!
            ) {
              onTouchRef();
            }
          },
          THROTTLE_DURATION,
          {
            trailing: true,
          },
        );
        on(document, 'scroll', scrollCallbackRef.current);
        setScrolling(true);
      }
    } else {
      if (containerRef.current) {
        const scrollElement = containerRef.current!;
        if (scrollElement && scrollElement.scrollHeight - scrollElement.clientHeight > 0) {
          if (scrollCallbackRef.current) {
            off(containerRef.current, 'scroll', scrollCallbackRef.current);
          }
          scrollCallbackRef.current = throttle(
            (): void => {
              if (isLoadingRef.current || !isListenRef.current) {
                return;
              }
              if (
                scrollElement.scrollHeight - scrollElement.clientHeight - scrollElement.scrollTop <
                distance!
              ) {
                onTouchRef();
              }
            },
            THROTTLE_DURATION,
            {
              trailing: true,
            },
          );
          on(containerRef.current, 'scroll', scrollCallbackRef.current);
          setScrolling(true);
        }
      }
    }
  }, [appendToBody, distance, onTouchRef]);

  const removeResizeCallback = React.useCallback(() => {
    if (scrollCallbackRef.current) {
      off(document, 'scroll', scrollCallbackRef.current);
    }

    if (containerRef.current && scrollCallbackRef.current) {
      off(containerRef.current, 'scroll', scrollCallbackRef.current);
    }
  }, []);

  React.useEffect(() => {
    resizeCallback();

    return (): void => {
      removeResizeCallback();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  useContainerResize({
    callback: resizeCallback,
    removeCallback: removeResizeCallback,
    containerRef,
  });

  if (appendToBody) {
    if (typeof window === 'undefined') {
      return null;
    }

    return (
      <div className={addClass(bem(), className)} ref={containerRef} {...attrs}>
        {ReactDOM.createPortal(InfiniteScrollLoading(), document.body)}
        {children}
      </div>
    );
  }

  return (
    <div className={addClass(bem(), className)} ref={containerRef} {...attrs}>
      {children}
      {InfiniteScrollLoading()}
    </div>
  );
}

const defaultProps: InfiniteScrollProps = {
  appendToBody: false,
  distance: 50,
  end: false,
  isLoading: false,
};

InfiniteScroll.defaultProps = defaultProps;

export default InfiniteScroll;
