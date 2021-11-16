import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
// import { CalendarProps } from '..';
import { Calendar, Cell, Popup } from '../../../../src/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';

function CalendarDemo(): JSX.Element {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };

  // popup value
  const [single, setSingle] = useState(false);
  const [range, setRange] = useState(false);
  const [fixedStartDate, setFixedStartDate] = useState(false);
  const [fixedEndDate, setFixedEndDate] = useState(false);

  // calendar value and cell display value
  const [singleValue, setSingleValue] = useState();
  const [cellSingleValue, setCellSingleValue] = useState('选择单个日期');
  const [rangeValue, setRangeValue] = useState([]);
  const [cellRangeValue, setCellRangeValue] = useState('选择日期区间');
  const [fixedStartValue, setFixedStartValue] = useState([new Date()]);
  const [cellFixedStartValue, setCellFixedStartValue] = useState('选择日期区间');
  const [fixedEndValue, setFixedEndValue] = useState(['', new Date()]);
  const [cellFixedEndValue, setCellFixedEndValue] = useState('选择日期区间');

  const confirmSinglePopup = (): void => {
    setCellSingleValue(dayjs(singleValue).format('YYYY-MM-DD'));
    setSingle(false);
  };

  const confirmRangePopup = (): void => {
    setCellRangeValue(
      `${dayjs(rangeValue[0]).format('YYYY/MM/DD')} - ${dayjs(rangeValue[1]).format('YYYY/MM/DD')}`,
    );
    setRange(false);
  };

  const confirmFixedStartDatePopup = (): void => {
    setCellFixedStartValue(
      `${dayjs(fixedStartValue[0]).format('YYYY/MM/DD')} - ${dayjs(fixedStartValue[1]).format(
        'YYYY/MM/DD',
      )}`,
    );
    setFixedStartDate(false);
  };

  const confirmFixedEndDatePopup = (): void => {
    setCellFixedEndValue(
      `${dayjs(fixedEndValue[0]).format('YYYY/MM/DD')} - ${dayjs(fixedEndValue[1]).format(
        'YYYY/MM/DD',
      )}`,
    );
    setFixedEndDate(false);
  };

  return (
    <div className="demo demo-button">
      <DemoHeader title="日历" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="年月日" className="cell-border-radius">
        <Cell
          title="单选"
          value={cellSingleValue}
          isLink
          border
          size="small"
          onClick={(): void => setSingle(true)}
        ></Cell>
        <Cell
          title="区间"
          value={cellRangeValue}
          isLink
          border
          size="small"
          onClick={(): void => setRange(true)}
        ></Cell>
        {/* <Cell title="多选" isLink border size="small" onClick={(): void => setMulti(true)}></Cell> */}

        <Popup position="bottom" value={single} onChange={(value): void => setSingle(value)}>
          <Calendar
            mode="single"
            value={singleValue}
            showHeader={true}
            showCancelButton={true}
            showConfirmButton={true}
            onCancel={(): void => setSingle(false)}
            onConfirm={(): void => confirmSinglePopup()}
            onChange={(value: any): void => setSingleValue(value)}
          />
        </Popup>
        <Popup position="bottom" value={range} onChange={(value): void => setRange(value)}>
          <Calendar
            mode="range"
            value={rangeValue}
            showHeader={true}
            showCancelButton={true}
            showConfirmButton={true}
            onCancel={(): void => setRange(false)}
            onConfirm={(): void => confirmRangePopup()}
            onChange={(value: any): void => setRangeValue(value)}
          />
        </Popup>
      </MobileCard>

      <MobileCard title="范围选择, 固定起始时间或结束时间">
        <Cell
          title="固定起始时间"
          value={cellFixedStartValue}
          isLink
          border
          size="small"
          onClick={(): void => setFixedStartDate(true)}
        ></Cell>
        <Cell
          title="固定结束时间"
          value={cellFixedEndValue}
          isLink
          border
          size="small"
          onClick={(): void => setFixedEndDate(true)}
        ></Cell>

        <Popup
          position="bottom"
          value={fixedStartDate}
          onChange={(value): void => setFixedStartDate(value)}
        >
          <Calendar
            mode="range"
            value={fixedStartValue}
            showHeader={true}
            showCancelButton={true}
            showConfirmButton={true}
            fixedStartDate
            onCancel={(): void => setFixedStartDate(false)}
            onConfirm={(): void => confirmFixedStartDatePopup()}
            onChange={(value: any): void => setFixedStartValue(value)}
          />
        </Popup>
        <Popup
          position="bottom"
          value={fixedEndDate}
          onChange={(value): void => setFixedEndDate(value)}
        >
          <Calendar
            mode="range"
            value={fixedEndValue}
            showHeader={true}
            showCancelButton={true}
            showConfirmButton={true}
            fixedEndDate
            onCancel={(): void => setFixedEndDate(false)}
            onConfirm={(): void => confirmFixedEndDatePopup()}
            onChange={(value: any): void => setFixedEndValue(value)}
          />
        </Popup>
      </MobileCard>
    </div>
  );
}

export default CalendarDemo;
