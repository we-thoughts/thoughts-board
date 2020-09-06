import { perf, biu, equiped, withDataExtracted } from 'MobiusJS'
import { REQUEST_TYPES } from '../const/post.const.js'

const getPosts = async ({ timeRange, num }) => {
  const url = 'https://api.thoughtsdaily.cn/board_post/'
  const type = REQUEST_TYPES.getPosts
  console.log(`[${perf.now}][PostData] getPosts: send a getPosts request...`, { timeRange, num })
  return await biu(equiped(withDataExtracted), {
    url: url,
    method: 'POST',
    data: {
      action: 'get',
      payload: {
        type,
        timeRange,
        num
      }
    }
  })
    .then(data => {
      console.log(`[${perf.now}][PostData] getPosts: getPosts request receives...`, data)
      return data
    })
}

const createPost = async (post) => {
  const url = 'https://api.thoughtsdaily.cn/board_post/'
  const type = REQUEST_TYPES.createPost
  console.log(`[${perf.now}][PostData] createPost: send a createPost request...`, post)
  return await biu(equiped(withDataExtracted), {
    url: url,
    method: 'POST',
    data: {
      action: 'set',
      payload: {
        type,
        ...post
      }
    }
  })
    .then(data => {
      console.log(`[${perf.now}][PostData] createPost: createPost request receives...`, data)
      return data
    })
}

export { getPosts, createPost }
