/* eslint-disable semi */
import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Header, HeaderTabs, HeaderTab } from '../../../../src/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

import './index.less';

const DemoHeaders: FC = () => {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };
  const title = 'OKee Design';

  const [activeTab, setActiveTab] = useState<string | number | boolean>('tab-1');

  const tabs = [
    {
      title: 'OKee',
      name: 'tab-1',
    },
    {
      title: 'Not OKee',
      name: 'tab-2',
    },
  ];

  return (
    <div className="demo demo-header">
      <DemoHeader title="导航栏" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法" className="cell-border-radius-box">
        <Header title={title}></Header>
      </MobileCard>

      <MobileCard title="无返回标题" className="cell-border-radius-box">
        <Header title={title} leftArrow={false}></Header>
      </MobileCard>

      <MobileCard title="自定义按钮" className="cell-border-radius-box">
        <Header
          title={title}
          left={<Button type="text">取消</Button>}
          right={<Button type="text">确定</Button>}
        ></Header>
      </MobileCard>

      <MobileCard title="样式风格" className="cell-border-radius-box">
        <Header title={title} type="primary"></Header>
      </MobileCard>

      <MobileCard title="导航栏标签" className="cell-border-radius-box">
        <Header>
          <HeaderTabs
            value={activeTab}
            onChange={(newActiveTab): void => setActiveTab(newActiveTab)}
          >
            {tabs.map(t => (
              <HeaderTab key={t.name} title={t.title} name={t.name}></HeaderTab>
            ))}
          </HeaderTabs>
        </Header>

        <Header type="primary" style={{ marginTop: '16px' }}>
          <HeaderTabs
            value={activeTab}
            onChange={(newActiveTab): void => setActiveTab(newActiveTab)}
          >
            {tabs.map(t => (
              <HeaderTab key={t.name} title={t.title} name={t.name}></HeaderTab>
            ))}
          </HeaderTabs>
        </Header>
      </MobileCard>
    </div>
  );
};

export default DemoHeaders;
