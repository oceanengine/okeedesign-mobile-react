/* eslint-disable semi */
import React from 'react';
import { Cell } from '../../../../src/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';

import './index.less';

export default class DemoCell extends React.Component<any, any> {
  render(): JSX.Element {
    const onClickLeft = (): void => {
      this.props.history.goBack();
    };
    const title = '标题';
    const content = '内容';

    // const longTitle = <div style={{
    //   overflow: 'hidden',
    //   textOverflow: 'ellipsis',
    //   whiteSpace: 'nowrap'
    // }}>sadfaasdfaasdfasdfaasdfasdfasdfasdfasd</div>;

    return (
      <div className="demo demo-comp-cell">
        <DemoHeader title="单元格" onClickLeft={onClickLeft}></DemoHeader>

        <MobileCard title="基础用法">
          <Cell size="small" title={title} value={content} border clickable></Cell>
          <Cell size="small" title={title} value={content} border clickable></Cell>
        </MobileCard>

        <MobileCard title="箭头方向">
          <Cell size="small" title={title} value={content} border clickable isLink></Cell>
          <Cell size="small" title={title} value={content} isLink arrowDirection="down"></Cell>
        </MobileCard>

        <MobileCard title="分组标题">
          <Cell.Group title="分组1">
            <Cell title={title} value={content}></Cell>
          </Cell.Group>
          <Cell.Group title="分组2">
            <Cell title={title} value={content}></Cell>
          </Cell.Group>
        </MobileCard>
      </div>
    );
  }
}
