const createClassChain = chain => {
  const createClass = chain.shift()
  if (createClass) {
    return createClass(createClassChain(chain))
  } else {
    return class ChainReached {}
  }
}

const RootStore = createClassChain([
])

const store = new RootStore()

export default store
