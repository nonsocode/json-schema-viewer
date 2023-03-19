import { CommonValueProps } from "../types"
import classnames from 'classnames/bind'
import style from './object.module.css'
const cx = classnames.bind(style)

type ObjectComponentProps = CommonValueProps & {
  node: jsonToAst.ObjectNode
}
export function ObjectComponent(props: ObjectComponentProps){

  return <span className={cx('object')}>Object</span>
}