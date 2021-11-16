/**
 * monile 首页
 */
import './style/index.less';
import React from 'react';
import { Location, History, createHashHistory } from 'history';

import '../../src/index.less';
import { Lang } from '../config';

import { NavMenu } from './components/nav-menu';

import TrackingComponent from './tracking'

const history = createHashHistory();

let listener: (location: Location) => void = function(location): void {
  console.log(location);
};

history.listen((location: Location<History.PoorMansUnknown>) => {
  listener(location);
});

const homePaths = [
  '/',
  '#/',
  '/zh-CN',
  '#/zh-CN',
  '/zh-CN/intro',
  '#/zh-CN/intro',
  '/en-US/intro',
  '#/en-US/intro',
  '/zh-CN/quickstart',
  '#/zh-CN/quickstart',
  '/en-US/quickstart',
  '#/en-US/quickstart',
  '/zh-CN/changelog',
  '#/zh-CN/changelog',
  '/en-US/changelog',
  '#/en-US/changelog',
  '/zh-CN/theme',
  '#/zh-CN/theme',
  '/en-US/theme',
  '#/en-US/theme',
];

function checkHomePath(hash: string): boolean {
  return homePaths.indexOf(hash) > -1;
}

export default class App extends React.Component<any, { onHome: boolean; activeName: any; isScrollTop: boolean }> {
  constructor(props: any) {
    super(props);

    this.state = {
      onHome: checkHomePath(window.location.hash),
      activeName: 0,
      isScrollTop: true
    };

    listener = (location): void => {
      this.setState({
        onHome: checkHomePath(location.pathname),
      });
    };
  }
  get lang(): Lang {
    return 'zh-CN';
  }
  render(): JSX.Element {
    return (
      <div className="app">
        <TrackingComponent />
        {this.state.onHome && (
          <div>
            <div className={this.state.isScrollTop ? 'demo-logo demo-logo-out' : 'demo-logo demo-logo-in'}>
              <div className='demo-logo-title'>Mobile</div>
              <div className="demo-logo_text'">轻量、移动 React 组件库</div>
            </div>
            <NavMenu
              activeName={this.state.activeName}
              onChange={(v: any): void => this.setState({ activeName: v })}
              isScrollTop={this.state.isScrollTop}
              onScroll={(v: boolean): void => { this.setState({ isScrollTop: v }) }}
            ></NavMenu>
          </div>
        )}
        {!this.state.onHome && <div className="demo-box">{this.props.children}</div>}
      </div>
    );
  }
}
