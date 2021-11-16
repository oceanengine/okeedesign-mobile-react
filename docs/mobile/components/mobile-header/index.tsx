import React from 'react';
import { Header } from '../../../../src/index'

interface DemoHeaderProps {
  title: string;
  onClickLeft: () => void;
}

class DemoHeader extends React.Component<any, DemoHeaderProps> {
  
  render(): JSX.Element {
    return (
      <Header fixed onClickLeft={this.props.onClickLeft}>
        <div className='demo-header-title'>{ this.props.title }</div>
      </Header>
    )

  }
}

export default DemoHeader