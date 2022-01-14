import request from 'utils/request'

type ID = number
type DateTimeString = string

export type Member = {
  id: ID
  created_at: DateTimeString
  updated_at: DateTimeString
  name: string
  qq_num: number
  avatar_src: string
  avatar_thumb: string
}

type PhotoCommon = {
  id: ID
  gallery_id: ID
  created_at: DateTimeString
  updated_at: DateTimeString
  index: number

  vote_count: number
  desc: string

  is_voted: boolean

  height: number
  width: number
  src: string
  thumb: string
}
export type PhotoNormal = PhotoCommon & {
  member: Member
  member_id: ID
}
export type PhotoInActive = PhotoCommon & {
  member: null
  member_id: null
}
export type Photo = PhotoNormal | PhotoInActive

type GalleryCommon = {
  id: ID
  created_at: DateTimeString
  index: number
  name: string

  vote_expire: DateTimeString
  vote_limit: number
  vote_submitted: boolean
}
export type GalleryNormal = GalleryCommon & {
  photos: PhotoNormal[]
  is_expired: true
}
export type GalleryInActive = GalleryCommon & {
  photos: PhotoInActive[]
  is_expired: false
}
export type Gallery = GalleryInActive | GalleryNormal

export type fetchListResult = {
  active: GalleryInActive | null
  galleries: GalleryNormal[]
}
export const fetchList = () => request<fetchListResult>({
  method: 'GET',
  url: 'photo/'
})

export type fetchListWithQQNumResult = {
  active: GalleryInActive | null
  galleries: GalleryNormal[]
}
export const fetchListWithQQNum = (qq_num: number) => request<fetchListWithQQNumResult>({
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
  qq_num: number
}) => request({
  method: 'POST',
  url: 'member/vote',
  data: {
    gallery_id,
    photo_id_list,
    qq_num
  }
})
