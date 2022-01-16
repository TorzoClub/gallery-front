const randomNum = (length: number) => Math.floor(Math.random() * length)

export default shuffleArray
function shuffleArray<T>(arr: T[]): T[] {
  if (arr.length < 2) {
    return arr
  } else {
    return _shuffleArray(arr, 0)
  }
}

function _shuffleArray<T>(arr: T[], idx: number) {
  if (idx < arr.length) {
    return _shuffleArray(
      exchangePos(arr, idx, randomNum(arr.length)),
      idx + 1
    )
  } else {
    return arr
  }
}

function exchangePos<T>(arr: T[], idxA: number, idxB: number) {
  arr = [...arr]
  const tmp = arr[idxA]
  arr[idxA] = arr[idxB]
  arr[idxB] = tmp
  return arr
}
