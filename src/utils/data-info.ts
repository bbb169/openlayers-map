export interface treeDot {
  areaid: string
  id: number
  imgurl: string[]
  isused: boolean
  type: string
  x: number
  y: number
  time: string
}

export interface roadLine {
  ORIG_FID: number
  areaid: number
  cardid: number
  dots: Array<{ x: number, y: number }>
  isused: boolean
  time: string
}
