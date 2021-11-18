import React, { useRef, useState, useEffect } from 'react'

export default ({
  disabled,
  isFailure,
  onInputChange = () => undefined
}) => {
  const inputEl = useRef(null)
  const frontEl = useRef(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    inputEl.current.style.width = `${frontEl.current.offsetWidth}px`
  })

  return (
    <div className={`wrapper ${isFailure ? 'failure' : ''}`}>
      <input
        className="input-mask"
        ref={inputEl}
        disabled={disabled}
        value={value}
        spellCheck="false"
        onChange={(e) => {
          e.preventDefault()
          const changedValue = e.target.value

          const isInvalidValue = /[^0-9/?]/.test(changedValue)
          if (!isInvalidValue) {
            setValue(changedValue)
            onInputChange(changedValue)
          }
        }}
      />

      <pre
        className="input-front"
        ref={frontEl}
      >{value}</pre>

      <style jsx>{`
        .wrapper {
          position: relative;
          margin-top: 6px;
        }

        @keyframes shake {
          10%, 90% {
            transform: translate3d(-6px, 0, 0);
          }

          20%, 80% {
            transform: translate3d(4px, 0, 0);
          }

          20%, 80% {
            transform: translate3d(4px, 0, 0);
          }

          30%, 50%, 70% {
            transform: translate3d(-8px, 0, 0);
          }

          40%, 60% {
            transform: translate3d(8px, 0, 0);
          }
        }

        .wrapper.failure {
          animation: shake 0.8s;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0,.44,.26,1);
          /* transform: translate3d(0, 0, 0); */
          backface-visibility: hidden;
          perspective: 1000px;
        }

        .wrapper.failure .input-front {
          color: rgb(241, 56, 56);
        }

        .input-mask {
          position: absolute;
          left: 0;
          top: 0;

          box-sizing: border-box;
          padding: 0 0.5em;
          margin: 0;
          width: 100vw;

          background-color: transparent;

          font-family: courier;
          outline: none;
          font-size: 24px;
          line-height: 1.5em;
          letter-spacing: 0.1em;
          border: solid 5px transparent;
          border-top: 0;
          /* padding-top: 5px; */
          border-left: 0;
          border-right: 0;

          text-align: center;
          color: transparent;
          caret-color: #BBB;

          white-space: pre;
          /* background: transparent; */
        }

        .input-mask:focus + .input-front {
          border-color: #3a3a45;
        }

        .input-front {
          box-sizing: border-box;
          padding: 0 0.5em;
          margin: auto;
          width: 12em;

          white-space: pre;
          outline: none;
          font-size: 24px;
          height: 1.5em;
          line-height: 1.5em;
          letter-spacing: 0.1em;
          /* border: solid 5px #CCC; */
          border-top: 0;
          /* padding-top: 5px; */
          border-left: 0;
          border-right: 0;

          text-align: center;

          color: #3a3a45;

          /* min-width: 100vw; */

          transition: border-color 618ms;
          font-family: courier;

          border-top: solid 1px transparent !important;
          border-bottom: solid 1px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}
