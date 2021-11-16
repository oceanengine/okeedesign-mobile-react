import React from 'react';
import { Button } from '../../../../src/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import './index.less';

class DemoButton extends React.Component<any, any> {
  render(): JSX.Element {
    const onClickLeft = (): void => {
      this.props.history.goBack();
    };

    return (
      <div className="demo demo-button">
        <DemoHeader title="按钮" onClickLeft={onClickLeft}></DemoHeader>

        <MobileCard title="基础用法">
          <Button type="default" size="large">
            默认
          </Button>
          <Button type="primary" size="large">
            主要
          </Button>
          <Button type="success" size="large">
            成功
          </Button>
          <Button type="danger" size="large">
            危险
          </Button>
          <Button type="warning" size="large">
            警告
          </Button>
        </MobileCard>

        <MobileCard title="描边类型">
          <Button plain size="large" text="描边类型" type="primary" />
          <Button plain size="large" text="描边类型" type="success" />
          <Button plain size="large" text="描边类型" type="warning" />
          <Button plain size="large" text="描边类型" type="danger" />
        </MobileCard>

        <MobileCard title="透明类型">
          <Button fade size="large" text="透明类型" type="primary" />
          <Button fade size="large" text="透明类型" type="success" />
          <Button fade size="large" text="透明类型" type="warning" />
          <Button fade size="large" text="透明类型" type="danger" />
        </MobileCard>

        <MobileCard title="细边类型">
          <Button size="large" text="细边类型" type="primary" hairline />
          <Button size="large" text="细边类型" type="success" hairline />
          <Button size="large" text="细边类型" type="warning" hairline />
          <Button size="large" text="细边类型" type="danger" hairline />
        </MobileCard>

        <MobileCard title="形状类型">
          <Button size="large" text="直角" type="primary" square />
          <Button size="large" text="圆角" type="primary" round />
        </MobileCard>

        <MobileCard title="禁用类型">
          <Button disabled type="default" size="large">
            默认
          </Button>
          <Button disabled plain type="primary" size="large">
            禁用类型
          </Button>
          <Button disabled type="primary" size="large">
            禁用类型
          </Button>
        </MobileCard>

        <MobileCard title="尺寸类型">
          <Button text="large" size="large" />
          <Button text="large" size="large" type="primary" round />
          <Button text="normal" />
          <Button text="normal" type="primary" round />
          <br />
          <Button text="small" size="small" />
          <Button text="small" size="small" type="primary" round />
          <br />
          <Button text="midget" size="midget" />
          <Button text="midget" size="midget" type="primary" round />
          <br />
          <Button text="mini" size="mini" />
          <Button text="mini" size="mini" type="primary" round />
          <br />
          <Button text="tiny" size="tiny" />
          <Button text="tiny" type="primary" size="tiny" round />
        </MobileCard>

        <MobileCard title="文字类型">
          <Button text="文字类型" size="large" type="text" />
        </MobileCard>
      </div>
    );
  }
}

export default DemoButton;
