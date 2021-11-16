import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PopupDrillDown, PopupDrillDownItem, Cell } from '../../../../src/index';
import { useRefCallback } from '../../../hooks';
import './index.less';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

function PopupDrillDownDemo(): JSX.Element {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };

  const [value, setValue] = useState(false);
  const onCellClick = (): void => {
    setValue(true);
  };
  const onChange = useRefCallback(v => {
    setValue(v);
  });
  const onComplete = useRefCallback(() => {
    console.log('complete');
    setValue(false);
  });
  const onBack = useRefCallback(activeIndex => {
    console.log(activeIndex);
  });

  return (
    <div className="demo demo-popup-drill-down">
      <DemoHeader title="下钻" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法">
        <Cell title="三级下钻" isLink size="small" onClick={onCellClick} />
        <PopupDrillDown
          value={value}
          onChange={onChange}
          onComplete={onComplete}
          onBack={onBack}
          className="shopping-drill-down"
        >
          <PopupDrillDownItem title="页面标题">
            {({ closePopup, forward, back }): any => (
              <div className="shopping-drill-down-item shopping-drill-down-item-1">
                <button onClick={(): void => closePopup()}>关闭</button>
                <div className="shopping-drill-down-item-placeholder"></div>
                <button onClick={(): void => forward()}>forward内容</button>
                <div className="shopping-drill-down-item-placeholder"></div>
                <button onClick={(): void => back()}>back内容</button>
                <div className="shopping-drill-down-item-placeholder"></div>
              </div>
            )}
          </PopupDrillDownItem>
          <PopupDrillDownItem title="二级页标题">
            {({ closePopup, forward, back }): any => (
              <div className="shopping-drill-down-item shopping-drill-down-item-2">
                <button onClick={(): void => closePopup()}>关闭</button>
                <div className="shopping-drill-down-item-placeholder"></div>
                <button onClick={(): void => forward()}>forward内容</button>
                <div className="shopping-drill-down-item-placeholder"></div>
                <button onClick={(): void => back()}>back内容</button>
                <div className="shopping-drill-down-item-placeholder"></div>
              </div>
            )}
          </PopupDrillDownItem>
          <PopupDrillDownItem title="三级页标题">
            {({ closePopup, forward, back }): any => (
              <div className="shopping-drill-down-item shopping-drill-down-item-3">
                <button onClick={(): void => closePopup()}>关闭</button>
                <div className="shopping-drill-down-item-placeholder"></div>
                <button onClick={(): void => forward()}>forward内容</button>
                <div className="shopping-drill-down-item-placeholder"></div>
                <button onClick={(): void => back()}>back内容</button>
                <div className="shopping-drill-down-item-placeholder"></div>
              </div>
            )}
          </PopupDrillDownItem>
        </PopupDrillDown>
      </MobileCard>
    </div>
  );
}

export default PopupDrillDownDemo;
