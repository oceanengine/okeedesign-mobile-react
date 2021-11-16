/* eslint-disable semi */
import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router';

import arrowRight from '../../../src/components/icon/svg/arrow-right.svg'

import config, { Lang } from '../../config';

export interface NavMenuProps {
  /**
   * The language.
   * @default 'zh-CN'
   */
  lang?: Lang;

  activeName: any;

  isScrollTop: boolean;

  onChange: (newValue: any) => void;

  onScroll: (v: boolean) => void;
}

const NavMenu: FC<NavMenuProps> = (props: NavMenuProps) => {
  const { lang = 'zh-CN', activeName, onChange, onScroll } = props;
  const history = useHistory();

  const navs = config[lang].navs;

  const changeHash = (idName: any): void => {
    document.querySelector(idName).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
    // document.querySelector(idName).parentNode.parentNode.scrollTop = document.querySelector(idName).offsetTop - 50
  }

  const onClick1 = (idx: any, v: any): void => {
    onChange(idx)
    const value = '#'+ v
    changeHash(value)
  }

  const setHistory = (path: any): void => {
    onChange(0)
    history.push(`/${lang}${path}`)
    onScroll(true)
  }

  useEffect(() => {
    const scrollEle = document.getElementsByClassName('demo-home-card')[0]
    const handleScroll = (): any => {
      const v: boolean = scrollEle.scrollTop === 0
      onScroll(v)
    }
    scrollEle.addEventListener('scroll', handleScroll);
    return (): any => {
      scrollEle.removeEventListener('scroll', handleScroll);
    };
  }, [])

  return (
    <div className='demo-home'>
      <div className='demo-home-nav' style={props.isScrollTop ? {} : {position: 'sticky', top: '20px'}}>
        {
          navs?.[4]?.list?.map((nav, idx) => (
            <div 
              key={idx} 
              className='demo-home-nav-item' 
              onClick={(): void => onClick1(idx, nav.label)}
              style={ activeName === idx ? {color: '#338AFF', backgroundColor: '#EBF3FF'} : { color: '#999999', backgroundColor: '#FAFAFA'} }>
              {nav.label}
            </div>
            
          ))
        }
      </div>
      <div className='demo-home-card' 
        style={{
          height: props.isScrollTop ? 'calc(100vh - 150px)' : 'calc(100vh - 84px)'
        }}>
        {navs?.[4]?.list?.map((group, idx) => (
          <div key={idx}>
            <div className='demo-home-card-title' key={idx} id={group.label}>{ group.label}</div>
            {
            group?.list?.map(_ => (
              <div key={_.path} className='demo-home-card-cell' onClick={(): void => setHistory(_.path)}>
                { _.label }
                <div className='demo-home-card-cell-icon-box'>
                  <img src={arrowRight} alt="" className='demo-home-card-cell-icon'></img>
                </div>
              </div>
            ))
            }
          </div>
        )
      )}
      </div>
    </div>
  );
};

export { NavMenu };
