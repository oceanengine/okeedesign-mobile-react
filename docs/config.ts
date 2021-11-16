/**
 * 路由配置文件
 */
import changeLogIcon from './static/menu_icons/changelog.svg';
import changeLogIconActive from './static/menu_icons/changelog_active.svg';
import quickstartIcon from './static/menu_icons/quickstart.svg';
import quickstartIconActive from './static/menu_icons/quickstart_active.svg';
import compIcon from './static/menu_icons/comp.svg';
import compIconActive from './static/menu_icons/comp_active.svg';
import themeIcon from './static/menu_icons/theme.svg';
import themeIconActive from './static/menu_icons/theme_active.svg';
import introIcon from './static/menu_icons/intro.svg';
import introIconActive from './static/menu_icons/intro_active.svg';
import { Config } from './type';

export type Lang = 'zh-CN' | 'en-US';

const config: Record<Lang, Config> = {
  'zh-CN': {
    navs: [
      {
        label: '介绍',
        path: '/intro',
        activeIcon: introIconActive,
        defaultIcon: introIcon,
      },
      {
        label: '快速上手',
        path: '/quickstart',
        activeIcon: quickstartIconActive,
        defaultIcon: quickstartIcon,
      },
      {
        label: '更新日志',
        path: '/changelog',
        activeIcon: changeLogIconActive,
        defaultIcon: changeLogIcon,
      },
      {
        label: '主题配置',
        path: '/theme',
        activeIcon: themeIconActive,
        defaultIcon: themeIcon,
      },
      {
        label: '组件',
        activeIcon: compIconActive,
        defaultIcon: compIcon,
        list: [
          {
            label: '基础组件',
            list: [
              {
                label: 'Button 按钮',
                path: '/button',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
                
              },
              {
                label: 'Popup 弹出层',
                path: '/popup',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
                
              },
              {
                label: 'Cell 单元格',
                path: '/cell',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
                
              },
              {
                label: 'Layout 布局',
                path: '/row',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
                
              },
            ],
          },
          {
            label: '反馈组件',
            list: [
              {
                label: 'Modal 对话框',
                path: '/modal',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
                
              },
              {
                label: 'Dialog 自定义对话框',
                path: '/dialog',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
                
              },
              {
                label: 'Toast 轻提示',
                path: '/toast',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'ActionSheet 上拉菜单',
                path: '/action-sheet',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  // { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Swipe Cell 滑动单元格',
                path: '/swipe-cell',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Dropdown 下拉菜单',
                path: '/dropdown',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
            ],
          },
          {
            label: '表单组件',
            list: [
              {
                label: 'Field 输入框',
                path: '/field',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Radio 单选框',
                path: '/radio',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Checkbox 复选框',
                path: '/checkbox',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Switch 开关',
                path: '/switch',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Picker 选择器',
                path: '/picker',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Cascader 级联',
                path: '/cascader',
              },
              {
                label: 'Tree 树',
                path: '/tree',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'DateTimePicker 日期选择器',
                path: '/date-time-picker',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Calendar 日历',
                path: '/calendar',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Search 搜索',
                path: '/search',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Slider 滑块',
                path: '/slider',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              }
            ],
          },
          {
            label: '导航组件',
            list: [
              {
                label: 'Header 导航栏',
                path: '/header',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Tabs 标签页',
                path: '/tabs',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
            ],
          },
          {
            label: '展示组件',
            list: [
              {
                label: 'Table 表格',
                path: '/table',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Badge 徽标',
                path: '/badge',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Loading 加载显示',
                path: '/loading',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Progress 进度条',
                path: '/progress',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'NoticeBar 通知栏',
                path: '/notice-bar',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Tag 标签',
                path: '/tag',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Swipe 轮播',
                path: '/swipe',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'ImagePreview 图片预览',
                path: '/image-preview',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Collapse 折叠面板',
                path: '/collapse',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Pull Refresh 下拉刷新',
                path: '/pull-refresh',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Infinite Scroll 滚动加载',
                path: '/infinite-scroll',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
              {
                label: 'Sticky 粘性定位',
                path: '/sticky',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              },
            ],
          },
          {
            label: '业务组件',
            list: [
              {
                label: 'PopupDrillDown 下钻',
                path: '/popup-drill-down',
                anchors: [
                  { id: '安装', label: '安装' },
                  { id: '代码演示', label: '代码演示' },
                  { id: 'API', label: 'API' },
                ],
              }
            ]
          },
        ],
      },
    ],
  },
  'en-US': {
    navs: [
      {
        label: 'Quick Start',
        path: '/quickstart',
      },
      {
        label: 'Change Log',
        path: '/changelog',
      },
      {
        label: 'Custom Theme',
        path: '/theme',
      },
      {
        label: 'Components',
        list: [
          {
            label: 'Basic Components',
            list: [
              {
                label: 'Button',
                path: '/button',
              },
              {
                label: 'Popup',
                path: '/popup',
              },
              {
                label: 'Cell',
                path: '/cell',
              },
              {
                label: 'Layout',
                path: '/row',
              },
            ],
          },
          {
            label: 'Action Components',
            list: [
              {
                label: 'Modal',
                path: '/modal',
              },
              {
                label: 'Dialog',
                path: '/dialog',
              },
              {
                label: 'Toast',
                path: '/toast',
              },
              {
                label: 'ActionSheet',
                path: '/action-sheet',
              },
              {
                label: 'Swipe Cell',
                path: '/swipe-cell',
              },
            ],
          },
          {
            label: 'Form Components',
            list: [
              {
                label: 'Field',
                path: '/field',
              },
              {
                label: 'Radio',
                path: '/radio',
              },
              {
                label: 'Checkbox',
                path: '/checkbox',
              },
              {
                label: 'Switch',
                path: '/switch',
              },
              {
                label: 'Picker',
                path: '/picker',
              },
              {
                label: 'Cascader',
                path: '/cascader',
              },
              {
                label: 'Tree',
                path: '/tree',
              },
              {
                label: 'DateTimePicker',
                path: '/date-time-picker',
              },
              {
                label: 'Calendar',
                path: '/calendar',
              },
              {
                label: 'Search',
                path: '/search',
              },
              {
                label: 'Slider',
                path: '/slider',
              },
            ],
          },
          {
            label: 'Navigation Components',
            list: [
              {
                label: 'Header',
                path: '/header',
              },
              {
                label: 'Tabs',
                path: '/tabs',
              },
            ],
          },
          {
            label: 'Display Components',
            list: [
              {
                label: 'Badge',
                path: '/badge',
              },
              {
                label: 'Loading',
                path: '/loading',
              },
              {
                label: 'Progress',
                path: '/progress',
              },
              {
                label: 'NoticeBar',
                path: '/notice-bar',
              },
              {
                label: 'Tag',
                path: '/tag',
              },
              {
                label: 'Swipe',
                path: '/swipe',
              },
              {
                label: 'ImagePreview',
                path: '/image-preview',
              },
              {
                label: 'Collapse',
                path: '/collapse',
              },
              {
                label: 'Pull Refresh',
                path: '/pull-refresh',
              },
              {
                label: 'Infinite Scroll',
                path: '/infinite-scroll',
              },
            ],
          },
          {
            label: 'Business Component',
            list: [
              {
                label: 'PopupDrillDown',
                path: '/popup-drill-down',
              }
            ]
          },
        ],
      },
    ],
  },
};

export default config;
