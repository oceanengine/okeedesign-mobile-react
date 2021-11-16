import React, { FC } from 'react';
import pointerSvg from '../../../static/pointer.svg'
import './index.less'

interface DemoTitleProps {
    title: string;
}
const DemoTitle: FC<DemoTitleProps> = (props: DemoTitleProps) => {

  const { title } = props

  return (
    <div className="dome-title">
      <img src={pointerSvg} alt="" className="svg-icon-pointer"></img>
      <div className="dome-title-word">{title}</div>
    </div>
  )
}

export { DemoTitle }