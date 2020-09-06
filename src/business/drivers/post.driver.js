import { Subject, debounceTime, shareReplay } from 'Libs/rx.js'
import { REQUEST_TYPES } from '../const/post.const.js'
import {
  postsIn$, postsOut$,
  createPostIn$, createPostOut$
} from '../domains/post/post.repository.js'
import { changePosts, onPostsChange } from '../models/post.model.js'
import { withResponseFilter } from 'MobiusJS'

/******************************************
 *                  Input
 ******************************************/

const observers = new Map([
  [REQUEST_TYPES.getPosts, postsIn$],
  [REQUEST_TYPES.createPost, createPostIn$]
])

/******************************************
 *                  Output
 ******************************************/

withResponseFilter('success', postsOut$).subscribe(res => {
  const posts = res.data
  changePosts(posts)
})

const postsOutShare$ = new Subject().pipe(
  debounceTime(250),
  shareReplay(1)
)
onPostsChange(posts => {
  postsOutShare$.next(posts)
})

const createPostOutShare$ = createPostOut$.pipe(shareReplay(1))

const observables = new Map([
  [REQUEST_TYPES.getPosts, postsOutShare$],
  [REQUEST_TYPES.createPost, createPostOutShare$]
])

export {
  observers as postsObservers,
  observables as postsObservables
}
