import React, { Component } from 'react'

import WaitingInput from './WaitingInput'

export default class WaitingInputFrame extends Component {
  state = {
    latestInputTimeStamp: 0,
    isFocus: false
  }

  setQuickTriggerEvent(action, handler) {
    window[`${action}EventListener`]('mousemove', handler)
    window[`${action}EventListener`]('touchstart', handler)
  }

  handleInputChange = receivedValue => {
    this.props.handleInputChange && this.props.handleInputChange()

    this.setState({
      latestInputTimeStamp: Date.now()
    })

    clearTimeout(this.timer)
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
        clearTimeout(this.timer)
        this.setQuickTriggerEvent('remove', this.quickTriggerHandler)

        console.log('((diff > 1200) && (diff < 1500))')
        this.submitDetect(receivedValue)
      }
    }
    this.setQuickTriggerEvent('add', this.quickTriggerHandler)
  }

  submitDetect(submitValue) {
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
