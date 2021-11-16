import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Switch } from '../../../../src/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

/**
 * 默认CommonState
 */
// const initialState = { value: false, isLoading: false }
// type State = Readonly<typeof initialState>

export const SwitchDemo: any = () => {
  const [baseValue, setBaseValue] = useState(false);
  const [disableValue, setDisableValue] = useState(false);
  const [sizeValue, setSizeValue] = useState(false);
  const [controlledValue, setControlledValue] = useState(true);
  // const [ value5, setValue5 ] = useState(false)
  const [isLoading1, setILoading1] = useState(false);
  // const [ isLoading2, setILoading2 ] = useState(false)

  // readonly state: State = initialState

  function onClick1(value: boolean): any {
    setBaseValue(value);
  }

  // function onClick2(value: boolean): any {
  //   setDisableValue(value)
  // }

  function onClick3(value: boolean): any {
    setSizeValue(value);
  }

  function onClick4(value: boolean): any {
    setILoading1(true);
    setTimeout(() => {
      setILoading1(false);
      setControlledValue(value);
    }, 1000);
  }

  // function onClick5(value: boolean): any {
  //   setILoading2(true)
  //   setTimeout(() => {
  //     setILoading2(false)
  //     setValue5(value)
  //   }, 1000)
  // }

  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };

  return (
    <div className="demo">
      <DemoHeader title="开关" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法">
        <Switch value={baseValue} onClick={(value: boolean): void => onClick1(value)} />
      </MobileCard>

      <MobileCard title="禁用状态">
        <Switch value={disableValue} disabled />
      </MobileCard>

      <MobileCard title="自定义大小">
        <Switch
          value={sizeValue}
          size="large"
          onClick={(value: boolean): void => onClick3(value)}
        />
      </MobileCard>

      <MobileCard title="受控状态">
        <Switch
          value={controlledValue}
          className="switch-demo"
          loading={isLoading1}
          onClick={(value: boolean): void => onClick4(value)}
        />
      </MobileCard>
    </div>
  );
};

export default SwitchDemo;
