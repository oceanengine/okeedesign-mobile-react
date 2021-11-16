import React from 'react';
import { Cell, Dialog } from '../../../../src/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';

const initialState = {
  singleModel1: false,
  doubleModel1: false,
  multipleModel1: false,
  singleModel2: false,
  doubleModel2: false,
  multipleModel2: false,
  value6: false,
  value7: '',
};
type State = Readonly<typeof initialState>;

class DemoModal extends React.Component<any, any> {
  readonly state: State = initialState;

  render(): JSX.Element {
    const onClickLeft = (): void => {
      this.props.history.goBack();
    };
    return (
      <div className="demo">
        <DemoHeader title="自定义对话框" onClickLeft={onClickLeft}></DemoHeader>

        <MobileCard title="基础用法" className="cell-border-radius">
          <Cell
            title="单选项"
            border
            clickable
            isLink
            onClick={(): void => this.setState({ singleModel1: true })}
          ></Cell>
          <Dialog
            message="OKUI-轻量、可靠的React 组件库"
            value={this.state.singleModel1}
            onConfirm={(): void => this.setState({ singleModel1: false })}
          />
          <Cell
            title="双选项"
            border
            clickable
            isLink
            onClick={(): void => this.setState({ doubleModel1: true })}
          ></Cell>
          <Dialog
            message="OKUI-轻量、可靠的React 组件库"
            showCancelButton
            value={this.state.doubleModel1}
            onConfirm={(): void => this.setState({ doubleModel1: false })}
            onCancel={(): void => this.setState({ doubleModel1: false })}
          />
          <Cell
            title="多选项"
            border
            clickable
            isLink
            onClick={(): void => this.setState({ multipleModel1: true })}
          ></Cell>
          <Dialog
            message="未完善功能"
            showCancelButton
            value={this.state.multipleModel1}
            onConfirm={(): void => this.setState({ multipleModel1: false })}
            onCancel={(): void => this.setState({ multipleModel1: false })}
          />
        </MobileCard>

        <MobileCard title="标题类型" className="cell-border-radius">
          <Cell
            title="单选项"
            border
            clickable
            isLink
            onClick={(): void => this.setState({ singleModel2: true })}
          ></Cell>
          <Dialog
            message="OKUI-轻量、可靠的React 组件库"
            title="OKUI"
            value={this.state.singleModel2}
            onConfirm={(): void => this.setState({ singleModel2: false })}
          />
          <Cell
            title="双选项"
            border
            clickable
            isLink
            onClick={(): void => this.setState({ doubleModel2: true })}
          ></Cell>
          <Dialog
            message="OKUI-轻量、可靠的React 组件库"
            showCancelButton
            title="OKUI"
            value={this.state.doubleModel2}
            onConfirm={(): void => this.setState({ doubleModel2: false })}
            onCancel={(): void => this.setState({ doubleModel2: false })}
          />
          <Cell
            title="多选项"
            border
            clickable
            isLink
            onClick={(): void => this.setState({ multipleModel2: true })}
          ></Cell>
          <Dialog
            message="未完善功能"
            showCancelButton
            value={this.state.multipleModel2}
            onConfirm={(): void => this.setState({ multipleModel2: false })}
            onCancel={(): void => this.setState({ multipleModel2: false })}
          />
        </MobileCard>

        <MobileCard title="自定义类型" className="cell-border-radius-box">
          <Cell
            title="单选项"
            border
            clickable
            isLink
            onClick={(): void => this.setState({ value6: true })}
          ></Cell>
          <Dialog
            title="OKUI"
            value={this.state.value6}
            onConfirm={(): void => this.setState({ value6: false })}
            message="未完善功能"
          />
        </MobileCard>
      </div>
    );
  }
}

export default DemoModal;
