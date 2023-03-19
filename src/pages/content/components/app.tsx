import { useMemo } from "react";
import jta from "json-to-ast";
import { Entry } from "./entry";
import classnames from 'classnames/bind'
import styles from './app.module.css'
const cx = classnames.bind(styles)
interface AppProps {
  jsonString: string;
}
export default function App({ jsonString }: AppProps) {
  const tree = useMemo(() => {
    console.time();
    const res = jta(jsonString, {
      loc: false,
    });
    console.timeEnd();
    return res;
  }, [jsonString]);

  return <div className={cx('json-view-app')}><Entry root={tree} value={tree} isLast /></div>;
}
