import { makeBaseDriver } from 'MobiusUI'
import { REQUEST_TYPES, postsObservers, postsObservables } from 'Business/services/post.service.js'
import { pairwise, startWith } from 'Libs/rx.js'
import { ofType } from 'MobiusJS'

const makeGetPostsDriver = makeBaseDriver(
  () => ofType(REQUEST_TYPES.getPosts, postsObservers),
  () => ofType(REQUEST_TYPES.getPosts, postsObservables).pipe(
    startWith([]),
    pairwise()
  )
)

export { makeGetPostsDriver }
