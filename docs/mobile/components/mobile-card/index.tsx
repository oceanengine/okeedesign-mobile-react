import React, { FC } from 'react';
import './index.less'

interface DemoCellProps {
    title: string;
    children: any;
    style?: object;
    className?: string;
}
const MobileCard: FC<DemoCellProps> = (props: DemoCellProps) => {

  const { title } = props
  const centerEle = props.children || ''
  const className = `${props.className || ''} demo-cell-content-slot`
  return (
    <div className="demo-cell">
      <div className="demo-cell-header">
        <div className="demo-cell-header-title" style={props.style ? props.style : {}}>
          <span className="demo-cell-header-title__left">{ title }</span>
        </div>
      </div>
      <div className={className}>
        { centerEle }
      </div>
    </div>
  )
}

export { MobileCard }