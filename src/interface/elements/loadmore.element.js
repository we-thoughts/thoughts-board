import { div } from '@cycle/dom'
import { hardDeepMerge } from 'MobiusJS'

const TEXT = {
  normal: '点击加载更多',
  loading: '正在加载...',
  nomore: '没有更多了'
}
const baseClass = '.js_mobius-loadmore.mobius-text--center.mobius-width--full.mobius-padding-y--base.mobius-border--all.mobius-rounded--small.mobius-text--bold.mobius-text--primary'

const makeLoadmoreE = ({
  unique, selector = '', props = {}, children = undefined, text = undefined, config = {}
}) => {
  let { status = 'normal' } = config
  status = status || 'normal'
  return div(
    `${selector}${baseClass}`,
    hardDeepMerge(props, { dataset: { unique } }),
    TEXT[status]
  )
}

export { makeLoadmoreE }
