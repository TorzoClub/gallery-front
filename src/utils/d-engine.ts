import vait from 'vait'

export type Args = {
  url: string

  onProgress?: (percent: number) => void
  onDone?: (blob: Blob) => void
  onStart?: () => void
  onFailure?: (err: any) => void
  onEnd?: () => void
}

export default DEngine
function DEngine({
  url,
  onProgress = () => undefined,
  onDone = () => undefined,
  onStart = () => undefined,
  onFailure = () => undefined,
  onEnd = () => undefined
}: Args) {
  const v = vait<Blob, Error>()

  const xhr = new XMLHttpRequest()
  xhr.onprogress = e => {
    const percent = parseFloat((e.loaded / e.total).toFixed(2))
    onProgress(percent)
  }
  xhr.onload = e => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200 || xhr.status === 304) {
        v.pass(xhr.response)
        onDone(xhr.response)
      }
    }
  }
  xhr.onerror = e => {
    const err = Object.assign(new Error('d-engine error'), { e, xhr })
    v.fail(err)
    onFailure(err)
  }
  xhr.onloadend = e => {
    onEnd()
  }
  xhr.onloadstart = e => {
    onStart()
  }

  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.send()

  return v
}
