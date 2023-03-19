import classnames from 'classnames/bind'
import styles from './entry.module.css'
const cx = classnames.bind(styles)

export function Entry() {
  return <div className={cx('source')}>cheers</div>;
}