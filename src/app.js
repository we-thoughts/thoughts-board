import { indexPage } from 'Interface/pages/index/index.js'
import { publishPage } from 'Interface/pages/publish/publish.js'
import { mePage } from 'Interface/pages/me/me.js'
import {
  makeMiddleRowAdaptiveLayoutE, makeLayerLayoutE,
  makeRouterP, makeBottomTabbarP, makeMaskP, makeToastP
} from 'MobiusUI'
import { map, combineLatest } from 'Libs/rx.js'

const app = source => {
  const routerP = makeRouterP({
    source,
    children: {
      index: indexPage(source),
      publish: publishPage(source),
      me: mePage(source)
    },
    config: {
      depth: 2,
      persistedPages: ['index', 'publish', 'me']
    }
  })
  const bottomTabbarP = makeBottomTabbarP({
    source,
    list: [
      { text: '发现', icon: 'board-discover', dataset: { path: '/board' } }, //  非 '/board/'
      { text: '发布', icon: 'board-publish', dataset: { path: '/board/publish' } },
      { text: '我的', icon: 'board-me', dataset: { path: '/board/me' } }
    ]
  })
  const maskP = makeMaskP({ source, scope: 'app' })
  const toastP = makeToastP({ source, scope: 'app' })

  return {
    DOM: combineLatest(routerP.DOM, bottomTabbarP.DOM, maskP.DOM, toastP.DOM).pipe(
      map(([router, tabbar, mask, toast]) => {
        return makeLayerLayoutE({
          children: [
            makeMiddleRowAdaptiveLayoutE({
              children: {
                middle: router,
                bottom: tabbar
              }
            }),
            mask,
            toast
          ],
          config: { stretchingChildren: true }
        })
      })
    )
  }
}

export { app }
