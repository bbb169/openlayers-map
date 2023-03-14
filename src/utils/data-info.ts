export interface treeDot {
  areaid: string
  id: number
  imgurl: string[]
  isused: '正常' | '异常'
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
  isused: '已清洗' | '未清洗'
  time: string
}
