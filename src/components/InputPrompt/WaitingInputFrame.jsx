import React, { Component } from 'react'

import WaitingInput from './WaitingInput'

export default class WaitingInputFrame extends Component {
  state = {
    loading: false,
    latestInputTimeStamp: 0,
    status: 'none'
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
    }, 800)

    this.setQuickTriggerEvent('remove', this.quickTriggerHandler)
    this.quickTriggerHandler = () => {
      console.log('quickTriggerHandler')

      const { latestInputTimeStamp } = this.state
      if (!latestInputTimeStamp) {
        return
      }

      const diff = Date.now() - latestInputTimeStamp
      if ((diff > 500) && (diff < 800)) {
        clearTimeout(this.timer)
        this.setQuickTriggerEvent('remove', this.quickTriggerHandler)

        console.log('(diff > 500) && (diff < 800)')
        this.submitDetect(receivedValue)
      }
    }
    this.setQuickTriggerEvent('add', this.quickTriggerHandler)
  }

  submitDetect(submitValue) {
    if (submitValue && submitValue.length) {
      // 空密码不会跳转的
      this.props.handlesubmitDetect && this.props.handlesubmitDetect(submitValue)
    }
  }

  render() {
    return (
      <WaitingInput
        isFailure={ this.props.isFailure }
        disabled={ this.props.disabled }
        status={ this.state.status }
        onInputChange={ this.handleInputChange }
      />
    )
  }
}
