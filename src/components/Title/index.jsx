import React from 'react'
import './index.scss'

export default props =>
  <div className="title-split-line">
    <div className="title-split-line-body">{ props.children }</div>
  </div>
