import React from 'react';

import './index.less';

import { Radio, Cell, Dialog } from '../../../../src/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

interface State {
  valueBase: string | number;
  valueTeam: string | number;
  valueType: string | number;
  valueSize: string | number;
  valueLabel: string | number;
  showDialog: boolean;
  dialogMessage: string;
  confirmValue: string | number;
}
const initialState: State = {
  valueBase: 1,
  valueTeam: 1,
  valueType: 1,
  valueSize: 1,
  valueLabel: 1,
  showDialog: false,
  dialogMessage: '',
  confirmValue: '',
};

class DemoRadio extends React.Component<any, State> {
  readonly state: State = initialState;

  openDialog(value: string): void {
    this.setState({
      showDialog: true,
      dialogMessage: `是否确定选择${value}选项?`,
      confirmValue: value,
    });
  }

  dialogConfirm(): void {
    this.setState({
      showDialog: false,
      valueType: this.state.confirmValue,
    });
  }

  render(): JSX.Element {
    const onClickLeft = (): void => {
      this.props.history.goBack();
    };
    return (
      <div className="demo radio">
        <DemoHeader title="单选框" onClickLeft={onClickLeft}></DemoHeader>

        <MobileCard title="基础用法">
          <Radio
            name="radio"
            value={1}
            checked={this.state.valueBase === 1}
            onChange={(value): void => {
              this.setState({
                valueBase: value,
              });
            }}
          >
            单选框 1
          </Radio>
          <Radio
            name="radio"
            value={2}
            checked={this.state.valueBase === 2}
            onChange={(value): void => {
              this.setState({
                valueBase: value,
              });
            }}
          >
            单选框 2
          </Radio>
          <Radio
            name="radio"
            value={3}
            checked={this.state.valueBase === 3}
            onChange={(value): void => {
              this.setState({
                valueBase: value,
              });
            }}
          >
            单选框 3
          </Radio>
        </MobileCard>

        <MobileCard title="风格类型 - dot">
          <Radio.Group
            type="dot"
            value={this.state.valueType}
            onChange={(value): void => {
              this.setState({
                valueType: value,
              });
            }}
          >
            <Radio value={1}>单选框 1</Radio>
            <Radio value={2}>单选框 2</Radio>
            <Radio value={3}>单选框 3</Radio>
          </Radio.Group>
        </MobileCard>

        <MobileCard title="风格类型 - hook">
          <Radio.Group
            type="hook"
            value={this.state.valueType}
            onChange={(value): void => {
              this.setState({
                valueType: value,
              });
            }}
          >
            <Radio value={1}>单选框 1</Radio>
            <Radio value={2}>单选框 2</Radio>
            <Radio value={3}>单选框 3</Radio>
          </Radio.Group>
        </MobileCard>

        <MobileCard title="风格类型 - circle">
          <Radio.Group
            type="circle"
            value={this.state.valueType}
            onChange={(value): void => {
              this.setState({
                valueType: value,
              });
            }}
          >
            <Radio value={1}>单选框 1</Radio>
            <Radio value={2}>单选框 2</Radio>
            <Radio value={3}>单选框 3</Radio>
          </Radio.Group>
        </MobileCard>

        <MobileCard title="禁用状态">
          <Radio.Group type="circle" value={this.state.valueType}>
            <Radio value={1} disabled>
              单选框 1
            </Radio>
            <Radio value={2} disabled>
              单选框 2
            </Radio>
          </Radio.Group>
        </MobileCard>

        <MobileCard title="异步用法">
          <Radio.Group
            value={this.state.valueType}
            onChange={(value: any): void => {
              this.openDialog(value);
            }}
          >
            <Radio value={1}>单选框 1</Radio>
            <Radio value={2}>单选框 2</Radio>
          </Radio.Group>
        </MobileCard>
        <Dialog
          message={this.state.dialogMessage}
          value={this.state.showDialog}
          showCancelButton
          onConfirm={(): void => this.dialogConfirm()}
          onCancel={(): void => this.setState({ showDialog: false })}
        />

        <MobileCard title="组合用法">
          <Radio.Group
            type="circle"
            value={this.state.valueSize}
            onChange={(value): void => {
              this.setState({
                valueSize: value,
              });
            }}
          >
            <Cell
              title="标题"
              value={<Radio value={1} />}
              border
              onClick={(): void =>
                this.setState({
                  valueSize: 1,
                })
              }
            />
            <Cell
              title="标题"
              value={<Radio value={2} />}
              onClick={(): void =>
                this.setState({
                  valueSize: 2,
                })
              }
              border
            />
          </Radio.Group>
        </MobileCard>
      </div>
    );
  }
}

export default DemoRadio;
