import axios from 'axios'
import store from 'store'

const config = {
  baseURL: process.env.REACT_APP_API_PREFIX,
  timeout: 100000
}

const request = axios.create(config)

request.interceptors.request.use(
  requestOption => {
    if (!requestOption.noToken) {
      const { token } = store
      if (token) {
        requestOption.headers['Authorization'] = `Bearer ${token}`
      }
    }

    return requestOption
  },

  err => {
    return Promise.reject(err)
  }
)

request.interceptors.response.use(
  response => {
    const { data, status } = response

    Object.defineProperties(data, {
      _response: {
        get() {
          return response
        }
      },

      _status: {
        get() {
          return status
        }
      }
    })

    if (status === 401) {
      // 或许是 token 过期
      Object.assign(store, {
        isLogin: false
        // token: null
      })

      throw Object.assign(
        Error('INVALID_TOKEN'),
        { SILENT: true }
      )
    }

    return data
  },

  axiosErr => {
    if (!axiosErr.response) {
      return Promise.reject(axiosErr)
    }

    const { response } = axiosErr
    const { data, status } = response

    const err = data.message ? Error(data.message) : Error(axiosErr.message)

    Object.assign(err, {
      data,
      response,
      status
    })

    return Promise.reject(err)
  }
)

export default request
