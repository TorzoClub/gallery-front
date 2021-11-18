import vait from 'vait'
import loadImage from './load-image'

class LoadQuery {
  constructor() {
    this.query = []
    this.pool = {}
    this.currentTask = null
  }

  async execQuery() {
    if (this.currentTask) {
      return 
    }
    if (!this.query.length) {
      return
    }

    const [srcKey, ...query] = this.query
    this.query = query

    try {
      const task = this.pool[srcKey]
      const blob = await loadImage(srcKey)

      const src = URL.createObjectURL(blob)

      task.pass(src)

      return task
    } finally {
      this.currentTask = null
      return this.execQuery()
    }
  }

  addQuery(srcKey) {
    if (this.pool[srcKey]) {
      // duplicate srcKey in pool
      return this.pool[srcKey]
    }

    if (this.query.indexOf(srcKey) !== -1) {
      // duplicate srcKey in query
      return 
    }

    this.pool[srcKey] = vait()
    this.query.push(srcKey)
    this.execQuery()
  }

  load(srcKey) {
    const task = this.pool[srcKey]
    if (!task) {
      this.addQuery(srcKey)
    }
    
    return this.pool[srcKey]
  }
}

const loadQuery = new LoadQuery()

export default (srcKey) => loadQuery.load(srcKey)
