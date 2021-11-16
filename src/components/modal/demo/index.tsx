import React from 'react';
import { Modal, Cell } from '../../../../src/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

const { alert, confirm } = Modal;

class DemoModal extends React.Component<any, any> {
  onClick(): void {
    alert({
      message: 'OKUI-轻量、可靠的React 组件库',
    });
  }

  onClick1(): void {
    confirm({
      message: 'OKUI-轻量、可靠的React 组件库',
      onCancel: (): void => {},
    });
  }

  onClick2(): void {
    alert({
      message: 'OKUI-轻量、可靠的React 组件库',
      title: 'OKUI',
    });
  }

  onClick3(): void {
    confirm({
      message: 'OKUI-轻量、可靠的React 组件库',
      title: 'OKUI',
    });
  }

  render(): JSX.Element {
    const onClickLeft = (): void => {
      this.props.history.goBack();
    };
    return (
      <div className="demo">
        <DemoHeader title="对话框" onClickLeft={onClickLeft}></DemoHeader>

        <MobileCard title="基础用法" className="cell-border-radius">
          <Cell title="单选项" border clickable isLink onClick={(): void => this.onClick()}></Cell>
          <Cell title="双选项" border clickable isLink onClick={(): void => this.onClick1()}></Cell>
        </MobileCard>

        <MobileCard title="标题类型" className="cell-border-radius">
          <Cell title="单选项" border clickable isLink onClick={(): void => this.onClick2()}></Cell>
          <Cell title="双选项" border clickable isLink onClick={(): void => this.onClick3()}></Cell>
        </MobileCard>
      </div>
    );
  }
}

export default DemoModal;
