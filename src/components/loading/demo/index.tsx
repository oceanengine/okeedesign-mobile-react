import React from 'react';
import { Loading } from '../../../../src/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

class DemoLoading extends React.Component<any, any> {
  render(): JSX.Element {
    const onClickLeft = (): void => {
      this.props.history.goBack();
    };
    return (
      <div className="demo">
        <DemoHeader title="加载" onClickLeft={onClickLeft}></DemoHeader>

        <MobileCard title="基础用法">
          <Loading />
        </MobileCard>

        <MobileCard title="加载文案">
          <Loading text="加载中..." />
        </MobileCard>

        <MobileCard title="垂直排列">
          <Loading vertical>加载中...</Loading>
        </MobileCard>

        <MobileCard title="图标大小">
          <Loading size="1.2rem" />
        </MobileCard>

        <MobileCard title="图标风格">
          <Loading />
          <Loading type="circle" style={{ marginLeft: '10px' }} />
        </MobileCard>
      </div>
    );
  }
}

export default DemoLoading;
