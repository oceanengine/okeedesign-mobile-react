import * as React from 'react';
import { Table, Toast, Icon } from '../../../../src/index';
import {
  TableCeilingOptionsType,
  TableColumnProps,
  TableDataProps,
  TableExpandOptionsType,
} from '../types';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';
import { useHistory } from 'react-router-dom';
import { TableProps } from '..';
import { useRef, useState } from 'react';
import './index.less';

function TableDemo(): JSX.Element {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };

  React.useEffect(() => {
    const body = document.querySelector('body');
    body!.classList.add('demo-table');
    return (): void => {
      body!.classList.remove('demo-table');
    };
  }, []);

  const columns: TableColumnProps[] = [
    {
      dataProp: 'key1',
      title: '标题1',
      minWidth: '100px',
      sortable: true,
      filterable: true,
      fixed: 'left',
      cellClass: 'test',
      thCellClass: 'thclass',
      tdCellClass: 'tdClass',
    },
    {
      dataProp: 'key2',
      title: '测试标题2',
      minWidth: '160px',
      width: '100px',
      sortable: true,
    },
    {
      dataProp: 'key3',
      title: '测试标题3',
      minWidth: '150px',
      width: '250px',
      sortable: true,
      filterable: true,
    },
    {
      dataProp: 'key31',
      title: '测试标题31',
      minWidth: '150px',
      width: '250px',
      sortable: true,
      filterable: true,
    },
    {
      dataProp: 'key32',
      title: '测试标题32',
      minWidth: '150px',
      width: '250px',
      sortable: true,
      filterable: true,
    },
    {
      dataProp: 'key4',
      title: '测试标题4',
      width: '100px',
      sortable: true,
      fixed: 'right',
    },
  ];

  const fixedHeightColumns: TableColumnProps[] = columns.map(item => {
    return Object.assign({}, item, {
      fixed: undefined,
      sortable: false,
      filterable: false,
    });
  });

  const fixedColumns: TableColumnProps[] = columns.map(item => {
    return Object.assign({}, item, {
      sortable: false,
      filterable: false,
    });
  });

  const ceilingColumns: TableColumnProps[] = columns.slice(0, 2);

  const renderCellColumns: TableColumnProps[] = columns.map((item, index) => {
    if (index === 1) {
      return Object.assign({}, item, {
        renderCell(row: TableDataProps, column: TableColumnProps) {
          return (
            <div className="custom-table-cell">
              <Icon name="Check" className="custom-table-cell__icon" />
              {row[column.dataProp]}
            </div>
          );
        },
        renderThCell(column: TableColumnProps) {
          return (
            <div className="custom-table-th-cell">
              <Icon name="QuestionMark" className="custom-table-th-cell__icon" />
              {column.title}
            </div>
          );
        },
      });
    }
    return item;
  });

  const data = React.useRef(
    Array.from(new Array(20), () => {
      return {
        id: Math.random(),
        key1: '第1列数据',
        key2: '第2列数据',
        key3: '第3列数据',
        key31: '第31列数据',
        key32: '第32列数据',
        key4: '第4列数据',
        key5: '第5列数据',
        key455: '第455列数据',
        key566: '第566列数据',
        key666: '第666列数据',
        key777: '第777列数据',
        key888: '第888列数据',
        key999: '第999列数据',
        key22333: '第2333列数据',
      };
    }),
  );

  const [sortDataProp, setSortDataProp] = React.useState('key2');
  const [sortType, setSortType] = React.useState<TableProps['sortType']>('asc');

  const handleSortChange: TableProps['onSortChange'] = (column, newSortDataProp, newSortType) => {
    setSortDataProp(newSortDataProp);
    setSortType(newSortType);
  };

  const handleFilterChange: TableProps['onFilterChange'] = (column, filterDataProp) => {
    Toast.info(`filter ${filterDataProp}`);
  };

  const [ceilingOptions, setCeilingOptions] = React.useState<TableCeilingOptionsType>();

  React.useEffect(() => {
    const scrollBoundary = document.querySelector('.app') as HTMLElement;
    setCeilingOptions({
      top: 42,
      scrollBoundary,
    });
  }, []);

  const [expanded, setExpanded] = useState<string[]>([]);
  const expandingOptions = useRef<TableExpandOptionsType>({
    dataProp: 'id',
    // fixed: 'left',
    renderContent() {
      return <div>Surprise!</div>;
    },
  });

  const onExpandChange: TableProps['onExpandChange'] = (expandRowData, newExpanded) => {
    setExpanded(newExpanded);
  };

  return (
    <div className="demo demo-table">
      <DemoHeader title="表格" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="固定高度">
        <Table columns={fixedHeightColumns} data={data.current} height={350} />
      </MobileCard>

      <MobileCard title="固定列">
        <Table columns={fixedColumns} data={data.current} height={350} />
      </MobileCard>

      <MobileCard title="可展开">
        <Table
          columns={fixedHeightColumns}
          data={data.current}
          height={350}
          expanded={expanded}
          expandOptions={expandingOptions.current}
          onExpandChange={onExpandChange}
        />
      </MobileCard>

      <MobileCard title="筛选和排序">
        <Table
          columns={columns}
          data={data.current}
          height={350}
          sortDataProp={sortDataProp}
          sortType={sortType}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
        />
      </MobileCard>

      <MobileCard title="表格内容为空">
        <Table columns={fixedHeightColumns} data={[]} height={350} />
      </MobileCard>

      <MobileCard title="滑动表格">
        <Table swipeable columns={columns} data={data.current} height={350} />
      </MobileCard>

      <MobileCard title="自定义单元格">
        <Table swipeable columns={renderCellColumns} data={data.current} height={350} />
      </MobileCard>

      <MobileCard title="吸顶表格">
        <Table columns={ceilingColumns} data={data.current} ceilingOptions={ceilingOptions} />
      </MobileCard>
    </div>
  );
}

export default TableDemo;
