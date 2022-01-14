import { useCallback, useState } from 'react'
import vait from 'vait'
import { findListByProperty, removeListItemByIdx } from './common'

import DEngine from './d-engine'

const _p = () => new Promise<{ blob: Blob, blobUrl: string }>(() => {})
export type PoolItem = {
  src: string
  promise: ReturnType<typeof _p>
}

export const MAX_PARALLEL_NUMBER = 3

const globalQueueLoad = QueueLoad()
export default globalQueueLoad
export function QueueLoad() {
  let query: PoolItem[] = []
  let pool: PoolItem[] = []

  const _v = () => vait<any, any>()

  let loadLocker: null | ReturnType<typeof _v> = null
  return async (src: string) => {
    if (loadLocker) {
      await loadLocker
    }

    if (query.length > MAX_PARALLEL_NUMBER) {
      loadLocker = vait()
    }

    const idx = findListByProperty(pool, 'src', src)
    if (idx === -1) {
      const DEpromise = DEngine({
        url: src
      }).then(blob => {
        return {
          blob,
          blobUrl: URL.createObjectURL(blob)
        }
      })

      const newPoolItem = {
        src,
        promise: DEpromise
      }

      pool = [...pool, newPoolItem]
      query = [...query, newPoolItem]

      DEpromise.then(() => {
        const idx = findListByProperty(query, 'src', src)
        if (idx !== -1) {
          query = removeListItemByIdx(query, idx)
          loadLocker && loadLocker.pass(undefined)
        }
      })

      return newPoolItem.promise
    } else {
      return pool[idx].promise
    }
  }
}

export function useQueueload() {
  const [blobSrc, setBlobSrc] = useState<string>('')

  const loadBlobSrc = useCallback(async (src: string) => {
    const res = await globalQueueLoad(src)
    setBlobSrc(res.blobUrl)
    return res
  }, [])

  return [blobSrc, loadBlobSrc] as const
}
