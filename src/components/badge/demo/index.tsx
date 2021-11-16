/* eslint-disable semi */
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Badge, Cell } from '../../../../src/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';

import './index.less';

const DemoBadge: FC<{}> = () => {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };
  return (
    <div className="demo demo-badge">
      <DemoHeader title="徽标" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="默认样式">
        <Cell
          title={(): any => {
            return <Badge value={8}>标题</Badge>;
          }}
          value={(): any => {
            return <Badge value={1} isDot />;
          }}
          isLink
          border
          size="large"
        ></Cell>
        <Cell
          title={(): any => {
            return <Badge value={8}>标题</Badge>;
          }}
          value={(): any => {
            return <Badge value={2} />;
          }}
          isLink
          border
          size="large"
        ></Cell>
      </MobileCard>
    </div>
  );
};

export default DemoBadge;
