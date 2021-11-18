const QQ_NUM_KEY = 'TORZO_GALLERY_QQ_NUM'

export const validQQNum = qq_num => Number.isInteger(qq_num) && (qq_num > 0)

export const getMyQQNum = () => {
  try {
    const qq_num = JSON.parse(localStorage[QQ_NUM_KEY])

    return qq_num
  } catch (err) {
    return 0
  }
}

export const clearMyQQNum = () => {
  delete localStorage[QQ_NUM_KEY]
}

export const setMyQQNum = qq_num => {
  if (validQQNum(qq_num)) {
    localStorage[QQ_NUM_KEY] = JSON.stringify(qq_num)
    return getMyQQNum()
  } else {
    throw TypeError('qq_num 格式错误')
  }
}
