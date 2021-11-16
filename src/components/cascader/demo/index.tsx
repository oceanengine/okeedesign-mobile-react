import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CascaderProps, CascaderValue } from '..';
import { Cascader, CascaderSliding, Cell, Header, Popup, Toast } from '../../../../src/index';
import { CascaderSlidingProps, CascaderSlidingValue } from '../../cascader-sliding';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import { StructTreeNode } from '../../../utils/struct/tree';

const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      {
        value: 'shejiyuanze',
        label: '设计原则',
        children: [
          {
            value: 'yizhi',
            label: '一致',
            children: [
              {
                value: 'yizhi',
                label: '一致',
                children: [
                  {
                    value: 'yizhi',
                    label: '一致',
                    children: [
                      {
                        value: 'yizhi',
                        label: '一致',
                        children: [
                          {
                            value: 'yizhi',
                            label: '一致',
                            children: [
                              {
                                value: 'yizhi',
                                label: '一致',
                                children: [
                                  {
                                    value: 'yizhi',
                                    label: '一致',
                                  },
                                  {
                                    value: 'fankui',
                                    label: '反馈',
                                  },
                                  {
                                    value: 'xiaolv',
                                    label: '效率',
                                  },
                                  {
                                    value: 'kekong',
                                    label: '可控',
                                  },
                                ],
                              },
                              {
                                value: 'fankui',
                                label: '反馈',
                              },
                              {
                                value: 'xiaolv',
                                label: '效率',
                              },
                              {
                                value: 'kekong',
                                label: '可控',
                              },
                            ],
                          },
                          {
                            value: 'fankui',
                            label: '反馈',
                          },
                          {
                            value: 'xiaolv',
                            label: '效率',
                          },
                          {
                            value: 'kekong',
                            label: '可控',
                          },
                        ],
                      },
                      {
                        value: 'fankui',
                        label: '反馈',
                      },
                      {
                        value: 'xiaolv',
                        label: '效率',
                      },
                      {
                        value: 'kekong',
                        label: '可控',
                      },
                    ],
                  },
                  {
                    value: 'fankui',
                    label: '反馈',
                  },
                  {
                    value: 'xiaolv',
                    label: '效率',
                  },
                  {
                    value: 'kekong',
                    label: '可控',
                  },
                ],
              },
              {
                value: 'fankui',
                label: '反馈',
              },
              {
                value: 'xiaolv',
                label: '效率',
              },
              {
                value: 'kekong',
                label: '可控',
              },
            ],
          },
          {
            value: 'fankui',
            label: '反馈',
          },
          {
            value: 'xiaolv',
            label: '效率',
          },
          {
            value: 'kekong',
            label: '可控',
          },
        ],
      },
      {
        value: 'daohang',
        label: '导航',
        children: [
          {
            value: 'cexiangdaohang',
            label: '侧向导航',
          },
          {
            value: 'dingbudaohang',
            label: '顶部导航',
          },
        ],
      },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout 布局',
          },
          {
            value: 'color',
            label: 'Color 色彩',
          },
          {
            value: 'typography',
            label: 'Typography 字体',
          },
          {
            value: 'icon',
            label: 'Icon 图标',
            children: [
              {
                value: 'iconChild',
                label: 'icon 图标子元素',
              },
            ],
          },
          {
            value: 'button',
            label: 'Button 按钮',
          },
        ],
      },
    ],
  },
  {
    value: 'test1',
    label: '测试一级',
  },
  {
    value: 'test2',
    label: '测试二级',
    children: [
      {
        value: 'test21',
        label: '测试二级1',
      },
      {
        value: 'test22',
        label: '测试二级2',
      },
    ],
  },
];

const lazyOptions = [
  {
    value: 'yibu',
    label: '异步展开',
    children: [],
    needLoad: true,
  },
  {
    value: 'zhinan',
    label: '指南',
    children: [
      {
        value: 'shejiyuanze',
        label: '设计原则',
        children: [
          {
            value: 'yizhi',
            label: '一致',
          },
          {
            value: 'fankui',
            label: '反馈',
          },
          {
            value: 'xiaolv',
            label: '效率',
          },
          {
            value: 'kekong',
            label: '可控',
          },
        ],
      },
      {
        value: 'daohang',
        label: '导航',
        children: [
          {
            value: 'cexiangdaohang',
            label: '侧向导航',
          },
          {
            value: 'dingbudaohang',
            label: '顶部导航',
          },
        ],
      },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout 布局',
          },
          {
            value: 'color',
            label: 'Color 色彩',
          },
          {
            value: 'typography',
            label: 'Typography 字体',
            showAll: false,
            children: [
              {
                value: 'all_typography',
                label: '全部',
              },
            ],
          },
          {
            value: 'icon',
            label: 'Icon 图标',
            children: [
              {
                value: 'iconChild',
                label: 'icon 图标子元素',
              },
            ],
          },
          {
            value: 'button',
            label: 'Button 按钮',
          },
        ],
      },
    ],
  },
  {
    value: 'test1',
    label: '测试一级',
  },
  {
    value: 'test2',
    label: '测试二级',
    children: [
      {
        value: 'test21',
        label: '测试二级1',
      },
      {
        value: 'test22',
        label: '测试二级2',
      },
    ],
  },
];

function DemoCascader(): JSX.Element {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };

  const [show, setShow] = useState(false);

  const [value, setValue] = useState<CascaderValue[]>([]);
  const onChange: CascaderProps['onChange'] = v => {
    Toast.info(v.toString() || 'empty');
    setValue(v as CascaderValue[]);
  };

  const [multiShow, setMultiShow] = useState(false);

  const [multiValue, setMultiValue] = useState<CascaderValue[][]>([]);
  const onMultiChange: CascaderProps['onChange'] = v => {
    Toast.info(v.toString() || 'empty');
    setMultiValue(v as CascaderValue[][]);
  };

  const [lazyShow, setLazyShow] = useState(false);
  const [lazyValue, setLazyValue] = useState<CascaderValue[]>(['shejiyuanze', 'yibu3']);
  const onLazyChange: CascaderProps['onChange'] = v => {
    Toast.info(v.toString() || 'empty');
    setLazyValue(v as CascaderValue[]);
  };

  const [slidingShow, setSlidingShow] = useState(false);
  const [slidingValue, setSlidingValue] = useState<CascaderSlidingValue[]>(['zhinan']);
  const onSlidingChange: CascaderSlidingProps['onChange'] = v => {
    Toast.info(v.toString() || 'empty');
    setSlidingValue(v as CascaderSlidingValue[]);
  };

  const loadData: CascaderProps['load'] = item => {
    if (item.value === 'yibu') {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              value: 'yibu1',
              label: '异步展开1',
            },
            {
              value: 'yibu2',
              label: '异步展开2',
              needLoad: true,
              children: [],
            },
            {
              value: 'yibu3',
              label: '异步展开3',
            },
          ]);
        }, 2000);
      });
    }
    return new Promise<StructTreeNode[]>(resolve => {
      setTimeout(() => {
        resolve([
          {
            value: 'yibu21',
            label: '异步展开21',
          },
          {
            value: 'yibu23',
            label: '异步展开23',
          },
        ]);
      }, 2000);
    });
  };

  return (
    <div className="demo demo-button">
      <Header title="级联" fixed onClickLeft={onClickLeft} />

      <MobileCard title="基础用法" className="cell-border-radius">
        <Cell
          title="单选"
          border
          clickable
          isLink
          onClick={(): void => {
            setShow(true);
          }}
        ></Cell>
        <Cell
          title="多选"
          border
          clickable
          isLink
          onClick={(): void => {
            setMultiShow(true);
          }}
        ></Cell>
        <Cell
          title="异步"
          border
          clickable
          isLink
          onClick={(): void => {
            setLazyShow(true);
          }}
        ></Cell>
        <Cell
          title="两列布局"
          border
          clickable
          isLink
          onClick={(): void => {
            setSlidingShow(true);
          }}
        ></Cell>
      </MobileCard>

      <Popup
        value={show}
        onChange={(value): void => {
          setShow(value);
        }}
        position="bottom"
      >
        <Cascader value={value} onChange={onChange} options={options} />
      </Popup>
      <Popup
        value={multiShow}
        onChange={(value): void => {
          setMultiShow(value);
        }}
        position="bottom"
      >
        <Cascader
          showAll={false}
          value={multiValue}
          onChange={onMultiChange}
          options={options}
          multiple
        />
      </Popup>
      <Popup
        value={lazyShow}
        onChange={(value): void => {
          setLazyShow(value);
        }}
        position="bottom"
      >
        <Cascader
          multiple
          showAll
          displayStrategy="minimalist"
          badgeStrategy="adjacent"
          checkStrategy="parent"
          ellipsis={3}
          value={lazyValue}
          onChange={onLazyChange}
          options={lazyOptions}
          load={loadData}
        />
      </Popup>
      <Popup
        value={slidingShow}
        onChange={(value): void => {
          setSlidingShow(value);
        }}
        position="bottom"
      >
        <CascaderSliding value={slidingValue} onChange={onSlidingChange} options={options} />
      </Popup>
    </div>
  );
}

export default DemoCascader;
