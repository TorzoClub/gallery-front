import React from 'react'

import './index.scss'

export default ({ className = '', style = {}, mode, clickButton }) => {

  return (
    <div
      className={`button-frame ${mode} ${className}`}
      onClick={clickButton}
      style={{ ...style }}
    >
      <div className="button-loop">
        <div className="loop"></div>
      </div>
      <div className="button-click">
        {/* <button></button> */}
        <span>提交</span>
      </div>
    </div>
  )
}
