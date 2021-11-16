/* eslint-disable semi */
import React, { FC } from 'react';
import { Tag, Cell } from '../../../../src/index';
import { TagType } from '..';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

import './index.less';
import { useHistory } from 'react-router-dom';

interface TagPropsType {
  title: string;
  type: TagType;
}

const types: TagPropsType[] = [
  { title: '默认样式', type: 'default' },
  { title: '主要样式', type: 'primary' },
  { title: '成功样式', type: 'success' },
  { title: '警告样式', type: 'warning' },
  { title: '危险样式', type: 'danger' },
];

const DemoTag: FC = () => {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };
  return (
    <div className="demo demo-tag">
      <DemoHeader title="标签" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法">
        {types.map(t => (
          <Cell
            key={t.type}
            title={t.title}
            value={(): any => <Tag type={t.type}>标签</Tag>}
            border
          />
        ))}
      </MobileCard>

      <MobileCard title="描边类型">
        {types.map(t => (
          <Cell
            key={t.type}
            title={t.title}
            value={(): any => (
              <Tag type={t.type} plain>
                标签
              </Tag>
            )}
            border
          />
        ))}
      </MobileCard>

      <MobileCard title="圆角类型">
        {types.map(t => (
          <Cell
            key={t.type}
            title={t.title}
            value={(): any => (
              <Tag type={t.type} round>
                标签
              </Tag>
            )}
            border
          />
        ))}
      </MobileCard>

      <MobileCard title="自定义颜色">
        <Cell title="默认样式" value={(): any => <Tag color="red">标签</Tag>} />
        <Cell
          title="描边类型"
          value={(): any => (
            <Tag color="red" plain>
              标签
            </Tag>
          )}
        />
        <Cell
          title="圆角类型"
          value={(): any => (
            <Tag color="red" round>
              标签
            </Tag>
          )}
        />
        <Cell
          title="圆角类型"
          value={(): any => (
            <Tag textColor="red" color="rgba(102, 102, 102, 0.15)">
              标签
            </Tag>
          )}
        />
      </MobileCard>
    </div>
  );
};

export default DemoTag;
