import request from 'utils/request'

export const confirmQQNum = (qq_num: string) => request<{ value: boolean }>({
  method: 'GET',
  url: `member/confirm/${qq_num}`
}).then(res => res.value)
