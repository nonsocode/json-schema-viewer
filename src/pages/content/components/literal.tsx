import { CommonValueProps } from "../types"

type LiteralComponentProps =  CommonValueProps & {
  node: jsonToAst.LiteralNode
}
export function LiteralComponent(props: LiteralComponentProps){
  return <></>
}