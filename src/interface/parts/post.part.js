import { GET_POSTS_LIMIT } from 'Business/const/post.const.js'
import { makeBasePart } from 'MobiusUI'
import { makeLoadmoreC } from '../components/index.js'
import { makeGetPostsDriver } from '../drivers/index.js'

const hasOlderPosts = (lastPosts, newPosts) => {
  let res
  const lastLen = lastPosts.length
  const newLen = newPosts.length
  if (lastLen === 0) {
    res = newLen > 0
  } else if (lastLen > 0) {
    res = newPosts[newLen - 1]._id !== lastPosts[lastLen - 1]._id
  }
  return res
}

const makePostsLoadmoreP = ({ source }) => {
  let oldestPublishTime = +new Date()
  return makeBasePart({
    name: 'posts-loadmore',
    source: source,
    componentMaker: ({ unique }) => {
      return makeLoadmoreC({
        unique: unique,
        componentToDriverMapper: e => {
          return {
            timeRange: [oldestPublishTime, null],
            num: GET_POSTS_LIMIT
          }
        },
        driver: makeGetPostsDriver(),
        driverToComponentMapper: ([lastPosts, newPosts]) => {
          const hasOlder = hasOlderPosts(lastPosts, newPosts)
          oldestPublishTime = hasOlder ? newPosts[newPosts.length - 1].publish_time : oldestPublishTime
          return {
            status: hasOlder ? 'normal' : 'nomore'
          }
        },
        config: {}
      })
    }
  })
}

export { makePostsLoadmoreP }
