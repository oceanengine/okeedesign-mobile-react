import React from 'react';
import { NoticeBar, Toast } from '../../../../src/index';
import './index.less';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import sendSvg from '../../../../docs/static/send.svg';

class DemoNoticeBar extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'OKeeDesign',
    };
  }

  onClick(): void {
    Toast.info({
      type: 'success',
      message: 'success',
    });
  }
  onClick1() {
    window.open('https://github.com/oceanengine/okeedesign-mobile-vue');
  }
  render(): JSX.Element {
    const onClickLeft = (): void => {
      this.props.history.goBack();
    };
    return (
      <div className="demo">
        <DemoHeader title="通知栏" onClickLeft={onClickLeft}></DemoHeader>

        <MobileCard title="基础用法">
          <NoticeBar className="notice-bar-demo" type="primary">
            {this.state.title}
          </NoticeBar>
          <NoticeBar className="notice-bar-demo" type="success">
            {this.state.title}
          </NoticeBar>
          <NoticeBar className="notice-bar-demo" type="warning">
            {this.state.title}
          </NoticeBar>
          <NoticeBar className="notice-bar-demo" type="danger">
            {this.state.title}
          </NoticeBar>
        </MobileCard>

        <MobileCard title="链接跳转">
          <NoticeBar className="notice-bar-demo" type="primary" isLink onClick={this.onClick1}>
            {this.state.title}
          </NoticeBar>
          <NoticeBar className="notice-bar-demo" type="success" isLink onClick={this.onClick1}>
            {this.state.title}
          </NoticeBar>
          <NoticeBar className="notice-bar-demo" type="warning" isLink onClick={this.onClick1}>
            {this.state.title}
          </NoticeBar>
          <NoticeBar className="notice-bar-demo" type="danger" isLink onClick={this.onClick1}>
            {this.state.title}
          </NoticeBar>
        </MobileCard>

        <MobileCard title="关闭用法">
          <NoticeBar className="notice-bar-demo" type="primary" showClose>
            {this.state.title}
          </NoticeBar>
          <NoticeBar className="notice-bar-demo" type="success" showClose>
            {this.state.title}
          </NoticeBar>
          <NoticeBar className="notice-bar-demo" type="warning" showClose>
            {this.state.title}
          </NoticeBar>
          <NoticeBar className="notice-bar-demo" type="danger" showClose>
            {this.state.title}
          </NoticeBar>
        </MobileCard>

        <MobileCard title="触发功能">
          <NoticeBar
            className="notice-bar-demo"
            type="primary"
            right={
              <a className="right-slot" onClick={this.onClick}>
                <img src={sendSvg} />
                重新发送
              </a>
            }
          >
            {this.state.title}
          </NoticeBar>
          <NoticeBar
            className="notice-bar-demo"
            type="success"
            right={
              <a className="right-slot" onClick={this.onClick}>
                <img src={sendSvg} />
                重新发送
              </a>
            }
          >
            {this.state.title}
          </NoticeBar>
          <NoticeBar
            className="notice-bar-demo"
            type="warning"
            right={
              <a className="right-slot" onClick={this.onClick}>
                <img src={sendSvg} />
                重新发送
              </a>
            }
          >
            {this.state.title}
          </NoticeBar>
          <NoticeBar
            className="notice-bar-demo"
            type="danger"
            right={
              <a className="right-slot" onClick={this.onClick}>
                <img src={sendSvg} />
                重新发送
              </a>
            }
          >
            {this.state.title}
          </NoticeBar>
        </MobileCard>

        <MobileCard title="溢出省略">
          <NoticeBar className="notice-bar-demo" ellipsis={1} showClose>
            OKeeDesign 通知栏 OKeeDesign 通知栏 OKeeDesign 通知栏 OKeeDesign 通知栏
          </NoticeBar>
          <NoticeBar ellipsis={2}>
            OKeeDesign 通知栏 OKeeDesign 通知栏 OKeeDesign 通知栏 OKeeDesign 通知栏OKeeDesign 通知栏
            OKeeDesign 通知栏 OKeeDesign 通知栏 OKeeDesign 通知栏
          </NoticeBar>
        </MobileCard>
      </div>
    );
  }
}

export default DemoNoticeBar;
