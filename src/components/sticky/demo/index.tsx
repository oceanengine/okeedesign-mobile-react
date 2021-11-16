import React, { useCallback, useMemo } from 'react';
import { Sticky, Button, NoticeBar } from '../../../../src/index';
import { useHistory } from 'react-router-dom';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import './index.less';

function DemoSticky(): JSX.Element {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };

  const StickyContent = useMemo(() => {
    // return <Button type="default" size="large">默认</Button>;
    return <NoticeBar type="primary">Sticky Header</NoticeBar>;
  }, []);

  const target = useCallback(() => {
    return document.querySelector('.app');
  }, []);

  return (
    <div className="demo demo-button" style={{ marginLeft: '30px' }}>
      {/* <DemoHeader title='按钮' onClickLeft={onClickLeft}></DemoHeader> */}

      <div style={{ height: '300px', background: 'pink' }}></div>
      <div style={{ height: '300px', background: 'green' }}></div>

      <MobileCard title="基础用法">
        <Sticky target={target} topOffset={0} bottomOffset={0} handleOuterScroll>
          {StickyContent}
        </Sticky>
      </MobileCard>

      <div style={{ height: '300px', background: 'green' }}></div>
      <div style={{ height: '300px', background: 'pink' }}></div>
      <div style={{ height: '300px', background: 'yellow' }}></div>
    </div>
  );
}

export default DemoSticky;
