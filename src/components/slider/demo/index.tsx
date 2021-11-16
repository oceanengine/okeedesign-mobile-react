import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Slider, Toast } from '../../../../src/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

const marks = {
  0: 0,
  60: 60,
  80: 80,
  100: 100,
};

function SliderDemo(): JSX.Element {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };

  const [value, setValue] = useState(0);

  const onDragEnd = (v: number | [number, number]): void => {
    Toast.info(v.toString());
  };

  return (
    <div className="demo demo-slider">
      <DemoHeader title="滑块" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法">
        <Slider defaultValue={10} onDragEnd={onDragEnd} />
      </MobileCard>

      <MobileCard title="显示刻度">
        <Slider ticks defaultValue={20} onDragEnd={onDragEnd} step={10} />
      </MobileCard>

      <MobileCard title="显示刻度标记">
        <Slider ticks marks defaultValue={40} onDragEnd={onDragEnd} step={20} />
      </MobileCard>

      <MobileCard title="自定义刻度标记">
        <Slider ticks defaultValue={0} onDragEnd={onDragEnd} step={null} marks={marks} />
      </MobileCard>

      <MobileCard title="最大/最小值">
        <Slider ticks marks defaultValue={40} onDragEnd={onDragEnd} step={20} min={40} max={140} />
      </MobileCard>

      <MobileCard title="受控">
        <Slider value={value} onChange={(v): void => setValue(v as number)} onDragEnd={onDragEnd} />
      </MobileCard>

      <MobileCard title="双滑块">
        <Slider range ticks marks defaultValue={[20, 60]} onDragEnd={onDragEnd} step={20} />
      </MobileCard>

      <MobileCard title="禁用">
        <Slider
          disabled
          range
          marks
          ticks
          defaultValue={[20, 60]}
          onDragEnd={onDragEnd}
          step={20}
        />
      </MobileCard>

      <MobileCard title="自定义滑块">
        <Slider
          defaultValue={20}
          step={20}
          ticks
          renderIndicator={(v): JSX.Element => {
            return (
              <div
                style={{
                  position: 'relative',
                  height: '24px',
                  width: '24px',
                  borderRadius: '50%',
                  background: 'red',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  {v}
                </span>
              </div>
            );
          }}
          onDragEnd={onDragEnd}
        />
      </MobileCard>
    </div>
  );
}

export default SliderDemo;
