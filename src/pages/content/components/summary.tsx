import { SummaryProps } from "@src/types";
import classnames from "classnames/bind";
import style from "./summary.module.css";
const cx = classnames.bind(style);
export function Summary({content}: SummaryProps) {
  return <span className={cx("summary")} style={{'--content': `"// ${content}"`}}></span>;
}
