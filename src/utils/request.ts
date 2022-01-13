import axios, { AxiosResponse } from 'axios'

const config = {
  baseURL: process.env.REACT_APP_API_PREFIX,
  timeout: 100000
}

const axiosInst = axios.create(config)

axiosInst.interceptors.request.use(
  config => config,

  err => {
    return Promise.reject(err)
  }
)

type Opts = Parameters<typeof axiosInst.request>[0]
export class RequestError extends Error {
  constructor(
    public message: string,
    public code: number,
    private opts: Opts,
    public isSilent: boolean = false,
    public description: string = ''
  ) {
    super(message)
  }

  public retry() {
    return request(this.opts)
  }
}

type b = AxiosResponse

type BackData = { isError: true, message: string } | Record<string, unknown>

export default request
async function request<Data extends BackData>(
  opts: Opts,
  apiRequestDescription: string = ''
) {
  const response = await axiosInst.request<Data>({
    ...opts,
  })

  const { data, status } = response
  if (status !== 200) {
    throw new RequestError(data.message as string, status, opts, false, apiRequestDescription)
  } else {
    return data
  }
}
