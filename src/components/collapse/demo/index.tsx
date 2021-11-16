/* eslint-disable semi */
import React, { FC, useState } from 'react';
import { Collapse } from '../../../../src/index';
import { CollapseProps } from '..';
import { useHistory } from 'react-router-dom';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';

const DemoCollapse: FC = () => {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };
  const [activeNameBasic, setActiveNameBasic] = useState<CollapseProps['value']>(undefined);
  const [activeNameAccordion, setActiveNameAccordion] = useState<CollapseProps['value']>(undefined);
  const [activeNameSlot, setActiveNameSlot] = useState<CollapseProps['value']>(undefined);

  return (
    <div className="demo demo-collapse">
      <DemoHeader title="折叠面板" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法">
        <Collapse value={activeNameBasic} onChange={setActiveNameBasic}>
          <Collapse.Item name="ci-1" title="标题 1" message="内容 1"></Collapse.Item>
          <Collapse.Item name="ci-2" title="标题 2" message="内容 2" isLink={false}></Collapse.Item>
          <Collapse.Item name="ci-3" title="禁用状态" disabled>
            禁用状态
          </Collapse.Item>
        </Collapse>
      </MobileCard>

      <MobileCard title="手风琴模式">
        <Collapse value={activeNameAccordion} onChange={setActiveNameAccordion} accordion>
          <Collapse.Item name="ci-1" title="标题 1" message="内容 1"></Collapse.Item>
          <Collapse.Item name="ci-2" title="标题 2" message="内容 2"></Collapse.Item>
          <Collapse.Item name="ci-3" title="标题 3" message="内容 3"></Collapse.Item>
        </Collapse>
      </MobileCard>

      <MobileCard title="插槽用法">
        <Collapse value={activeNameSlot} onChange={setActiveNameSlot}>
          <Collapse.Item name="ci-1" title="标题 1">
            <p style={{ padding: '10px' }}>内容</p>
          </Collapse.Item>
        </Collapse>
      </MobileCard>
    </div>
  );
};

export default DemoCollapse;
