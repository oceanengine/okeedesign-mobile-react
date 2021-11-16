import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Popup, Cell } from '../../../../src/index';
import { useZIndex } from '../../../../src/public-api';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import './index.less';

/**
 * 默认CommonState
 */
const initialState = {
  value: false,
  valueBottom: false,
  valueLeft: false,
  valueTop: false,
  valueRight: false,
};
type State = Readonly<typeof initialState>;

function DemoPopup(): JSX.Element {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };
  const [value, setValue] = useState(false);
  const [valueBottom, setValueBottom] = useState(false);
  const [valueLeft, setValueLeft] = useState(false);
  const [valueTop, setValueTop] = useState(false);
  const [valueRight, setValueRight] = useState(false);

  const [show, setShow] = useState(false);

  const zIndex = useZIndex({
    update: show,
  });

  return (
    <div className="demo">
      <DemoHeader title="弹出层" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法" className="cell-border-radius-box">
        <Cell
          size="small"
          title="点击查看"
          arrowDirection="right"
          isLink
          border
          clickable
          onClick={(): void => {
            setValue(true);
          }}
        >
          {' '}
        </Cell>
        <Popup
          className="demo-popup-basic"
          value={value}
          onChange={(value: boolean): void => {
            setValue(value);
          }}
        >
          <img
            className="popup-img"
            src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-ui-m/0.1.2/static/byted-logo.svg"
          />
        </Popup>
      </MobileCard>

      <MobileCard title="自定义位置" className="cell-border-radius">
        <Cell
          className="topRadi"
          size="small"
          title="顶部弹出"
          arrowDirection="right"
          isLink
          border
          clickable
          onClick={(): void => {
            setValueTop(true);
          }}
        ></Cell>
        <Popup
          className="demo-popup-top"
          position="top"
          value={valueTop}
          onChange={(value: boolean): void => {
            setValueTop(value);
          }}
        >
          <img
            className="popup-img"
            src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-ui-m/0.1.2/static/byted-logo.svg"
          />
        </Popup>

        <Cell
          size="small"
          title="底部弹出"
          arrowDirection="right"
          isLink
          border
          clickable
          onClick={(): void => {
            setValueBottom(true);
          }}
        ></Cell>
        <Popup
          className="demo-popup-top"
          position="bottom"
          value={valueBottom}
          onChange={(value: boolean): void => {
            console.log(value);
            setValueBottom(value);
          }}
        >
          <img
            className="popup-img"
            src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-ui-m/0.1.2/static/byted-logo.svg"
          />
        </Popup>

        <Cell
          size="small"
          title="左侧弹出"
          arrowDirection="right"
          isLink
          border
          clickable
          onClick={(): void => {
            setValueLeft(true);
          }}
        ></Cell>
        <Popup
          position="left"
          className="demo-popup-vh"
          value={valueLeft}
          onChange={(value: boolean): void => {
            setValueLeft(value);
          }}
        >
          <div className="demo-popup-left">
            <img
              className="popup-img"
              src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-ui-m/0.1.2/static/byted-logo.svg"
            />
          </div>
        </Popup>

        <Cell
          size="small"
          title="右侧弹出"
          arrowDirection="right"
          isLink
          border
          clickable
          onClick={(): void => {
            setValueRight(true);
          }}
        ></Cell>
        <Popup
          position="right"
          className="demo-popup-vh"
          value={valueRight}
          onChange={(value: boolean): void => {
            setValueRight(value);
          }}
        >
          <div className="demo-popup-right">
            <img
              className="popup-img"
              src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-ui-m/0.1.2/static/byted-logo.svg"
            />
          </div>
        </Popup>
      </MobileCard>

      <MobileCard title="适配组建层级" className="cell-border-radius-box">
        <div>
          {show ? '显示' : '隐藏'} : {zIndex}
          {/* <Button
            style={{ display: 'block', marginTop: '10px' }}
            type="default"
            onClick={(): void => setShow(!show)}
          >
            Toggle
          </Button> */}
          <Cell
            size="small"
            title="Toggle"
            arrowDirection="right"
            isLink
            border
            clickable
            onClick={(): void => {
              setShow(!show);
            }}
          >
            {' '}
          </Cell>
        </div>
      </MobileCard>
    </div>
  );
}

export default DemoPopup;
