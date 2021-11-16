import React, {
  cloneElement,
  CSSProperties,
  Fragment,
  FunctionComponentElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRefCallback } from '../../hooks';
import createBEM from '../../utils/create/createBEM';
import { addClass } from '../../utils/create/createBEM';
import Button from '../button';
import Icon from '../icon';
import Popup, { PopupProps } from '../popup';
import { PopupDrillDownItemProps } from '../popup-drill-down-item';

import { PopupDrillDownContext } from './context';

export type FlipHandler = () => void;

export type PopupMeasure = {
  width: number;
};
export interface PopupDrillDownProps extends PopupProps {
  headerTransitionDuration?: number;
  transitionDuration?: number;

  onBack?: (activeIndex: number) => void;
  onComplete?: () => void;
}

const TRANSITION_HEADER_DURATION = 250;
const TRANSITION_DURATION = 300;

const bem = createBEM('popup-drill-down');

function PopupDrillDown(props: PopupDrillDownProps): JSX.Element {
  const {
    value,
    className,
    headerTransitionDuration: propsHeaderTransitionDuration,
    transitionDuration: propsTransitionDuration,

    onChange,

    onBack,
    onComplete,

    children,
    ...extra
  } = props;

  const lastActiveIndex = useRef<number>(-1);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const classes = bem();

  useEffect(() => {
    setActiveIndex(0);
    lastActiveIndex.current = -1;
  }, [value]);

  const length = useMemo(() => {
    return React.Children.count(children);
  }, [children]);

  const [moving, setMoving] = useState(false);
  const [targetIndex, setTargetIndex] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState(0);
  const [transitionHeaderDuration, setTransitionHeaderDuration] = useState(0);
  const onTransitionEndHandler = useRef<() => void>(() => {});
  const move = (step: number): void => {
    if (moving) {
      return;
    }

    if ((step > 0 && activeIndex < length - step) || (step < 0 && activeIndex > 0)) {
      setMoving(true);
      setTargetIndex(activeIndex + step);
      setTransitionDuration(propsTransitionDuration!);
      setTransitionHeaderDuration(propsHeaderTransitionDuration!);
      onTransitionEndHandler.current = (): void => {
        setActiveIndex(activeIndex + step);
        setTransitionDuration(0);
        setTransitionHeaderDuration(0);
        setMoving(false);
      };
    }
  };

  const context = {
    forward(): void {
      move(1);
    },
    back(): void {
      move(-1);
    },
    closePopup(): void {
      onChange?.(false);
    },
  };

  const onCloseClick = useRefCallback((): void => {
    onChange?.(false);
  });
  const onBackClick = useRefCallback((): void => {
    onBack?.(activeIndex);
    move(-1);
  });
  const onCompleteClick = useRefCallback(() => {
    onComplete?.();
  });

  const measures = useRef<PopupMeasure>({
    width: 0,
  });
  const updateMeasure = (): void => {
    const container = containerRef.current;
    if (container) {
      measures.current.width = container.getBoundingClientRect().width;
    }
  };
  useEffect(() => {
    updateMeasure();
  });

  const renderHeader = (): JSX.Element => {
    const activeItem = React.Children.toArray(children).find((child, index) => {
      if (activeIndex === index) return child;
      return false;
    }) as FunctionComponentElement<PopupDrillDownItemProps>;
    const { title, right, left } = activeItem.props;

    const buttonStyle: CSSProperties = {
      transitionDuration: `${transitionHeaderDuration}ms`,
    };
    const titleStyle: CSSProperties = {
      transitionDuration: `${transitionHeaderDuration}ms`,
    };

    if (moving) {
      buttonStyle.opacity = 0;

      titleStyle.opacity = 0;
      titleStyle.marginLeft = 0;
      titleStyle.transform = 'none';
    }

    const renderOriginalHeader = (): JSX.Element => {
      return (
        <div className={bem('header')}>
          {activeIndex === 0 ? (
            <div className={bem('header-left')} onClick={onCloseClick} style={buttonStyle}>
              {left ? (
                typeof left === 'function' ? (
                  left()
                ) : (
                  left
                )
              ) : (
                <Icon className={bem('header-icon')} name="Close" />
              )}
            </div>
          ) : (
            <div className={bem('header-left')} onClick={onBackClick} style={buttonStyle}>
              {left ? (
                typeof left === 'function' ? (
                  left()
                ) : (
                  left
                )
              ) : (
                <Icon className={bem('header-icon')} name="ArrowLeft" />
              )}
            </div>
          )}
          <div className={bem('header-right')} style={buttonStyle}>
            {activeIndex === 0 ? (
              right ? (
                typeof right === 'function' ? (
                  right(onCompleteClick)
                ) : (
                  right
                )
              ) : (
                <Button type="text" onClick={onCompleteClick}>
                  完成
                </Button>
              )
            ) : typeof right === 'function' ? (
              right()
            ) : (
              right
            )}
          </div>
          <div className={bem('header-title')} style={titleStyle}>
            {typeof title === 'function' ? title() : title}
          </div>
        </div>
      );
    };

    let adjacentItem: FunctionComponentElement<PopupDrillDownItemProps>;
    let adjacentTitle: PopupDrillDownItemProps['title'];
    let adjacentLeft: PopupDrillDownItemProps['left'];
    let adjacentRight: PopupDrillDownItemProps['right'];
    let adjacentStyle: CSSProperties = {};

    if (moving) {
      adjacentItem = React.Children.toArray(children).find((child, index) => {
        if (targetIndex === index) return child;
        return false;
      }) as FunctionComponentElement<PopupDrillDownItemProps>;

      adjacentTitle = adjacentItem.props.title;
      adjacentLeft = adjacentItem.props.left;
      adjacentRight = adjacentItem.props.right;

      let adjacentMargin = '';

      if (targetIndex > activeIndex) {
        adjacentMargin = '0 0 0 -50%';
      } else {
        adjacentMargin = '0 0 0 50%';
        titleStyle.marginLeft = '100%';
        titleStyle.marginRight = '-100%';
        titleStyle.transform = 'translate(-100%)';
      }

      adjacentStyle = {
        transitionDuration: `${transitionHeaderDuration}ms`,
        margin: adjacentMargin,
        opacity: 1,
      };
    }

    const renderAdjacentHeader = (): JSX.Element => {
      return (
        <div
          className={bem('header', ['adjacent', targetIndex > activeIndex ? 'right' : 'left'])}
          style={adjacentStyle}
        >
          {targetIndex === 0 ? (
            <div className={bem('header-left')} style={buttonStyle}>
              {adjacentLeft ? (
                typeof adjacentLeft === 'function' ? (
                  adjacentLeft()
                ) : (
                  adjacentLeft
                )
              ) : (
                <Icon className={bem('header-icon')} name="Close" />
              )}
            </div>
          ) : (
            <div className={bem('header-left')} style={buttonStyle}>
              {adjacentLeft ? (
                typeof adjacentLeft === 'function' ? (
                  adjacentLeft()
                ) : (
                  adjacentLeft
                )
              ) : (
                <Icon className={bem('header-icon')} name="ArrowLeft" />
              )}
            </div>
          )}
          <div className={bem('header-right')}>
            {targetIndex === 0 ? (
              adjacentRight ? (
                typeof adjacentRight === 'function' ? (
                  adjacentRight(onCompleteClick)
                ) : (
                  adjacentRight
                )
              ) : (
                <Button type="text">完成</Button>
              )
            ) : typeof adjacentRight === 'function' ? (
              adjacentRight()
            ) : (
              adjacentRight
            )}
          </div>
          <div className={bem('header-title')}>
            {typeof adjacentTitle === 'function' ? adjacentTitle() : adjacentTitle}
          </div>
        </div>
      );
    };

    return (
      <Fragment>
        {renderOriginalHeader()}
        {renderAdjacentHeader()}
      </Fragment>
    );
  };

  const renderContent = (): JSX.Element => {
    const contentStyle: CSSProperties = {};

    contentStyle.transitionDuration = `${transitionDuration}ms`;

    if (moving) {
      const targetVector = -targetIndex * measures.current.width;
      contentStyle.transform = `translateX(${targetVector}px)`;
    } else {
      const vector = -activeIndex * measures.current.width;
      contentStyle.transform = `translateX(${vector}px)`;
    }

    const dyeingChildren = React.Children.map(children, (child, index) => {
      if (moving && index == activeIndex) {
        return cloneElement(child as FunctionComponentElement<PopupDrillDownItemProps>, {
          active: true,
        });
      }
      if (moving && index === targetIndex) {
        return cloneElement(child as FunctionComponentElement<PopupDrillDownItemProps>, {
          target: true,
        });
      }
      return child;
    });

    return (
      <div className={bem('content')}>
        <div
          className={bem('content-track')}
          style={contentStyle}
          onTransitionEnd={onTransitionEndHandler.current}
        >
          {dyeingChildren}
        </div>
      </div>
    );
  };

  return (
    <PopupDrillDownContext.Provider value={context}>
      <Popup
        value={value}
        onChange={onChange}
        position="bottom"
        className={addClass(bem('popup'), className)}
        {...extra}
      >
        <div ref={containerRef} className={classes}>
          {renderHeader()}
          {renderContent()}
        </div>
      </Popup>
    </PopupDrillDownContext.Provider>
  );
}

PopupDrillDown.defaultProps = {
  headerTransitionDuration: TRANSITION_HEADER_DURATION,
  transitionDuration: TRANSITION_DURATION,
};

export default PopupDrillDown;
