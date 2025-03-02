import React, {RefObject} from "react"
import './index.scss'
import BaseInput from "../../components/BaseInput"
import {Down, FullScreen, PreviewClose, Unlock,} from "@icon-park/react"
import BaseIcon from "../../components/BaseIcon"
import BaseButton from "../../components/BaseButton"
import FlipIcon from "../../assets/icon/FlipIcon"
import RotateIcon from "../../assets/icon/RotateIcon"
import AngleIcon from "../../assets/icon/AngleIcon"
import {withRouter} from "../../components/WithRouter"
import Fps from "../../components/Fps"
import {BaseOption, BaseSelect} from "../../components/BaseSelect2"
import {config, rects} from "./utils/constant"
import {EventTypes, IState, RectColorType, ShapeType} from "./utils/type"
import BaseSlotButton from "../../components/BaseSlotButton"
import Icon from '@icon-park/react/es/all'
import {message} from "antd"
import Left from "./components/Left/left"
import EventBus from "../../utils/event-bus"
import cx from "classnames"
import CanvasUtil2 from "./CanvasUtil2"
import {BaseConfig} from "./config/BaseConfig"


class Design extends React.Component<any, IState> {
  canvasRef: RefObject<HTMLCanvasElement> = React.createRef()
  // @ts-ignore
  body: HTMLElement = document.querySelector("body")

  state = {
    showPicker: false,
    rectColor: null,
    rectColorType: null,
    drawCount: 0,
    handScale: config.handScale,
    selectShape: undefined,
    selectDrawType: 'drawType',
    drawType: ShapeType.SELECT,
    drawType2: ShapeType.FRAME,
    drawType3: ShapeType.RECTANGLE,
    drawType4: ShapeType.PEN,
    drawType5: ShapeType.TEXT,
    drawType6: ShapeType.MOVE,
  } as IState

  componentDidMount() {
    // console.log('componentDidMount')
    this.init()
  }

  componentWillUnmount() {
    EventBus.offAll()
    // console.log('componentWillUnmount')
  }

  init() {
    EventBus.offAll()
    //这个绘制会刷新整个render...,从而获取到最新的selectShape，凑合着用吧
    EventBus.on(EventTypes.onDraw, () => {
      this.setState(s => {
        return {drawCount: s.drawCount + 1}
      })
    })
    EventBus.on([EventTypes.onMouseDown, EventTypes.onMouseMove, EventTypes.onMouseUp], (val: any) => {
      this.setState({selectShape: val})
    })
    EventBus.on([EventTypes.onWheel], (val: any) => {
      val && this.setState({handScale: val})
    })
    this.setState({drawCount: 0})
    let canvas: HTMLCanvasElement = this.canvasRef.current!
    const c = CanvasUtil2.getInstance(canvas)
    c.clear()
    c.addChildren(rects)
    c.render()
    this.setState({cu: c})
  }


  flip(type: number) {
    this.state.selectShape?.flip(type)
    this.setState({selectShape: this.state.selectShape})
    this.state.cu.render()
  }


  onContextMenu = (e: any) => {
    e.preventDefault()
    return false
  }

  copy = () => {
    console.log(this.state.cu.print())
    navigator.clipboard.writeText(JSON.stringify(this.state.cu.print(), null, 2))
      .then(() => {
        message.success('复制成功')
      })
  }

  copy2 = () => {
    console.log(this.state.cu.print2())
    navigator.clipboard.writeText(JSON.stringify(this.state.cu.print2(), null, 2))
      .then(() => {
        message.success('复制成功,带id')
      })

  }

  setCanvasUtilMode = (mode: ShapeType, key: any) => {
    // @ts-ignore
    this.setState({[key]: mode, selectDrawType: key})
    this.state.cu.setMode(mode)
  }

  inputOnChange = () => {
  }

  render() {
    // console.log('render')
    const {
      handScale,
      showPicker,
      drawType,
      drawType2,
      drawType3,
      drawType4,
      selectShape,
      selectDrawType
    } = this.state
    // console.log('selectRectConf', selectRectConf?.fontFamily)
    // @ts-ignore
    const selectRectConf: BaseConfig = selectShape?.conf
    return <>
      <div className={'design'}>
        <div className="header">
          <div className={'fps'}>
            FPS:<Fps/>
            总绘制次数：{this.state.drawCount}
          </div>
        </div>
        <div className="content">
          <Left
            init={() => this.init()}
            navigate={() => this.props.navigate('/test')}
            copy={this.copy}
            copy2={this.copy2}
          />
          <div className="canvas-wrapper">
            <div className="tool-bar">
              <div className="left">
                <div className={cx('tool select', selectDrawType === 'drawType' && 'active')}>
                  <BaseSelect
                    value={drawType}
                    selectRender={(e: any) => {
                      if (e.value === ShapeType.SELECT) return <Icon type={'MoveOne'}/>
                      if (e.value === ShapeType.SCALE) return <Icon type={'Scale'}/>
                    }}
                    onChange={(e: any) => this.setCanvasUtilMode(e, 'drawType')}>
                    <BaseOption key={1} value={ShapeType.SELECT} label={ShapeType.SELECT}>
                      <SelectItem name={'选择'} iconName={'MoveOne'} hotkey={'V'}/>
                    </BaseOption>
                    <BaseOption key={2} value={ShapeType.SCALE} label={ShapeType.SCALE}>
                      <SelectItem name={'等比缩放'} iconName={'Scale'} hotkey={'K'}/>
                    </BaseOption>
                  </BaseSelect>
                </div>
                <div className={cx('tool select', selectDrawType === 'drawType2' && 'active')}>
                  <BaseSelect
                    value={drawType2}
                    selectRender={(e: any) => {
                      if (e.value === ShapeType.FRAME) return <Icon type={'Pound'}/>
                      if (e.value === ShapeType.SLICE) return <Icon type={'StraightRazor'}/>
                    }}
                    onChange={(e: any) => this.setCanvasUtilMode(e, 'drawType2')}>
                    <BaseOption key={1} value={ShapeType.FRAME} label={ShapeType.FRAME}>
                      <SelectItem name={'窗器'} iconName={'Pound'} hotkey={'F'}/>
                    </BaseOption>
                    <BaseOption key={2} value={ShapeType.SLICE} label={ShapeType.SLICE}>
                      <SelectItem name={'切图'} iconName={'StraightRazor'} hotkey={'S'}/>
                    </BaseOption>
                  </BaseSelect>
                </div>
                <div className={cx('tool select', selectDrawType === 'drawType3' && 'active')}>
                  <BaseSelect
                    value={drawType3}
                    selectRender={(e: any) => {
                      if (e.value === ShapeType.RECTANGLE) return <Icon type={'RectangleOne'}/>
                      if (e.value === ShapeType.ELLIPSE) return <Icon type={'Round'}/>
                      if (e.value === ShapeType.ARROW) return <Icon type={'ArrowRightUp'}/>
                      if (e.value === ShapeType.LINE) return <Icon type={'Minus'}/>
                      if (e.value === ShapeType.POLYGON) return <Icon type={'Triangle'}/>
                      if (e.value === ShapeType.STAR) return <Icon type={'star'}/>
                      if (e.value === ShapeType.IMAGE) return <Icon type={'pic'}/>
                    }}
                    onChange={(e: any) => this.setCanvasUtilMode(e, 'drawType3')}>
                    <BaseOption key={1} value={ShapeType.RECTANGLE} label={ShapeType.RECTANGLE}>
                      <SelectItem name={'矩形'} iconName={'RectangleOne'} hotkey={'R'}/>
                    </BaseOption>
                    <BaseOption key={2} value={ShapeType.ELLIPSE} label={ShapeType.ELLIPSE}>
                      <SelectItem name={'圆'} iconName={'Round'} hotkey={'O'}/>
                    </BaseOption>
                    <BaseOption key={3} value={ShapeType.ARROW} label={ShapeType.ARROW}>
                      <SelectItem name={'箭头'} iconName={'ArrowRightUp'} hotkey={'Shift + L'}/>
                    </BaseOption>
                    <BaseOption key={4} value={ShapeType.LINE} label={ShapeType.LINE}>
                      <SelectItem name={'直线'} iconName={'Minus'} hotkey={'L'}/>
                    </BaseOption>
                    <BaseOption key={5} value={ShapeType.POLYGON} label={ShapeType.POLYGON}>
                      <SelectItem name={'多边形'} iconName={'Triangle'} hotkey={''}/>
                    </BaseOption>
                    <BaseOption key={6} value={ShapeType.STAR} label={ShapeType.STAR}>
                      <SelectItem name={'星形'} iconName={'star'} hotkey={''}/>
                    </BaseOption>
                    <BaseOption key={7} value={ShapeType.IMAGE} label={ShapeType.IMAGE}>
                      <SelectItem name={'图片'} iconName={'pic'} hotkey={'Shift Ctrl K'}/>
                    </BaseOption>
                  </BaseSelect>
                </div>
                <div className={cx('tool select', selectDrawType === 'drawType4' && 'active')}>
                  <BaseSelect
                    value={drawType4}
                    selectRender={(e: any) => {
                      if (e.value === ShapeType.PEN) return <Icon type={'pencil'}/>
                      if (e.value === ShapeType.PENCIL) return <Icon type={'ElectronicPen'}/>
                    }}
                    onChange={(e: any) => this.setCanvasUtilMode(e, 'drawType4')}>
                    <BaseOption key={1} value={ShapeType.PEN} label={ShapeType.PEN}>
                      <SelectItem name={'钢笔'} iconName={'pencil'} hotkey={'P'}/>
                    </BaseOption>
                    <BaseOption key={2} value={ShapeType.PENCIL} label={ShapeType.SLICE}>
                      <SelectItem name={'铅笔'} iconName={'ElectronicPen'} hotkey={'Shift P'}/>
                    </BaseOption>
                  </BaseSelect>
                </div>
                <div className={cx('tool', selectDrawType === 'drawType5' && 'active')}
                     onClick={() => this.setCanvasUtilMode(ShapeType.TEXT, 'drawType5')}>
                  <Icon type={'Text'} size="20"/>
                </div>
                <div className={cx('tool', selectDrawType === 'drawType6' && 'active')}
                     onClick={() => this.setCanvasUtilMode(ShapeType.MOVE, 'drawType6')}>
                  <Icon type={'FiveFive'} size="20"/>
                </div>
              </div>
              <div className="right">
                <div className="resize">
                  <span>{((handScale - 1) * 100).toFixed(0)}%</span>
                  <Down theme="outline" size="14" fill="#ffffff" className="arrow"/>
                </div>
              </div>
            </div>
            <div id="canvasArea">
              {/*为 canvas 增加键盘事件的时候，需要给 canvas 增加一个属性 tabinex = 0 , 不然 绑定无效。*/}
              <canvas
                onContextMenu={this.onContextMenu}
                // onDoubleClick={this.onDbClick}
                // onMouseMove={this.onMouseMoveWrapper}
                // onMouseDown={this.onMouseDown}
                // onMouseUp={this.onMouseUp}
                // onWheel={this.onWheel}
                id="canvas" ref={this.canvasRef}/>
            </div>
          </div>
          <div className="right">
            {/*<img src={require('../../assets/image/a.jpg')} alt=""/>*/}
            <div className="config-wrapper">
              {
                selectShape && (
                  <>
                    <div className="base-info">
                      <div className="row">
                        <div className="col">
                          <BaseInput value={selectRectConf?.x?.toFixed(2)} prefix={<span className={'gray'}>X</span>}/>
                        </div>
                        <div className="col">
                          <BaseInput value={selectRectConf?.y?.toFixed(2)} prefix={<span className={'gray'}>Y</span>}/>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <BaseInput value={selectRectConf?.w?.toFixed(2)} prefix={<span className={'gray'}>W</span>}/>
                        </div>
                        <div className="col">
                          <BaseInput value={selectRectConf?.h?.toFixed(2)} prefix={<span className={'gray'}>H</span>}/>
                        </div>
                        <div className="col">
                          <BaseIcon active={false}>
                            <Unlock theme="outline" size="16" fill="#929596"/>
                          </BaseIcon>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <BaseInput value={selectRectConf?.rotation} prefix={<RotateIcon style={{fontSize: "16rem"}}/>}/>
                        </div>
                        <div className="col">
                          <BaseButton active={selectRectConf?.flipHorizontal} onClick={() => this.flip(0)}>
                            <FlipIcon style={{fontSize: "16rem", 'transform': 'rotate(-90deg)'}}/>
                          </BaseButton>
                          <BaseButton active={selectRectConf?.flipVertical} onClick={() => this.flip(1)}>
                            <FlipIcon style={{fontSize: "16rem", 'transform': 'rotate(0deg)'}}/>
                          </BaseButton>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <BaseInput value={selectRectConf?.radius} prefix={<AngleIcon style={{fontSize: "16rem"}}/>}/>
                        </div>
                        <div className="col">
                          <BaseIcon active={false}>
                            <FullScreen theme="outline" size="16" fill="#929596"/>
                          </BaseIcon>
                        </div>
                      </div>
                    </div>
                    <div className="base-info" style={{lineBreak: 'anywhere'}}>
                      <div dangerouslySetInnerHTML={{__html: selectShape.getStatus()}}>
                      </div>
                    </div>
                    <div className="base-info">
                      <div className="header">填充</div>
                      <div className="row-single">
                        <div className="col">
                          <BaseSlotButton value={selectRectConf?.x?.toFixed(0)}
                                          prefix={
                                            <div className={'color-block'}
                                                 style={{background: selectRectConf.fillColor}}
                                                 onClick={() => this.setState({
                                                   showPicker: !showPicker,
                                                   rectColor: selectRectConf.fillColor,
                                                   rectColorType: RectColorType.FillColor
                                                 })}/>
                                          }
                            // suffix={<PreviewOpen fill="#929596"/>}
                                          suffix={<PreviewClose fill="#929596"/>}
                          >
                            <div className={'test'}>
                              <input type="text" value={selectRectConf?.fillColor} onChange={this.inputOnChange}/>
                              <input type="text"/>
                            </div>
                          </BaseSlotButton>
                        </div>

                        <div className="col">
                          <BaseIcon active={false}>
                            <Unlock theme="outline" size="16" fill="#929596"/>
                          </BaseIcon>
                        </div>
                      </div>
                    </div>
                    <div className="base-info">
                      <div className="header">描边</div>
                      <div className="row-single">
                        <div className="col">
                          <BaseSlotButton value={selectRectConf?.x?.toFixed(0)}
                                          prefix={
                                            <div className={'color-block'}
                                                 style={{background: selectRectConf.borderColor}}
                                                 onClick={() => this.setState({
                                                   showPicker: !showPicker,
                                                   rectColor: selectRectConf.borderColor,
                                                   rectColorType: RectColorType.BorderColor
                                                 })}/>
                                          }
                            // suffix={<PreviewOpen fill="#929596"/>}
                                          suffix={<PreviewClose fill="#929596"/>}
                          >
                            <div className={'test'}>
                              <input type="text" value={selectRectConf?.borderColor} onChange={this.inputOnChange}/>
                              <input type="text"/>
                            </div>
                          </BaseSlotButton>
                        </div>

                        <div className="col">
                          <BaseIcon active={false}>
                            <Unlock theme="outline" size="16" fill="#929596"/>
                          </BaseIcon>
                        </div>
                      </div>
                    </div>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  }
}

function SelectItem(props: any) {
  const {name = '', hotkey = '', icon = null, iconName = ''} = props
  return (
    <div className="tool-option">
      <div className="left">
        {icon ? icon : <Icon type={iconName}/>}
        <span className="name">{name}</span>
      </div>
      <span className="hotkey">{hotkey}</span>
    </div>
  )
}

export default withRouter(Design)