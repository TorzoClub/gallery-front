import request from 'utils/request'

export const fetchList = () =>
  request.get(`photo/`)

export const fetchListWithQQNum = qq_num =>
  request.post('member/photo', {
    qq_num
  })

export const vote = ({
  gallery_id,
  photo_id_list,
  qq_num
}) =>
  request.post('member/vote', {
    gallery_id,
    photo_id_list,
    qq_num
  })
