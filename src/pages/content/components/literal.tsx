import { CommonValueProps } from "../types"
import classnames from "classnames/bind";
import styles from "./literal.module.css";
const cx = classnames.bind(styles);

type LiteralComponentProps =  CommonValueProps & {
  node: jsonToAst.LiteralNode
}
export function LiteralComponent(props: LiteralComponentProps){
  return <span className={cx('string-value')}>{props.node.raw}</span>
}