import { GET_POSTS_LIMIT, REQUEST_TYPES } from '../const/post.const.js'
import { postsObservers, postsObservables } from '../drivers/post.driver.js'
import { ofType } from 'MobiusJS'

const initPostService = () => {
  ofType(REQUEST_TYPES.getPosts, postsObservers).next({
    timeRange: [+new Date(), null],
    num: GET_POSTS_LIMIT
  })
}

export {
  REQUEST_TYPES,
  postsObservers, postsObservables,
  initPostService
}
