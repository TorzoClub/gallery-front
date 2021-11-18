import vait from 'vait'

export default (url) => {
  const v = vait()

  const xhr = new XMLHttpRequest()
  xhr.onprogress = e => {
    // const percent = parseFloat((e.loaded / e.total).toFixed(2))
  }
  xhr.onload = e => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200 || xhr.status === 304) {
        // const blobObject = new Blob([xhr.response], { type: xhr.getResponseHeader('content-type') })
        v.pass(xhr.response)
      }
    }
  }
  xhr.onerror = e => {
    console.error(e, xhr)
    v.fail(e)
  }
  xhr.onloadend = e => {
  }
  xhr.onloadstart = e => {
  }
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.send()

  return v
}
