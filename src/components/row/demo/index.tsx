import React from 'react';
import { Row, Col } from '../../../../src/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import './index.less';

class DemoRow extends React.Component<any, any> {
  render(): JSX.Element {
    const onClickLeft = (): void => {
      this.props.history.goBack();
    };
    return (
      <div className="demo row">
        <DemoHeader title="布局" onClickLeft={onClickLeft}></DemoHeader>

        <MobileCard title="基础用法">
          <Row>
            <Col span="8">span:8</Col>
            <Col span="8">span:8</Col>
            <Col span="8">span:8</Col>
          </Row>
          <Row>
            <Col span="4">span:4</Col>
            <Col span="16" offset="4">
              span:16 offset:4
            </Col>
          </Row>
        </MobileCard>

        <MobileCard title="设置间距">
          <Row gutter="10px">
            <Col span="8">span:8</Col>
            <Col span="8">span:8</Col>
            <Col span="8">span:8</Col>
          </Row>
        </MobileCard>

        <MobileCard title="flex">
          <Row type="flex">
            <Col span="6">span:6</Col>
            <Col span="6">span:6</Col>
            <Col span="6">span:6</Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span="6">span:6</Col>
            <Col span="6">span:6</Col>
            <Col span="6">span:6</Col>
          </Row>
          <Row type="flex" justify="end">
            <Col span="6">span:6</Col>
            <Col span="6">span:6</Col>
            <Col span="6">span:6</Col>
          </Row>
          <Row type="flex" justify="space-between">
            <Col span="6">span:6</Col>
            <Col span="6">span:6</Col>
            <Col span="6">span:6</Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col span="6">span:6</Col>
            <Col span="6">span:6</Col>
            <Col span="6">span:6</Col>
          </Row>
        </MobileCard>
      </div>
    );
  }
}

export default DemoRow;
