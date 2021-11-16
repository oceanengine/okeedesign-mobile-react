import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Search } from '../../../../src/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

function DemoSearch(): JSX.Element {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };
  const [baseValue, setBaseValue] = useState('');
  const [cancelValue, setCancelValue] = useState('');
  const [styleValue, setStyleValue] = useState('');
  // const onSearch = (value: string) => {
  //   alert('search ' + value);
  // }
  return (
    <div className="demo demo-search">
      <DemoHeader title="搜索栏" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法" className="cell-border-radius-box">
        <Search value={baseValue} onChange={setBaseValue} autoFocus shape="square" size="normal" />
      </MobileCard>

      <MobileCard title="取消类型" className="cell-border-radius-box">
        <Search
          value={cancelValue}
          onChange={setCancelValue}
          shape="square"
          cancelable
          size="normal"
        />
      </MobileCard>

      <MobileCard title="圆角类型" className="cell-border-radius-box">
        <Search value={styleValue} onChange={setStyleValue} size="normal" />
      </MobileCard>
    </div>
  );
}

export default DemoSearch;
