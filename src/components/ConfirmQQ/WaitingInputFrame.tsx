import React, { Component } from 'react'

import WaitingInput from './WaitingInput'

type Timer =  ReturnType<typeof setTimeout>

export type WaitingInputFrameProps = {
  isFailure: boolean
  disabled: boolean
  placeholder: string
  handleInputChange: (v: string) => void
  handlesubmitDetect: (v: string) => void
}
export default class WaitingInputFrame extends Component<WaitingInputFrameProps> {
  state = {
    latestInputTimeStamp: 0,
    isFocus: false
  }

  public timer?: Timer

  quickTriggerHandler() {}

  setQuickTriggerEvent(action: 'remove' | 'add', handler: () => void) {
    window[`${action}EventListener`]('mousemove', handler)
    window[`${action}EventListener`]('touchstart', handler)
  }

  handleInputChange = (receivedValue: string) => {
    this.props.handleInputChange && this.props.handleInputChange(receivedValue)

    this.setState({
      latestInputTimeStamp: Date.now()
    })

    clearTimeout(this.timer as Timer)
    this.timer = setTimeout(() => {
      this.setQuickTriggerEvent('remove', this.quickTriggerHandler)

      this.submitDetect(receivedValue)
    }, 1200)

    this.setQuickTriggerEvent('remove', this.quickTriggerHandler)
    this.quickTriggerHandler = () => {
      console.log('quickTriggerHandler')

      const { latestInputTimeStamp } = this.state
      if (!latestInputTimeStamp) {
        return
      }

      const diff = Date.now() - latestInputTimeStamp
      if ((diff > 1200) && (diff < 1500)) {
        clearTimeout(this.timer as Timer)
        this.setQuickTriggerEvent('remove', this.quickTriggerHandler)

        console.log('((diff > 1200) && (diff < 1500))')
        this.submitDetect(receivedValue)
      }
    }
    this.setQuickTriggerEvent('add', this.quickTriggerHandler)
  }

  submitDetect(submitValue: string) {
    if (submitValue && submitValue.length) {
      // 空密码不会跳转的
      this.props.handlesubmitDetect && this.props.handlesubmitDetect(submitValue)
      this.setState({ isFocus: false })
    }
  }

  render() {
    return (
      <WaitingInput
        isFailure={ this.props.isFailure }
        disabled={ this.props.disabled }
        placeholder={ this.props.placeholder }
        onInputChange={ this.handleInputChange }
        isFocus={ this.state.isFocus }
        onBlur={() => this.setState({ isFocus: false })}
        onFocus={() => this.setState({ isFocus: true })}
      />
    )
  }
}
