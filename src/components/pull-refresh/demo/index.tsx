import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PullRefresh } from '../../../../src/index';
import './index.less';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

function PullRefreshDemo(): JSX.Element {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };
  const [value, setValue] = useState(false);
  const timerRef = useRef<any>(null);
  const upTimerRef = useRef<any>(null);
  const onRefresh = function (): void {
    setValue(true);
    timerRef.current = setTimeout(() => {
      setValue(false);
    }, 1000);
  };

  const [up, setUp] = useState(false);
  const onUpRefresh = function (): void {
    setUp(true);
    upTimerRef.current = setTimeout(() => {
      setUp(false);
    }, 1000);
  };

  useEffect(() => {
    return (): void => {
      timerRef.current && clearTimeout(timerRef.current);
      upTimerRef.current && clearTimeout(upTimerRef.current);
    };
  }, []);
  return (
    <div className="demo demo-pull-refresh">
      <DemoHeader title="下拉刷新" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="下拉刷新">
        <PullRefresh
          value={value}
          onRefresh={onRefresh}
          direction={'down'}
          successDuration={1000}
          style={{ background: 'rgb(255, 255, 255)' }}
        >
          <div className="content" style={{ justifyContent: 'flex-start', padding: '32px 0' }}>
            <span>向下滑动页面试试</span>
          </div>
        </PullRefresh>
      </MobileCard>

      <MobileCard title="上拉加载">
        <PullRefresh
          value={up}
          onRefresh={onUpRefresh}
          direction={'up'}
          successDuration={1000}
          style={{ background: 'rgb(255, 255, 255)' }}
        >
          <div className="content" style={{ justifyContent: 'flex-end', padding: '32px 0' }}>
            <span>向上滑动页面试试</span>
          </div>
        </PullRefresh>
      </MobileCard>
    </div>
  );
}

export default PullRefreshDemo;
