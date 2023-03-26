import classnames from "classnames/bind";
import style from "./elipsis.module.css";
const cx = classnames.bind(style);
export function Elipsis({ className }: { className?: string }) {
  return <span class={cx("elipsis", className)}></span>;
}
