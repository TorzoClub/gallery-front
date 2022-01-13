import React from 'react'
import s from './Article.module.css'

export default () => {
  return (
    <>
      <div className={s.root}>
        {/* eslint-disable-next-line no-irregular-whitespace */}
        <div className={s.title}>須　知</div>

        <div className={s.middle}>
          <p style={{ textAlign: 'center' }}>感谢参与投票环节</p>

          <p>
            不过，在投票之前，希望各位能自觉秉承以下的条件来维护「公平公正」与「独立自主」
          </p>

          <ul className={s.ul}>
            <li className={s.li}>
              按照自己的喜好投票。不要因为对谁有好感/坏感、对方要求而投票
            </li>
            <li className={s.li}>
              按照自己的审美投票。不要因为大家说A好，B不好，就选了A
            </li>
          </ul>
        </div>
      </div>

      {/* <style jsx>{`
        .prompt-richtext {
        }
      `}</style> */}
    </>
  )
}
