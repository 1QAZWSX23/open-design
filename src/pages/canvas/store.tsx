import {Rect} from "./type";

type Store = {
  rectList: Rect[]
  images: Map<any, any>
}

export const store: Store = {
  rectList: [],
  images: new Map()
}

export function pushRect(val: Rect) {
  store.rectList.push(val)
}

export function pushImg(id: any, val: Rect) {
  store.images.set(id, val)
}
