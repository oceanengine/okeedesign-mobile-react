import React from 'react';
import { Toast, Cell } from '../../../../src/index';
import { ToastInfoType } from '../../../../src/components/toast/';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

class DemoModal extends React.Component<any, any> {
  onToast(type?: ToastInfoType): void {
    if (type === undefined) {
      Toast.info('OKeeDesign');
    } else {
      const message = type === 'success' ? '成功提示' : type === 'error' ? '危险提示' : '警告提示';
      Toast.info({
        message,
        type,
      });
    }
  }

  onLoading(message?: string): void {
    const instance = Toast.loading(message);

    setTimeout(() => {
      instance.close();
      Toast.info('end');
    }, 3000);
  }

  onForbidClick(): void {
    Toast.info({
      message: 'OKeeDesign',
      forbidClick: true,
    });
  }

  render(): JSX.Element {
    const onClickLeft = (): void => {
      this.props.history.goBack();
    };
    return (
      <div className="demo">
        <DemoHeader title="轻提示" onClickLeft={onClickLeft}></DemoHeader>

        <MobileCard title="基础用法" className="cell-border-radius">
          <Cell
            title="成功提示"
            border
            clickable
            isLink
            onClick={(): void => this.onToast('success')}
          ></Cell>
          <Cell
            title="危险提示"
            border
            clickable
            isLink
            onClick={(): void => this.onToast('error')}
          ></Cell>
          <Cell
            title="警告提示"
            border
            clickable
            isLink
            onClick={(): void => this.onToast('warning')}
          ></Cell>
        </MobileCard>

        <MobileCard title="文字提示" className="cell-border-radius-box">
          <Cell
            title="文字提示"
            border
            clickable
            isLink
            onClick={(): void => this.onToast()}
          ></Cell>
        </MobileCard>

        <MobileCard title="加载用法" className="cell-border-radius">
          <Cell
            title="加载用法"
            border
            clickable
            isLink
            onClick={(): void => this.onLoading()}
          ></Cell>
          <Cell
            title="自定义文字"
            border
            clickable
            isLink
            onClick={(): void => this.onLoading('自定义文字')}
          ></Cell>
        </MobileCard>

        <MobileCard title="禁止点击背景" className="cell-border-radius-box">
          <Cell
            title="禁止点击背景"
            border
            clickable
            isLink
            onClick={(): void => this.onForbidClick()}
          ></Cell>
        </MobileCard>
      </div>
    );
  }
}

export default DemoModal;
