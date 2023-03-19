import { CommonValueProps } from "../types"

type ArrayComponentProps =  CommonValueProps & {
  node: jsonToAst.ArrayNode
}
export function ArrayComponent(props: ArrayComponentProps){
  return <></>
}