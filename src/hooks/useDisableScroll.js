import { useEffect } from 'react'

export default (disable = true) => {
  useEffect(() => {
    if (!disable) {
      return
    }

    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 }

    function preventDefault(e) {
      e.preventDefault()
    }

    function preventDefaultForScrollKeys(e) {
      if (keys[e.keyCode]) {
        preventDefault(e)
        return false
      }
    }

    // modern Chrome requires { passive: false } when adding event
    let supportsPassive = false
    try {
      window.addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
          // eslint-disable-next-line getter-return
          get() {
            supportsPassive = true
          },
        })
      )
    } catch (e) {
      console.log('supportsPassive err', e)
    }

    const wheelOpt = supportsPassive ? { passive: false } : false
    const wheelEvent =
      'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'

    function disableScroll() {
      window.addEventListener('DOMMouseScroll', preventDefault, false) // older FF
      window.addEventListener(wheelEvent, preventDefault, wheelOpt) // modern desktop
      window.addEventListener('touchmove', preventDefault, wheelOpt) // mobile
      window.addEventListener('keydown', preventDefaultForScrollKeys, false)
    }

    function enableScroll() {
      window.removeEventListener('DOMMouseScroll', preventDefault, false)
      window.removeEventListener(wheelEvent, preventDefault, wheelOpt)
      window.removeEventListener('touchmove', preventDefault, wheelOpt)
      window.removeEventListener('keydown', preventDefaultForScrollKeys, false)
    }

    disableScroll()

    return enableScroll
  }, [disable])
}
