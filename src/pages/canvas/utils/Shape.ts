import { clear, getPath, renderRoundRect } from "../utils";

export class Shape {
  config: any
  protected children: Shape[] = []
  protected isHover: boolean = false
  isSelect: boolean = false
  isCapture: boolean = true
  enter: boolean = false
  startX: number = 0
  startY: number = 0
  original: any = null
  lastClickTime: number = 0

  constructor(props: any) {
    this.config = getPath(props)
  }

  emit(event: any, p: any) {
    let { e, coordinate, type } = event
    // @ts-ignore
    this[type]?.(event, p)
  }
}