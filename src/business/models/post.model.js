import { perf, reactive, effect, deepCopy } from 'Libs/mobius-js.js'

const runtime = {
  posts: []
}

const runtimeProxy = reactive(runtime)

const changePosts = changes => {
  console.log(`[${perf.now}][PostModel] changePosts: runtimePosts changes received...`, changes)
  runtimeProxy.posts = [...runtime.posts, ...changes]
}

const onPostsChange = handler => {
  console.log(`[${perf.now}][PostModel] onPostsChange: onPostsChange registered (runtimePosts mutation will be executed once)...`)
  effect(() => {
    console.log(`[${perf.now}][PostModel] onPostsChange: runtimePosts mutation executed...`, runtimeProxy)
    handler(deepCopy(runtimeProxy.posts))
  })
}

export { changePosts, onPostsChange }
