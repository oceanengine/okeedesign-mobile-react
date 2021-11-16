import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, DropdownItem, Cell, Switch, Button } from '../../../../src/index';
import './index.less';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';

function DropdownDemo(): JSX.Element {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };
  const [value, setValue] = useState(1);
  const [value2, setValue2] = useState(1);
  const [upValue, setUpValue] = useState(1);
  const [upValue2, setUpValue2] = useState(1);
  const [customValue, setCustomValue] = useState(1);

  const options = [
    {
      value: 1,
      label: '全部商品',
    },
    {
      value: 2,
      label: '新款商品',
    },
    {
      value: 3,
      label: '活动商品',
    },
  ];

  const options2 = [
    {
      value: 1,
      label: '默认排序',
    },
    {
      value: 2,
      label: '好评排序',
    },
    {
      value: 3,
      label: '销量排序',
    },
  ];

  const options3 = [
    {
      value: 1,
      label: '标题1',
    },
    {
      value: 2,
      label: '标题2',
    },
  ];

  const renderList = (closePopup: () => void): JSX.Element => {
    return (
      <Fragment>
        {options3.map(({ value: currentValue, label }) => {
          return (
            <Cell
              border
              key={currentValue}
              title={label}
              value={(): JSX.Element => {
                return (
                  <Switch
                    value={customValue === currentValue}
                    onChange={(): void => {
                      setCustomValue(currentValue);
                      // closePopup();
                    }}
                  />
                );
              }}
            />
          );
        })}
        <Button
          type="primary"
          size="large"
          onClick={(): void => {
            closePopup();
          }}
        >
          确定
        </Button>
      </Fragment>
    );
  };

  return (
    <div className="demo-dropdown">
      <DemoHeader title="下拉菜单" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法" className="cell-border-radius-box">
        <Dropdown zIndex={2000}>
          <DropdownItem
            value={value}
            options={options}
            onChange={(value): void => setValue(value as number)}
          />
          <DropdownItem
            value={value2}
            options={options2}
            onChange={(value): void => setValue2(value as number)}
          />
        </Dropdown>
      </MobileCard>

      <MobileCard title="向上展开" className="cell-border-radius-box">
        <Dropdown zIndex={2000} direction="up">
          <DropdownItem
            value={upValue}
            options={options}
            onChange={(value): void => setUpValue(value as number)}
          />
          <DropdownItem
            value={upValue2}
            options={options2}
            onChange={(value): void => setUpValue2(value as number)}
          />
        </Dropdown>
      </MobileCard>

      <MobileCard title="自定义用法" className="cell-border-radius-box">
        <Dropdown zIndex={2000}>
          <DropdownItem
            value={upValue}
            options={options}
            onChange={(value): void => setUpValue(value as number)}
          />
          <DropdownItem
            value={upValue2}
            title={(): JSX.Element => <div>标题</div>}
            renderList={renderList}
          />
        </Dropdown>
      </MobileCard>

      <MobileCard title="标题插槽" className="cell-border-radius-box">
        <Dropdown zIndex={2000}>
          <DropdownItem
            title="标题插槽"
            value={upValue}
            options={options}
            onChange={(value): void => setUpValue(value as number)}
          />
        </Dropdown>
      </MobileCard>

      <MobileCard title="禁用状态" className="cell-border-radius-box">
        <Dropdown zIndex={2000}>
          <DropdownItem
            disabled={true}
            value={value}
            options={options}
            onChange={(value): void => setValue(value as number)}
          />
          <DropdownItem
            disabled={true}
            value={value2}
            options={options2}
            onChange={(value): void => setValue2(value as number)}
          />
        </Dropdown>
      </MobileCard>
    </div>
  );
}

export default DropdownDemo;
