/* eslint-disable semi */
import React, { FC, useState } from 'react';
import { Popup, Tree, Cell } from '../../../index';
import { TreeOption, TreeValue } from '../../../components/tree';
import { useHistory } from 'react-router-dom';
import DemoHeader from '../../../../docs/mobile/components/mobile-header/index';
import { MobileCard } from '../../../../docs/mobile/components/mobile-card/index';

const DemoTree: FC = () => {
  const options: TreeOption[] = [
    {
      label: 'Breakfast',
      value: 'breakfast',
      children: [
        {
          label: 'Breads',
          value: 'breakfast_breads',
        },
        {
          label: 'Milk',
          value: 'breakfast_milk',
        },
      ],
    },
    {
      label: 'Lunch',
      value: 'lunch',
      children: [
        {
          label: 'Sandwich',
          value: 'lunch_sandwich',
        },
        {
          label: 'fruit',
          value: 'lunch_fruit',
          children: [
            {
              label: 'Apple',
              value: 'lunch_fruit_apple',
            },
            {
              label: 'Banana',
              value: 'lunch_fruit_banana',
            },
          ],
        },
      ],
    },
    {
      label: 'Dinner',
      value: 'dinner',
      children: [
        {
          label: 'Steak',
          value: 'dinner_steak',
        },
        {
          label: 'Salad',
          value: 'dinner_salad',
        },
        {
          label: 'Cakes',
          value: 'dinner_cakes',
        },
      ],
    },
  ];

  const [showTree, setShowTree] = useState(false);
  const [selectedValues, setSelectedValues] = useState<TreeValue[]>([
    {
      value: 'lunch',
      children: [
        {
          value: 'lunch_fruit',
          children: [
            {
              value: 'lunch_fruit_apple',
            },
          ],
        },
      ],
    },
  ]);

  const [showTreeIncomplete, setShowTreeIncomplete] = useState(false);
  const [selectedValuesIncomplete, setSelectedValuesIncomplete] = useState<TreeValue[]>([
    {
      value: 'lunch_fruit',
      status: 'all',
    },
  ]);

  const [showTreeFlat, setShowTreeFlat] = useState(false);
  const [selectedValuesFlat, setSelectedValuesFlat] = useState<string[]>(['lunch_fruit_apple']);

  const history = useHistory();
  const onClickLeft = (): void => {
    history.goBack();
  };
  return (
    <div className="demo demo-tree">
      <DemoHeader title="树形选择" onClickLeft={onClickLeft}></DemoHeader>

      <MobileCard title="基础用法" className="cell-border-radius-box">
        <Cell
          title="基础用法"
          border
          clickable
          isLink
          onClick={(): void => setShowTree(!showTree)}
        />
        <Popup value={showTree} onChange={setShowTree} position="bottom">
          <Tree
            options={options}
            value={selectedValues}
            onChange={(value): void => setSelectedValues(value as TreeValue[])}
          ></Tree>
        </Popup>
      </MobileCard>

      <MobileCard title="不完整的数据" className="cell-border-radius-box">
        <Cell
          title="不完整的数据"
          border
          clickable
          isLink
          onClick={(): void => setShowTreeIncomplete(!showTreeIncomplete)}
        />
        <Popup value={showTreeIncomplete} onChange={setShowTreeIncomplete} position="bottom">
          <Tree
            options={options}
            value={selectedValuesIncomplete}
            onChange={(value): void => setSelectedValuesIncomplete(value as TreeValue[])}
          ></Tree>
        </Popup>
      </MobileCard>

      <MobileCard title="扁平模式" className="cell-border-radius-box">
        <Cell
          title="扁平模式"
          border
          clickable
          isLink
          onClick={(): void => setShowTreeFlat(!showTreeFlat)}
        />
        <Popup value={showTreeFlat} onChange={setShowTreeFlat} position="bottom">
          <Tree
            options={options}
            value={selectedValuesFlat}
            onChange={(value): void => setSelectedValuesFlat(value as string[])}
            flat
          ></Tree>
        </Popup>
      </MobileCard>
    </div>
  );
};

export default DemoTree;
