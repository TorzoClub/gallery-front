import React, { useRef, useState, useEffect } from 'react'
import './WaitingInput.scss'

export default ({
  disabled,
  isFailure,
  onInputChange = () => undefined,
  placeholder = '',
  onBlur = () => undefined,
  onFocus = () => undefined,

  isFocus = false
}) => {
  const inputEl = useRef(null)
  const frontEl = useRef(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (frontEl.current.scrollWidth === 0) {
      inputEl.current.style.width = '100%'
    } else {
      inputEl.current.style.width = `${frontEl.current.scrollWidth}px`
    }
  })

  useEffect(() => {
    if (isFocus) {
      inputEl.current.focus()
    } else {
      inputEl.current.blur()
    }
  }, [isFocus])

  return (
    <div className={`wrapper ${isFailure ? 'failure' : ''}`}>
      <pre
        className="input-front"
        ref={frontEl}
      >
        {value}
        <div className={`placeholder ${value.length ? 'placeholder-hide' : ''}`}>{placeholder}</div>
      </pre>

      {disabled ? null : (
        <input
          className="input-mask"
          ref={inputEl}
          disabled={disabled}
          value={value}
          inputMode="numeric"
          spellCheck="false"
          onBlur={onBlur}
          onFocus={onFocus}
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
      )}
    </div>
  )
}
