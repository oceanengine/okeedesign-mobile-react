import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { InfiniteScroll, PullRefresh, Header, HeaderTabs, HeaderTab } from '../../../../src/index';
import { useRefCallback } from '../../../hooks';
import './index.less';

type OptionItem = {
  value: number;
  label: string;
};
function generateItems(length: number, base = 0): OptionItem[] {
  return Array.from(Array(length).keys()).map(key => {
    const randomLabel = Math.floor(Math.random() * 1000);
    return {
      value: base + key,
      label: `random number: ${randomLabel}`,
    };
  });
}

export default function InfiniteScrollDemo(): JSX.Element {
  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };

  const [items, setItems] = React.useState<OptionItem[]>([]);
  function Items(): JSX.Element[] {
    return items.map(item => {
      return <li key={item.value}>{item.label}</li>;
    });
  }

  const [isLoading, setIsLoading] = React.useState(false);
  const [end, setEnd] = React.useState(false);
  const onTouch = useRefCallback(() => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      setItems(oldValue => {
        return ([] as OptionItem[]).concat(oldValue).concat(generateItems(10, oldValue.length));
      });
      if (items.length + 20 > 100) {
        setEnd(true);
      }
    }, 1000);
  });

  const [activeTab, setActiveTab] = React.useState('global');
  const [tabs] = React.useState(() => {
    return [
      {
        value: 'global',
        label: '全局',
      },
      {
        value: 'region',
        label: '局部',
      },
      {
        value: 'combine',
        label: '混用',
      },
    ];
  });

  const [value, setValue] = React.useState(false);
  const onRefresh = function (): void {
    setValue(true);
    setTimeout(() => {
      setValue(false);
      setItems(generateItems(30));
    }, 1000);
  };

  React.useEffect(() => {
    setItems(generateItems(30));

    if (activeTab === 'global') {
      const app = document.querySelector('.app');
      app!.classList.add('demo-infinite-scroll');
    }
    return (): void => {
      const app = document.querySelector('.app');
      app!.classList.remove('demo-infinite-scroll');
    };
  }, [activeTab]);

  return (
    <div className="demo demo-infinite-scroll">
      <Header fixed onClickLeft={onClickLeft}>
        <HeaderTabs
          value={activeTab}
          onChange={(newActiveTab): void => setActiveTab(newActiveTab.toString())}
        >
          {tabs.map(t => (
            <HeaderTab key={t.value} title={t.label} name={t.value}></HeaderTab>
          ))}
        </HeaderTabs>
      </Header>
      <div className={`demo-cell demo-cell--${activeTab}`}>
        {activeTab === 'global' && (
          <InfiniteScroll
            key="global"
            className="custom-infinite-scroll custom-infinite-scroll--global"
            isLoading={isLoading}
            end={end}
            onTouch={onTouch}
            appendToBody
          >
            <h4>全局滚动</h4>
            {Items()}
          </InfiniteScroll>
        )}
        {activeTab === 'region' && (
          <InfiniteScroll
            key="region"
            className="custom-infinite-scroll custom-infinite-scroll--region"
            preloadClassName="custom-infinite-scroll__preload"
            isLoading={isLoading}
            end={end}
            onTouch={onTouch}
          >
            <h4>设置高度后，局部滚动</h4>
            {Items()}
          </InfiniteScroll>
        )}
        {activeTab === 'combine' && (
          <PullRefresh
            value={value}
            onRefresh={onRefresh}
            direction={'down'}
            successDuration={1000}
          >
            <InfiniteScroll
              key="region"
              className="custom-infinite-scroll custom-infinite-scroll--combine"
              preloadClassName="custom-infinite-scroll__preload"
              isLoading={isLoading}
              end={end}
              onTouch={onTouch}
            >
              <h4>结合局部滚动和下拉刷新</h4>
              {Items()}
            </InfiniteScroll>
          </PullRefresh>
        )}
      </div>
    </div>
  );
}
