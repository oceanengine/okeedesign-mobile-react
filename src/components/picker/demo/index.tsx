import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Picker, Toast, Cell, Popup } from '../../../../src/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

type DemoOptionItem = {
  value: number;
  label: string;
};

function makeOptions(amount: number, offset = 0): DemoOptionItem[] {
  return Array.from(Array(amount).keys()).map((item: number) => {
    return {
      value: item + offset + 1,
      label: `选项${item + offset + 1}`,
    };
  });
}

// function makeCascadedOptions() {
//   return makeOptions(10).map(item => {
//     return Object.assign(item, {
//       children: makeOptions(5, item.value * 10),
//     });
//   });
// }

function PickerDemo(): JSX.Element {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };
  const [singleValue, setSingleValue] = useState('');
  const singleOptions: any = makeOptions(6);

  const [value, setValue] = useState([]);
  const options: any = [makeOptions(6), makeOptions(6)];

  const [cascadedValue, setCascadedValue] = useState([]);
  const cascadedOptions: any = [
    {
      label: '北京',
      value: '北京',
      children: [
        {
          label: '海淀',
          value: '海淀',
          children: [
            {
              label: '中关村',
              value: '中关村',
            },
            {
              label: '双榆树',
              value: '双榆树',
            },
          ],
        },
        {
          label: '朝阳',
          value: '朝阳',
          children: [
            {
              label: '大悦城',
              value: '大悦城',
            },
          ],
        },
      ],
    },
    {
      label: '上海',
      value: '上海',
      children: [
        {
          label: '虹桥',
          value: '虹桥',
          children: [
            {
              label: '机场',
              value: '机场',
            },
            {
              label: '广场',
              value: '广场',
            },
          ],
        },
      ],
    },
  ];

  const [showPopup, setShowPopup] = useState(false);

  const changeOptions = (value: any): void => {
    console.log(value);
    Toast.info({
      message: `选项${value[0]}`,
    });
    setSingleValue(value);
  };

  return (
    <div className="demo demo-picker">
      <DemoHeader title="选择器" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法">
        <Picker
          title="标题"
          options={singleOptions}
          value={singleValue}
          onInput={(value: any): void => changeOptions(value)}
          onChange={(value: any): void => changeOptions(value)}
        />
      </MobileCard>

      <MobileCard title="多列选择">
        <Picker title="标题" options={options} value={value} onChange={setValue} />
      </MobileCard>

      <MobileCard title="级联选择">
        <Picker
          title="标题"
          options={cascadedOptions}
          value={cascadedValue}
          onChange={setCascadedValue}
        />
      </MobileCard>

      <MobileCard title="无标题样式">
        <Picker options={options} value={value} onChange={setValue} />
      </MobileCard>

      <MobileCard title="搭配弹层使用">
        <Cell title="地区" value="设置" onClick={(): void => setShowPopup(true)}></Cell>
        <Popup value={showPopup} position="bottom" onChange={(): void => setShowPopup(false)}>
          <Picker
            title="标题"
            options={cascadedOptions}
            value={cascadedValue}
            onChange={setCascadedValue}
            onConfirm={(): void => setShowPopup(false)}
            onCancel={(): void => setShowPopup(false)}
          />
        </Popup>
      </MobileCard>
    </div>
  );
}

export default PickerDemo;
