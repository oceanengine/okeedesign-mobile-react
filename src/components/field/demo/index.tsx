/* eslint-disable semi */
import React, { FC, Fragment, useState } from 'react';
import { Field, Tag } from '../../../index';
import {} from '../../../components/field';
import { useHistory } from 'react-router-dom';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

const DemoFieldBasic: FC = () => {
  const [value, setValue] = useState<string | number>('');
  return <Field value={value} onInput={setValue} border></Field>;
};

const DemoFieldSlot: FC = () => {
  const [value, setValue] = useState<string | number>('');
  return (
    <Field
      value={value}
      onInput={setValue}
      border
      clearable
      label={(): JSX.Element => {
        return (
          <Tag type="warning" plain>
            警告
          </Tag>
        );
      }}
    ></Field>
  );
};
const DemoFieldTextArea: FC = () => {
  const [value, setValue] = useState<string | number>('');
  return <Field value={value} onInput={setValue} border type="textarea"></Field>;
};

const DemoFieldNotBorder: FC = () => {
  const [value, setValue] = useState<string | number>('');
  const [value1, setValue1] = useState<string | number>('');
  const [value2, setValue2] = useState<string | number>('');
  return (
    <>
      <Field
        value={value2}
        onInput={setValue2}
        label="标题"
        unit="单位"
        style={{ marginBottom: '10px' }}
      ></Field>
      <Field
        value={value}
        onInput={setValue}
        label="标题太长单独一行展示"
        type="textarea"
        unit="单位"
        style={{ marginBottom: '10px' }}
      ></Field>
      <Field
        value={value1}
        onInput={setValue1}
        label="标题"
        type="textarea"
        unit="单位"
        maxLength={60}
      ></Field>
    </>
  );
};

const DemoFieldLabelAndUnit: FC = () => {
  const [value, setValue] = useState<string | number>('');
  const [value1, setValue1] = useState<string | number>('');
  const [value2, setValue2] = useState<string | number>('');
  const [value3, setValue3] = useState<string | number>('');
  return (
    <>
      <Field
        value={value1}
        onInput={setValue1}
        label="标题"
        style={{ marginBottom: '10px' }}
        type="textarea"
        unit="单位"
        max-length="60"
        border
        rows={1}
      ></Field>
      <Field
        value={value3}
        onInput={setValue3}
        label="标题"
        border
        style={{ marginBottom: '10px' }}
      ></Field>
      <Field
        value={value}
        onInput={setValue}
        label="标题"
        type="textarea"
        unit="单位"
        maxLength={60}
        style={{ marginBottom: '10px' }}
        border
      ></Field>
      <Field
        value={value2}
        onInput={setValue2}
        label="标题"
        unit="单位"
        border
        style={{ marginBottom: '10px' }}
      ></Field>
    </>
  );
};

const DemoFieldClear: FC = () => {
  const [value, setValue] = useState<string | number>('内容');
  const [value1, setValue1] = useState<string | number>('内容');
  return (
    <Fragment>
      <Field
        value={value}
        onInput={setValue}
        border
        clearable
        style={{ marginBottom: '10px' }}
      ></Field>
      <Field value={value1} onInput={setValue1} border type="textarea" clearable></Field>
    </Fragment>
  );
};

const DemoFieldWordsLimit: FC = () => {
  const [value, setValue] = useState<string | number>('');
  const onInput = (value: string | number): void => {
    setValue(value);
    console.log(value);
  };
  return <Field value={value} onInput={onInput} maxLength={10}></Field>;
};

const DemoField: FC = () => {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };
  return (
    <div className="demo demo-field">
      <DemoHeader title="输入框" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法">
        <DemoFieldBasic />
      </MobileCard>

      <MobileCard title="输入域用法">
        <DemoFieldTextArea />
      </MobileCard>

      <MobileCard title="无边框类型">
        <DemoFieldNotBorder />
      </MobileCard>

      <MobileCard title="标题单位用法">
        <DemoFieldLabelAndUnit />
      </MobileCard>

      <MobileCard title="清除用法">
        <DemoFieldClear />
      </MobileCard>

      <MobileCard title="字数计算">
        <DemoFieldWordsLimit />
      </MobileCard>

      <MobileCard title="禁用用法">
        <Field value="disabled" disabled border></Field>
      </MobileCard>

      <MobileCard title="插槽用法">
        <DemoFieldSlot />
      </MobileCard>
    </div>
  );
};

export default DemoField;
