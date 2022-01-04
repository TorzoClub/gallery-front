const randomNum = length => Math.floor(Math.random() * length)

export default shuffleArray
function shuffleArray(arr) {
  if (arr.length < 2) {
    return arr
  } else {
    return _shuffleArray(arr, 0)
  }
}

function _shuffleArray(arr, idx) {
  if (idx < arr.length) {
    return _shuffleArray(
      exchangePos(arr, idx, randomNum(arr.length)),
      idx + 1
    )
  } else {
    return arr
  }
}

function exchangePos(arr, idxA, idxB) {
  arr = [...arr]
  const tmp = arr[idxA]
  arr[idxA] = arr[idxB]
  arr[idxB] = tmp
  return arr
}
