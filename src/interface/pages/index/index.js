import { map, combineLatest } from 'Libs/rx.js'
import {
  equiped,
  withFullPct,
  makeContainerE,
  asFlexContainer, withPresetVertical,
  withNoWrap,
  withYScroll, withScrollbarHidden
} from 'MobiusUI'
import { REQUEST_TYPES, initPostService, postsObservables } from 'Business/services/post.service.js'
import { makeCardE } from 'Interface/elements/index.js'
import { makePostsLoadmoreP } from 'Interface/parts/index.js'
import { ofType } from 'MobiusJS'

const makeCardUse = data => data.map(item => makeCardE({
  unique: item._id,
  props: { key: item._id },
  config: { post: item }
}))

const indexPage = source => {
  initPostService()
  const postsLoadmoreP = makePostsLoadmoreP({ source })

  const vnode$ = combineLatest(ofType(REQUEST_TYPES.getPosts, postsObservables), postsLoadmoreP.DOM)
    .pipe(
      map(([posts, postsLoadmoreDOM]) => {
        return makeContainerE(
          equiped(asFlexContainer, withPresetVertical, withNoWrap, withFullPct, withYScroll, withScrollbarHidden)({
            selector: '.mobius-padding--base',
            children: [
              ...makeCardUse(posts),
              postsLoadmoreDOM
            ]
          }))
      })
    )
  return {
    DOM: vnode$
  }
}

export { indexPage }
