/* eslint-disable indent */
/* eslint-disable semi */
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Swipe, Button } from '../../../index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import './index.less';
import { SwipeIndicatorsProps } from '../index';

const DemoSwipe: FC = () => {
  // const [value, setValue] = useState<number>(2)

  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };
  return (
    <div className="demo demo-swipe">
      <DemoHeader title="轮播" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法">
        <Swipe loop={false}>
          <Swipe.Item>
            <div className="swipe-item">0</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">1</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">2</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">3</div>
          </Swipe.Item>
        </Swipe>
      </MobileCard>

      <MobileCard title="自动播放">
        <Swipe loop={true}>
          <Swipe.Item>
            <div className="swipe-item">0</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">1</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">2</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">3</div>
          </Swipe.Item>
        </Swipe>
      </MobileCard>

      <MobileCard title="禁用手势">
        <Swipe loop={true} touchable={false}>
          <Swipe.Item>
            <div className="swipe-item">0</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">1</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">2</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">3</div>
          </Swipe.Item>
        </Swipe>
      </MobileCard>

      <MobileCard title="禁止循环播放">
        <Swipe autoplay={false}>
          <Swipe.Item>
            <div className="swipe-item">0</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">1</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">2</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">3</div>
          </Swipe.Item>
        </Swipe>
      </MobileCard>

      <MobileCard title="指示器颜色">
        <Swipe indicatorActiveColor="rgb(2, 120, 255)">
          <Swipe.Item>
            <div className="swipe-item">0</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">1</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">2</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">3</div>
          </Swipe.Item>
        </Swipe>
      </MobileCard>

      <MobileCard title="自定义指示器">
        <Swipe
          indicatorColor="rgb(2, 120, 255)"
          indicators={(params: SwipeIndicatorsProps): any => {
            return (
              <div className="custom-indicator">
                {params.activeIndex}
                <span>/</span>
                {params.length}
              </div>
            );
          }}
        >
          <Swipe.Item>
            <div className="swipe-item">0</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">1</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">2</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">3</div>
          </Swipe.Item>
        </Swipe>
      </MobileCard>

      <MobileCard title="受控模式(双向绑定)">
        <Swipe loop={false}>
          <Swipe.Item>
            <div className="swipe-item">0</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">1</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">2</div>
          </Swipe.Item>
          <Swipe.Item>
            <div className="swipe-item">3</div>
          </Swipe.Item>
        </Swipe>
        <div className="button-wrap">
          <Button text="<" plain type="primary" square size="mini" />
          {Array(4)
            .fill(0)
            .map((_, i) => {
              return (
                <Button
                  key={i}
                  text={i.toString()}
                  plain={i !== 3}
                  fade={i === 3}
                  type="primary"
                  square
                  size="mini"
                />
              );
            })}
          <Button text=">" plain type="primary" square size="mini" />
        </div>
      </MobileCard>
    </div>
  );
};

export default DemoSwipe;
