import React, { CSSProperties, useMemo } from 'react'

import './index.scss'

import PhotoBox, { CoverClickEvent } from 'components/PhotoBox'
import globalLoad from 'utils/queue-load'
import { Gallery, Photo } from 'api/photo'
import { PhotoStreamState } from 'components/Gallery'

import PhotoBoxStyle from '../PhotoBox/index.scss'

const SAME_HEIGHT = 100

type ColumnsHeightList = number[]

const witchHeightIsMinimum = (columns: ColumnsHeightList) =>
  columns.indexOf(Math.min(...columns))

const computeColumnHeight = (column: Photo[]) =>
  column
    .map(photo => {
      return SAME_HEIGHT * (photo.height / photo.width)
    })
    .reduce((a, b) => a + b, 0)

const createColumns = (column_count: number, photos: Photo[]) => {
  const columns: Photo[][] = Array.from(Array(column_count)).map(() => [])

  photos.forEach(photo => {
    if (photo.member) globalLoad(photo.member.avatar_thumb)
    globalLoad(photo.thumb)

    const columnsHeightList: ColumnsHeightList = columns.map(computeColumnHeight)

    const min_height_index = witchHeightIsMinimum(columnsHeightList)
    columns[min_height_index].push(photo)
  })

  return columns
}

export type Props = {
  hideVoteButton: boolean
  gallery: Gallery
  screen: PhotoStreamState['screen']
  gutter: PhotoStreamState['column_gutter']
  column_count: PhotoStreamState['column_count']
  total_width: PhotoStreamState['gallery_width']

  photos: Photo[]
  onClickVote(photo_id: Photo['id']): void
  onClickCover(clickInfo: CoverClickEvent, photo: Photo['id']): void

  selectedIdList: number[]
}
export default (props: Props) => {
  const {
    hideVoteButton,
    gallery,
    screen,
    column_count,
    photos,
    total_width,
    gutter = '0px',
    selectedIdList
  } = props

  const columns = useMemo(() => {
    return createColumns(column_count, photos)
  }, [column_count, photos])

  const isMobile = screen === 'mobile'

  let photoStreamListWidth: CSSProperties['width']
  if (isMobile) {
    photoStreamListWidth = `calc(100vw - ${gutter} * ${column_count} + (${gutter} / 2))`
  } else {
    photoStreamListWidth = `calc(${total_width} + ${gutter} * ${column_count - 1})`
  }

  let boxWidth: string
  if (isMobile) {
    boxWidth = `(${total_width} / ${column_count} - ${gutter})`
  } else {
    boxWidth = `(${total_width} / ${column_count})`
  }

  const HorizontalOffset: CSSProperties['width'] = useMemo(() => {
    if (screen === 'normal') {
      return `calc(${PhotoBoxStyle['avatar-size']} / 2)`
    } else {
      return '0px'
    }
  }, [screen])

  return (
    <div
      className={`photo-stream ${screen}`}
      style={{
        width: photoStreamListWidth,
        paddingRight: HorizontalOffset,
      }}
    >
      {
        columns.map((column, key) => (
          <div
            className="steam-column"
            key={String(key)}
            style={{
              width: `calc(${boxWidth})`
              // marginLeft: key ? '' : gutter,
              // marginRight: gutter,
              // paddingLeft: key ? '' : gutter,
              // paddingRight: gutter
            }}
          >
            {
              column.map(photo => (
                <PhotoBox
                  key={photo.id.toString()}

                  screen={screen}
                  gutter={gutter}
                  boxWidth={boxWidth}

                  hideVoteButton={hideVoteButton || gallery.is_expired}
                  hideMember={!photo.member}
                  voteIsHighlight={selectedIdList && (selectedIdList.indexOf(photo.id) !== -1)}

                  name={photo.member ? photo.member.name : null}
                  photo={{
                    width: photo.width,
                    height: photo.height,
                    src_thumb: photo.thumb,
                    src: photo.src,
                  }}
                  avatar={photo.member ? {
                    width: 0,
                    height: 0,
                    src_thumb: photo.member.avatar_thumb,
                    src: photo.member.avatar_src,
                  } : null}

                  handleClickVote={() => {
                    props.onClickVote(photo.id)
                  }}
                  onClickCover={(fromInfo) => {
                    props.onClickCover(fromInfo, photo.id)
                  }}
                />
              ))
            }
          </div>
        ))
      }
    </div>
  )
}
