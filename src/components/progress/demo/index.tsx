/* eslint-disable semi */
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Progress } from '../../../index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

import './index.less';

// const DURATION = 4000;

const DemoProgress: FC = () => {
  // const [percentage, setPercentage] = useState(0);

  // let start = 0;
  // const firstStep = (timestamp: number): void => {
  //   start = timestamp;
  //   setPercentage(0);
  //   // eslint-disable-next-line @typescript-eslint/no-use-before-define
  //   window.requestAnimationFrame(step);
  // };
  // let destoryed = false;
  // const step = (timestamp: number): void => {
  //   if (destoryed) {
  //     return;
  //   }
  //   const progress = timestamp - start;
  //   if (progress >= DURATION) {
  //     window.setTimeout(() => {
  //       if (destoryed) {
  //         return;
  //       }
  //       window.requestAnimationFrame(firstStep);
  //     }, DURATION);
  //     setPercentage(100);
  //     return;
  //   }
  //   setPercentage((progress / DURATION) * 100);
  //   window.requestAnimationFrame(step);
  // };
  // useEffect(() => {
  //   window.requestAnimationFrame(firstStep);
  //   return () => {
  //     destoryed = true;
  //   };
  // }, []);

  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };

  return (
    <div className="demo demo-progress">
      <DemoHeader title="进度条" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法">
        <Progress percentage={60}></Progress>
      </MobileCard>

      <MobileCard title="数字展示">
        <Progress percentage={60} pivotFloat style={{ marginBottom: '10px' }} />
        <Progress percentage={100} pivotFloat />
      </MobileCard>

      {/* <div className="demo-cell">
        <h4>基础用法</h4>
        <Progress percentage={percentage}></Progress>
      </div>

      <div className="demo-cell">
        <h4>中心浮动</h4>
        <Progress percentage={percentage} pivotFloat></Progress>
      </div>

      <div className="demo-cell">
        <h4>置灰</h4>
        <Progress percentage={50} inactive></Progress>
        <Progress percentage={50} inactive pivotFloat></Progress>
      </div>

      <div className="demo-cell">
        <h4>自定义样式</h4>
        <Progress
          percentage={percentage}
          barHeight={8}
          barColor="#be9d63"
          trackColor="#e9dfcc"
          pivotFloat
        ></Progress>
      </div>

      <div className="demo-cell">
        <h4>自定义中心内容</h4>
        <Progress
          percentage={percentage}
          pivot={`${((20 * percentage) / 100).toFixed(1)}M / 20.0M`}
        ></Progress>
        <Progress
          percentage={percentage}
          pivotFloat
          pivot={`${((20 * percentage) / 100).toFixed(1)}M`}
        ></Progress>
      </div> */}
    </div>
  );
};

export default DemoProgress;
