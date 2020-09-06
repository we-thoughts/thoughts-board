import {
  equiped,
  makeContainerE, asFlexContainer, withPresetVertical, withPresetHorizontal
} from 'MobiusUI'
import { humanize, allPass, hasOwnProperty } from 'MobiusJS'
import { div, a, span } from 'Libs/dom.js'

const baseClass = '.mobius-rounded--small.mobius-border--all.mobius-border--thin.mobius-margin-bottom--large.mobius-text--large.mobius-text--justify.mobius-font--sans'

const initCard = unique => {
  // const card = document.querySelector(`.js_${unique}`)
  const title = document.querySelector(`.js_${unique} ._title`)
  const detail = document.querySelector(`.js_${unique} ._detail`)
  const tags = document.querySelector(`.js_${unique} ._tags`)
  const toggle = () => {
    title.classList.toggle('mobius-text-break--truncate-1')
    detail.classList.toggle('mobius-text-break--truncate-3')
    tags.classList.toggle('mobius-display--none')
  }
  title.addEventListener('click', toggle)
  detail.addEventListener('click', toggle)
}

const makeTelLink = tel => {
  if (!tel) return ''
  return a('.mobius-width--100.mobius-padding--r-xs.mobius-text--center', { props: { href: `tel:${tel}` } }, '📱 点击联系')
}
const makeWechatLink = wechat => {
  if (!wechat) return ''
  return span('.mobius-width--100.mobius-padding--r-xs.mobius-text--center', '🤞 复制微信')
}

const isV0Post = hasOwnProperty('content')
const isV1Post = allPass([hasOwnProperty('detail'), hasOwnProperty('title'), hasOwnProperty('tags')])

const identifyPost = post => {
  if (isV0Post(post)) return 'v0'
  if (isV1Post(post)) return 'v1'
  return 'default'
}

export const makeCardE = ({
  unique, selector = '', props = {}, children = undefined, text = undefined, config = {}
} = {}) => {
  const { post } = config
  const cards = {
    v0: post => {
      const { content = '', tel, publish_time: time } = post
      return makeContainerE(equiped(asFlexContainer, withPresetVertical)({
        selector: `${unique ? '.js_' + unique : ''}${selector}${baseClass}`,
        props: { ...props },
        children: [
          div('.mobius-padding--base', `【${time === '刚刚' ? '' : ' '}${humanize(time)}】${content}`),
          makeContainerE(equiped(asFlexContainer, withPresetHorizontal)({
            children: [
              makeTelLink(tel)
            ]
          }))]
      }))
    },
    v1: post => {
      const { title = '', detail = '', tel, wechat, qq, tags, publish_time: time } = post
      return makeContainerE(equiped(
        asFlexContainer, withPresetVertical
      )({
        selector: `${unique ? '.js_' + unique : ''}${selector}${baseClass}`,
        props: {
          ...props,
          hook: { insert: () => { initCard(unique) } }
        },
        children: [
          div('._title.mobius-margin--r-base.mobius-text-break--truncate-1', [
            span('🟢 '),
            span('.mobius-text--bold', `${title}`)
          ]),
          div(
            '._detail.mobius-margin-x--r-base.mobius-margin-bottom--r-base.mobius-text-break--truncate-3',
            `${detail}`
          ),
          div(
            '._tags.mobius-margin-x--r-base.mobius-margin-bottom--r-base.mobius-text--xs.mobius-display--none',
            [
              span(`${humanize(time)}`)
            // ...tags.map(tag => span(tag))
            ]
          ),
          makeContainerE(equiped(asFlexContainer, withPresetHorizontal)({
            children: [
              makeWechatLink(wechat),
              makeTelLink(tel)
            ]
          }))
        ]
      }))
    },
    default: () => div()
  }
  return cards[identifyPost(post)](post)
}
