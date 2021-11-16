import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import type { ImagePreviewProps } from '..';
import { ImagePreview, Cell } from '../../../../src/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

const images = [
  'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-ui-m/0.1.2/static/zh-1-de7f5f4876bc1fda19028283676573b1.jpg',
  'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-ui-m/0.1.2/static/zh-2-912fee913a62b12222a4604b5da5010a.jpg',
  'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-ui-m/0.1.2/static/zh-3-5dbfa39699d9bbf71d42a40186595419.jpg',
  'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-ui-m/0.1.2/static/zh-4-26c4957719a3e65eb6054907f14fde98.jpg',
  'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-ui-m/0.1.2/static/zh-5-ae0af3f048628a4a6703d58084a28014.jpg',
  'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-ui-m/0.1.2/static/zh-0-1523846a065bd70e69a6462eeabb59d3.jpg',
];

function ImagePreviewDemo(): JSX.Element {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };

  const showPreviewImage = (props: Partial<ImagePreviewProps> = {}) => {
    return (): any => {
      ImagePreview.open({
        images,
        ...props,
      });
    };
  };

  const activeNum = useRef(1);
  const showPreviewImageNumIndicators = (): void => {
    ImagePreview.open({
      images,
      loop: false,
      onChange(activeIndex) {
        activeNum.current = activeIndex + 1;
      },
      renderIndicators() {
        return (
          <div className="omui-image-preview__indicators">
            {activeNum.current}/{images.length}
          </div>
        );
      },
    });
  };

  const [value, setValue] = useState(false);
  const togglePreviewImage = (): void => {
    setValue(!value);
  };

  return (
    <div className="demo demo-image-preview">
      <DemoHeader title="图片预览" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法">
        <Cell size={'small'} isLink title="基础用法" onClick={showPreviewImage()} />
      </MobileCard>

      <MobileCard title="数字类型">
        <Cell size={'small'} isLink title="数字类型" onClick={showPreviewImageNumIndicators} />
      </MobileCard>

      <MobileCard title="更多选项">
        <Cell
          size={'small'}
          isLink
          title="关闭切换循环"
          onClick={showPreviewImage({ loop: false })}
          border
        ></Cell>
        <Cell
          size={'small'}
          isLink
          title="显示关闭按钮"
          onClick={showPreviewImage({ showCloseButton: true })}
          border
        ></Cell>
        <Cell
          size={'small'}
          isLink
          title="隐藏指示器"
          onClick={showPreviewImage({ showIndicators: false })}
          border
        ></Cell>
      </MobileCard>

      <MobileCard title="组件调用">
        <Cell size={'small'} isLink title="组件调用" onClick={togglePreviewImage} />
        <ImagePreview images={images} value={value} onClose={(): void => setValue(false)} />
      </MobileCard>
    </div>
  );
}

export default ImagePreviewDemo;
