import React, { useRef, useState, useEffect } from 'react'
import './WaitingInput.scss'

export type WaitingInputProps = {
  disabled: boolean
  isFailure: boolean
  placeholder: string
  isFocus: boolean
  onBlur(): void
  onFocus(): void
  onInputChange(v: string): void
}
export default ({
  disabled,
  isFailure,
  placeholder = '',
  isFocus = false,
  onBlur = () => undefined,
  onFocus = () => undefined,
  onInputChange = () => undefined,
}: WaitingInputProps) => {
  const inputEl = useRef<HTMLInputElement>(null)
  const frontEl = useRef<HTMLPreElement>(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (inputEl.current && frontEl.current) {
      if (frontEl.current.scrollWidth === 0) {
        inputEl.current.style.width = '100%'
      } else {
        inputEl.current.style.width = `${frontEl.current.scrollWidth}px`
      }
    }
  })

  useEffect(() => {
    if (inputEl.current && frontEl.current) {
      if (isFocus) {
        inputEl.current.focus()
      } else {
        inputEl.current.blur()
      }
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
