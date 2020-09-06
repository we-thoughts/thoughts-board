import { makeBaseRepository } from 'MobiusJS'
import { getPosts, createPost } from '../../data/post.data.js'

export const [postsIn$, postsOut$] = makeBaseRepository(getPosts).array
export const [createPostIn$, createPostOut$] = makeBaseRepository(createPost).array
