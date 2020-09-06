import { makeBaseComponent } from 'MobiusUI'
import { makeLoadmoreE } from '../elements/loadmore.element.js'
import { map, Subject, merge, tap } from 'Libs/rx.js'

const makeLoadmoreVNode = ({ unique, config: { status } }) => {
  return makeLoadmoreE({
    unique: unique,
    selector: `.js_${unique}`,
    config: {
      status
    }
  })
}

const makeLoadmoreC = ({ unique, componentToDriverMapper, driver, driverToComponentMapper, config }) => {
  const loading$ = new Subject()

  return makeBaseComponent({
    intent: source => {
      const click$ = source.DOM.select('.js_mobius-loadmore').events('click')
      return click$.pipe(
        tap(() => { loading$.next([{ status: 'loading' }]) }),
        map(componentToDriverMapper)
      )
    },
    model: intent$ => driver(intent$),
    view: model$ => {
      const temp$ = model$.pipe(
        map(([driverOutput]) => [driverToComponentMapper(driverOutput)]))
      return {
        DOM: merge(temp$, loading$).pipe(
          map(([loadmoreConfig]) => {
            return makeLoadmoreVNode({ unique, config: { ...config, ...loadmoreConfig } })
          })
        )
      }
    }
  })
}

export { makeLoadmoreC }
