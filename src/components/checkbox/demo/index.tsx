import React from 'react';
import './index.less';
import { Checkbox } from '../../../../src/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';

interface State {
  [keys: string]: (string | number)[];
}
const initialState: State = {
  valueBase: [1],
  valueTeam: [1, 3],
  valueStyle: [1, 3],
};
class DemoCheckbox extends React.Component<any, State> {
  readonly state: State = initialState;

  render(): JSX.Element {
    const onClickLeft = (): void => {
      this.props.history.goBack();
    };
    return (
      <div className="demo checkbox">
        <DemoHeader title="复选框" onClickLeft={onClickLeft}></DemoHeader>

        <MobileCard title="基础用法">
          <Checkbox.Group
            value={this.state.valueTeam}
            onChange={(value): void => {
              this.setState({
                valueTeam: value,
              });
            }}
          >
            <Checkbox value={1}>复选框 1</Checkbox>
            <Checkbox value={2}>复选框 2</Checkbox>
            <Checkbox value={3}>复选框 3</Checkbox>
            <Checkbox value={4}>复选框 4</Checkbox>
          </Checkbox.Group>
        </MobileCard>

        <MobileCard title="自定义大小">
          <Checkbox.Group
            value={this.state.valueTeam}
            onChange={(value): void => {
              this.setState({
                valueTeam: value,
              });
            }}
          >
            <Checkbox value={1} size="small">
              复选框 1
            </Checkbox>
            <Checkbox value={2} size="normal">
              复选框 2
            </Checkbox>
            <Checkbox value={3} size="large">
              复选框 3
            </Checkbox>
          </Checkbox.Group>
        </MobileCard>

        <MobileCard title="风格类型">
          <Checkbox.Group
            value={this.state.valueStyle}
            onChange={(value): void => {
              this.setState({
                valueStyle: value,
              });
            }}
          >
            <Checkbox value={1} type="default">
              复选框 1
            </Checkbox>
            <Checkbox value={2} type="number">
              复选框 2
            </Checkbox>
            <Checkbox value={3} type="square">
              复选框 3
            </Checkbox>
            <Checkbox value={4}>复选框 4</Checkbox>
          </Checkbox.Group>
        </MobileCard>

        <MobileCard title="禁用状态">
          <Checkbox value={1} disabled>
            复选框
          </Checkbox>
          <Checkbox value={2} checked disabled>
            复选框
          </Checkbox>
        </MobileCard>
      </div>
    );
  }
}

export default DemoCheckbox;
