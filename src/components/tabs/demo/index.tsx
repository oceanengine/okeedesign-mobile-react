import React from 'react';
import { Tabs, Tab, Dialog } from '../../../index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import './index.less';

const initialState = {
  value: 1,
  tabList: [1, 2, 3, 4],
  doubuleTabList: [1, 2, 3, 4, 5, 6, 7, 8],
  show: false,
  temporaryValue: 1,
};
type State = Readonly<typeof initialState>;

class DemoTab extends React.Component<any, State> {
  readonly state: State = initialState;

  tabItem(): React.ReactNode {
    return this.state.tabList.map((item: number) => {
      return (
        <Tab title={`标签${item}`} name={item} key={item}>
          <div className="content">{`内容${item}`}</div>
        </Tab>
      );
    });
  }

  doubleTabItem(): React.ReactNode {
    return this.state.doubuleTabList.map((item: number) => {
      return (
        <Tab title={`标签${item}`} name={item} key={item}>
          <div className="content">{`内容${item}`}</div>
        </Tab>
      );
    });
  }

  onClick(value: any): void {
    this.setState({
      temporaryValue: value,
      show: true,
    });
  }

  onChange(value: number | string): void {
    console.log('change', value);
    this.setState({
      value: value as number,
    });
  }

  add = (): void => {
    this.setState({
      tabList: [...this.state.tabList, this.state.tabList.length + 1],
    });
  };

  render(): JSX.Element {
    const onClickLeft = (): void => {
      this.props.history.goBack();
    };
    return (
      <div className="demo demo-tabs">
        <DemoHeader title="标签页" onClickLeft={onClickLeft}></DemoHeader>

        <MobileCard title="基础用法" className="cell-border-radius-box">
          <Tabs defaultValue={2}>{this.tabItem()}</Tabs>
        </MobileCard>

        <MobileCard title="异步用法" className="cell-border-radius-box">
          <Tabs value={this.state.value} onClick={(value): void => this.onClick(value)}>
            {this.tabItem()}
          </Tabs>
        </MobileCard>

        <Dialog
          message="OKeeDesign"
          title="Do you love"
          showCancelButton
          showConfirmButton
          onCancel={(): void => this.setState({ show: false })}
          onConfirm={(): void =>
            this.setState({
              value: this.state.temporaryValue,
              show: false,
            })
          }
          value={this.state.show}
        />

        <MobileCard title="静态布局" className="cell-border-radius-box">
          <Tabs flex={false}>{this.tabItem()}</Tabs>
        </MobileCard>

        <MobileCard title="样式风格 及 自定义颜色">
          <Tabs type="card">{this.tabItem()}</Tabs>
          {/* <Tabs type="card" color="green">
            {this.tabItem()}
          </Tabs> */}
        </MobileCard>

        <MobileCard title="滚动栏滚动" className="cell-border-radius-box">
          <Tabs defaultValue={3}>{this.doubleTabItem()}</Tabs>
        </MobileCard>

        <MobileCard title="禁用状态" className="cell-border-radius-box">
          <Tabs>
            <Tab title="标签1">
              <div className="content">内容1</div>
            </Tab>
            <Tab title="标签2" disabled>
              <div className="content">内容2</div>
            </Tab>
            <Tab title="标签3">
              <div className="content">内容3</div>
            </Tab>
          </Tabs>
        </MobileCard>

        <MobileCard title="自定义标签" className="cell-border-radius-box">
          <Tabs>
            <Tab title="T.T标签">
              <div className="content">内容1</div>
            </Tab>
            <Tab title="T.T标签">
              <div className="content">内容2</div>
            </Tab>
          </Tabs>
        </MobileCard>

        <MobileCard title="滑动切换动画" className="cell-border-radius-box">
          <Tabs animated swipeable>
            {this.tabItem()}
          </Tabs>
        </MobileCard>

        {/* <div className="demo-cell">
          <h4>受控模式</h4>
          <Tabs value={this.state.value} onClick={this.onClick} onChange={this.onChange.bind(this)}>
            {this.tabItem()}
          </Tabs>
        </div>

        <div className="demo-cell">
          <h4>无边框</h4>
          <Tabs border={false}>
            {this.tabItem()}
          </Tabs>
        </div>

        <div className="demo-cell">
          <h4>下划线样式</h4>
          <Tabs lineColor="red" lineWidth="10px" lineHeight="5px">
            {this.tabItem()}
          </Tabs>
        </div>

        <div className="demo-cell">
          <h4>文字样式</h4>
          <Tabs titleActiveColor="#0278FF" titleInactiveColor="red">
            {this.tabItem()}
          </Tabs>
        </div>

        <div className="demo-cell">
          <h4>尺寸大小</h4>
          <Tabs>
            {this.tabItem()}
          </Tabs>
          <Tabs size="large">
            {this.tabItem()}
          </Tabs>
        </div>

        <div className="demo-cell">
          <h4>禁用态用法</h4>
          <Tabs>
            <Tab title="标签1">
              <div className="content">内容1</div>
            </Tab>
            <Tab title="标签2" disabled>
              <div className="content">内容2</div>
            </Tab>
            <Tab title="标签3">
              <div className="content">内容3</div>
            </Tab>
          </Tabs>
        </div>

        <div className="demo-cell">
          <h4>样式风格及自定义颜色</h4>
          <Tabs type="card">
            {this.tabItem()}
          </Tabs>
          <Tabs type="card" color="green">
            {this.tabItem()}
          </Tabs>
        </div>

        <div className="demo-cell">
          <h4>安全区域用法</h4>
          <Tabs safeAreaInset="16">
            {this.tabItem()}
          </Tabs>
        </div>

        <div className="demo-cell">
          <h4>静态布局</h4>
          <Tabs flex={false}>
            {this.tabItem()}
          </Tabs>
        </div>

        <div className="demo-cell">
          <h4>间距用法</h4>
          <Tabs flex={false} gutter="10" safeAreaInset="16">
            {this.tabItem()}
          </Tabs>
        </div>

        <div className="demo-cell">
          <h4>标签栏滚动</h4>
          <Tabs defaultValue={3}>
            {this.doubleTabItem()}
          </Tabs>
        </div>

        <div className="demo-cell">
          <h4>切换动画及手势</h4>
          
        </div> */}
      </div>
    );
  }
}

export default DemoTab;
