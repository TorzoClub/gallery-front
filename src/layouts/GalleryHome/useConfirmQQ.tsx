import { confirmQQNum } from 'api/member'
import ConfirmQQ, { ConfirmQQState } from 'components/ConfirmQQ'
import React, { useCallback } from 'react'
import { useStateObject } from 'utils/common'
import vait from 'vait'

export default ({ onConfirmSuccess }: { onConfirmSuccess(qqnum: string): void }) => {
  const [confirmState, setConfirmState] = useStateObject<ConfirmQQState>({
    in: false,
    disabled: false,
    isDone: false,
    isLoading: false,
    isFailure: null,
  })

  const handleQQSubmit = useCallback(async (qq_num: string) => {
    try {
      setConfirmState({ isLoading: true })

      const [confirmResult] = await Promise.all([confirmQQNum(Number(qq_num)), vait.timeout(1500)])

      if (confirmResult) {
        onConfirmSuccess(qq_num)
      } else {
        setConfirmState({
          isLoading: false,
          isFailure: new Error('朋友，你这个Q号不对，再看看？')
        })
      }
    } catch (err) {
      console.error('handlesubmit error', err)
      setConfirmState({ isLoading: false, isFailure: err as Error })
    }
  }, [onConfirmSuccess, setConfirmState])

  const ConfirmQQLayout = (
    <ConfirmQQ
      {...confirmState}
      handleInputChange={() => {
        setConfirmState({
          isFailure: null
        })
      }}
      handlesubmitDetect={handleQQSubmit}
    />
  )

  return [ConfirmQQLayout, confirmState, setConfirmState] as const
}
