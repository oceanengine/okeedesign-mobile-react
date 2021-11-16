/* eslint-disable indent */
/* eslint-disable semi */
import React, { FC, useState, useRef } from 'react';
import { Button, Cell, SwipeCell, Dialog } from '../../../index';
import { SwipeCellForward } from '../../../components/swipe-cell';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import arrowLeft from '../../../icon/arrow-left.svg';
import check from '../../../icon/check.svg';

import './index.less';
import { useHistory } from 'react-router-dom';

const DemoSwipeCell: FC = () => {
  const title = '标题';

  const [showDialog, setShowDialog] = useState(false);

  const swipeCellRef = useRef<SwipeCellForward>(null);

  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };

  const dialogConfirm = (): void => {
    setShowDialog(false);
    swipeCellRef.current?.close();
  };

  return (
    <div className="demo demo-swipe-cell">
      <DemoHeader title="滑动单元格" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法">
        <SwipeCell
          left={
            <Button type="primary" square>
              收藏
            </Button>
          }
        >
          <Cell title={title} value="右滑显示单按钮"></Cell>
        </SwipeCell>
        <SwipeCell
          left={
            <div>
              <Button type="primary" square>
                收藏
              </Button>
              <Button type="danger" square>
                删除
              </Button>
            </div>
          }
        >
          <Cell title={title} value="右滑显示双按钮"></Cell>
        </SwipeCell>
        <SwipeCell
          right={
            <div>
              <Button type="primary" square>
                收藏
              </Button>
            </div>
          }
        >
          <Cell title={title} value="左滑显示单按钮"></Cell>
        </SwipeCell>
      </MobileCard>

      <MobileCard title="显示图标操作">
        <SwipeCell
          left={
            <div className="icon-box">
              <img src={check} className="icon" />
            </div>
          }
        >
          <Cell title={title} value="右滑显示单按钮"></Cell>
        </SwipeCell>
        <SwipeCell
          left={
            <div className="left-two">
              <div className="icon-box">
                <img src={check} className="icon" />
              </div>
              <div className="icon-box">
                <img src={arrowLeft} className="icon" />
              </div>
            </div>
          }
        >
          <Cell title={title} value="右滑显示双按钮"></Cell>
        </SwipeCell>
        <SwipeCell
          right={
            <div className="icon-box">
              <img src={check} className="icon" />
            </div>
          }
        >
          <Cell title={title} value="左滑显示单按钮"></Cell>
        </SwipeCell>
      </MobileCard>

      <MobileCard title="滑动直接操作">
        <SwipeCell
          ref={swipeCellRef}
          async
          onClose={(): void => {
            setShowDialog(true);
          }}
          right={
            <Button type="danger" square>
              提交
            </Button>
          }
        >
          <Cell title={title} value="左滑提交完成"></Cell>
        </SwipeCell>
      </MobileCard>
      <Dialog
        title="标题"
        message="内容"
        value={showDialog}
        showCancelButton
        onConfirm={dialogConfirm}
        onCancel={dialogConfirm}
      />
    </div>
  );
};

export default DemoSwipeCell;
