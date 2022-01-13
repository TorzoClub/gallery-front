import request from 'utils/request'

export const fetchList = () => request({
  method: 'GET',
  url: 'photo/'
})

export const fetchListWithQQNum = (qq_num: string) => request({
  method: 'POST',
  url: 'member/photo',
  data: { qq_num }
})

export const vote = ({
  gallery_id,
  photo_id_list,
  qq_num
}: {
  gallery_id: number
  photo_id_list: number[]
  qq_num: string
}) => request({
  method: 'POST',
  url: 'member/vote',
  data: {
    gallery_id,
    photo_id_list,
    qq_num
  }
})
