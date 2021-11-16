import React from 'react';
import { ActionSheet, Cell } from '../../../../src/index';
import { ActionSheetItemType } from '../action-sheet-item';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';

const simpleActions: ActionSheetItemType[] = [
  { name: '标签一' },
  { name: '标签二' },
  { name: '标题三', subname: '描述信息' },
];

const simpleActions1: ActionSheetItemType[] = [
  { name: '标签一', subname: '描述信息' },
  { name: '标题二', subname: '描述信息' },
  { name: '标题三', subname: '描述信息' },
];

class DemoActionSheet extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      actionSheetValue: false,
    };
  }

  onSelect(item: ActionSheetItemType, index?: number): void {
    console.log('selected::::', item, index);
  }
  onCancel(): void {
    console.log('oncancel');
  }

  handleClick(): void {
    ActionSheet.showActionSheet({
      showClose: true,
      actions: simpleActions,
      onSelect: this.onSelect.bind(this),
      onCancel: this.onCancel.bind(this),
    });
  }

  handleClick2(): void {
    ActionSheet.showActionSheet({
      showClose: true,
      cancelText: '取消',
      actions: simpleActions,
      onSelect: this.onSelect.bind(this),
      onCancel: this.onCancel.bind(this),
    });
  }

  handleClick3(): void {
    ActionSheet.showActionSheet({
      title: '测试标题',
      showClose: true,
      closeOnClickAction: false,
      actions: simpleActions,
      onSelect: this.onSelect.bind(this),
      onCancel: this.onCancel.bind(this),
    });
  }

  handleClick4(): void {
    ActionSheet.showActionSheet({
      showClose: true,
      closeOnClickAction: false,
      actions: simpleActions1,
      onSelect: this.onSelect.bind(this),
      onCancel: this.onCancel.bind(this),
    });
  }

  handleClick5(): void {
    ActionSheet.showActionSheet({
      showClose: true,
      closeOnClickAction: false,
      actions: [{ name: '标签一', loading: true }],
      onSelect: this.onSelect.bind(this),
      onCancel: this.onCancel.bind(this),
    });
  }

  handleActionSheetClick(): void {
    this.setState({
      actionSheetValue: true,
    });
  }

  handleActionSheetClose(): void {
    this.setState({
      actionSheetValue: false,
    });
  }

  handleActionSheetItemClick(item: ActionSheetItemType, index?: number): void {
    console.log('selected::::', item, index);
    this.setState({
      actionSheetValue: false,
    });
  }

  render(): JSX.Element {
    const onClickLeft = (): void => {
      this.props.history.goBack();
    };
    return (
      <div className="demo">
        <DemoHeader title="上拉菜单" onClickLeft={onClickLeft}></DemoHeader>

        <MobileCard title="基础用法" className="cell-border-radius">
          <Cell
            title="基本用法"
            border
            clickable
            isLink
            onClick={this.handleClick.bind(this)}
          ></Cell>
          <Cell
            title="展示取消按钮"
            border
            clickable
            isLink
            onClick={this.handleClick2.bind(this)}
          ></Cell>
        </MobileCard>

        <MobileCard title="附带标题" className="cell-border-radius">
          <Cell
            title="标准样式"
            border
            clickable
            isLink
            onClick={this.handleClick.bind(this)}
          ></Cell>
          <Cell
            title="展示关闭按钮"
            border
            clickable
            isLink
            onClick={this.handleClick3.bind(this)}
          ></Cell>
          <Cell
            title="展示取消按钮"
            border
            clickable
            isLink
            onClick={this.handleClick2.bind(this)}
          ></Cell>
        </MobileCard>

        <MobileCard title="更多类型" className="cell-border-radius">
          <Cell
            title="展示描述信息"
            border
            clickable
            isLink
            onClick={this.handleClick4.bind(this)}
          ></Cell>
          <Cell
            title="开关操作项"
            border
            clickable
            isLink
            onClick={this.handleClick3.bind(this)}
          ></Cell>
          <Cell
            title="模板调用"
            border
            clickable
            isLink
            onClick={this.handleActionSheetClick.bind(this)}
          ></Cell>
          {/* <Cell title="选项状态" border clickable isLink onClick={this.handleClick5.bind(this)}></Cell> */}
        </MobileCard>

        <ActionSheet.ActionSheet
          value={this.state.actionSheetValue}
          onClose={this.handleActionSheetClose.bind(this)}
        >
          {simpleActions.map((action, index) => {
            return (
              <ActionSheet.ActionSheetItem
                key={action.name}
                item={action}
                index={index}
                onClick={this.handleActionSheetItemClick.bind(this)}
              />
            );
          })}
        </ActionSheet.ActionSheet>
      </div>
    );
  }
}

export default DemoActionSheet;
