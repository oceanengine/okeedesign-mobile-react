import React, { useState } from 'react';
import { DateTimePicker, Cell, Popup } from '../../../index';

import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import type { DateTimePickerValue } from '../../../utils/format/date';
// import { getDateByMonthWeek, getMonthWeekByDate } from '../../../public-api';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';

function Demo(): JSX.Element {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };

  const [singleValue, setSingleValue] = useState(new Date());
  const onSingleChange = (dates: DateTimePickerValue[] | DateTimePickerValue): void => {
    const date = dates as Date;
    setSingleValue(date);
  };

  const [timeValue, setTimeValue] = useState(new Date());
  const onTimeChange = (dates: DateTimePickerValue[] | DateTimePickerValue): void => {
    const date = dates as Date;
    console.log(date.getHours(), date.getMinutes());
    setTimeValue(date);
  };

  const [yearValue, setYearValue] = useState(new Date());
  const onYearChange = (dates: DateTimePickerValue[] | DateTimePickerValue): void => {
    const date = dates as Date;
    console.log(date.getFullYear());
    setYearValue(date);
  };

  const [monthValue, setMonthValue] = useState(new Date());
  const onMonthChange = (dates: DateTimePickerValue[] | DateTimePickerValue): void => {
    const date = dates as Date;
    console.log(date.getFullYear(), date.getMonth());
    setMonthValue(date);
  };

  // monthweek 中 20210203 中的 03 表示第三周,不是第三天
  // const [monthWeekValue, setMonthWeekValue] = useState(
  //   '20210203'
  // );

  // 获取当天的monthWeek字符串
  // console.log(getMonthWeekByDate());

  // 获取monthweek的起止时间
  // console.log(getDateByMonthWeek(
  //   getMonthWeekByDate()
  // ).join('\n'))

  // const onMonthWeekChange = (dates: DateTimePickerValue[] | DateTimePickerValue): void => {
  //   const date = dates as string;
  //   setMonthWeekValue(date);
  // }

  // const [value, setValue] = useState<string[]>([]);
  // const onChange = (dates: DateTimePickerValue[] | DateTimePickerValue): void => {
  //   const dateRange = dates as Date[];
  //   setValue(dateRange.map((date) => {
  //     return dayjs(date).format('YYYYMMDDTHH:mm:ss');
  //   }));
  // }

  const maxDate = dayjs('20311011', 'YYYYMMDD').toDate();
  const minDate = dayjs('20050412 14:32:33', 'YYYYMMDD HH:mm:ss').toDate();

  const [popupValue, setPopupValue] = useState(false);
  const onCellClick = (): void => {
    setPopupValue(true);
  };

  return (
    <div className="demo demo-date-time-picker">
      <DemoHeader title="日期选择器" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="年月日">
        <DateTimePicker
          value={singleValue}
          onChange={onSingleChange}
          onConfirm={(): void => {
            alert(`confirm ${singleValue.toLocaleString()}`);
          }}
          onCancel={(): void => alert('cancel')}
        />
      </MobileCard>

      <MobileCard title="选择完整时间">
        <DateTimePicker
          value={singleValue}
          onChange={onSingleChange}
          onConfirm={(): void => {
            alert(`confirm ${singleValue.toLocaleString()}`);
          }}
          onCancel={(): void => alert('cancel')}
          type="datetime"
        />
      </MobileCard>

      <MobileCard title="选择时间">
        <DateTimePicker
          value={timeValue}
          onChange={onTimeChange}
          onConfirm={(): void => {
            alert(`confirm ${timeValue.toLocaleString()}`);
          }}
          onCancel={(): void => alert('cancel')}
          type="time"
        />
      </MobileCard>

      <MobileCard title="选择年份">
        <DateTimePicker
          value={yearValue}
          onChange={onYearChange}
          onConfirm={(): void => {
            alert(`confirm ${yearValue.toLocaleString()}`);
          }}
          onCancel={(): void => alert('cancel')}
          type="year"
        />
      </MobileCard>

      <MobileCard title="选择月份">
        <DateTimePicker
          value={monthValue}
          onChange={onMonthChange}
          onConfirm={(): void => {
            alert(`confirm ${monthValue.toLocaleString()}`);
          }}
          onCancel={(): void => alert('cancel')}
          type="month"
        />
      </MobileCard>

      <MobileCard title="最小值最大值使用">
        <DateTimePicker
          value={singleValue}
          onChange={(value: any): void => console.log(value)}
          onConfirm={(): void => {
            alert(`confirm ${singleValue.toLocaleString()}`);
          }}
          onCancel={(): void => alert('cancel')}
          maxDate={maxDate}
          minDate={minDate}
        />
      </MobileCard>

      <MobileCard title="搭配弹层使用">
        <Cell title="选择时间" isLink onClick={onCellClick}></Cell>
        <Popup
          value={popupValue}
          onChange={(value): void => {
            setPopupValue(value);
          }}
          position="bottom"
        >
          <DateTimePicker
            value={singleValue}
            onChange={onSingleChange}
            onConfirm={(): void => {
              setPopupValue(false);
            }}
            onCancel={(): void => {
              setPopupValue(false);
            }}
          />
        </Popup>
      </MobileCard>

      {/* <div className="demo-cell">
        <h4>日期选择用法</h4>
        
        <h4>范围选择用法</h4>
        <DateTimePicker value={value} onChange={onChange} range />
        <h4>tosecond 用法</h4>
        <DateTimePicker value={value} onChange={onChange} range type="datetime" maxDate={maxDate} 
          minDate={minDate}
        />
        <h4>调整列顺序用法</h4>
        <DateTimePicker value={value} onChange={onChange} range columnSequence={[1,2,0]} />
        <h4>week in month 用法</h4>
        <DateTimePicker value={monthWeekValue} onChange={onMonthWeekChange} type="monthweek"
          maxDate={maxDate} 
          minDate={minDate}
        />
        <h4>日期format用法</h4>
        <DateTimePicker value={singleValue} onChange={onSingleChange} maxDate={maxDate} 
          minDate={minDate}
          formatters={[(year) => `${year} year`, (month) => `${month + 1} yue`, (date) => `<${date}>`]}
        />
        <h4>日期弹窗用法</h4>
       
      </div> */}
    </div>
  );
}

export default Demo;
