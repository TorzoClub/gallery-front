import request from 'utils/request'

export const confirmQQNum = (qq_num) =>
  request.get(`member/confirm/${qq_num}`).then(res => res.value)
