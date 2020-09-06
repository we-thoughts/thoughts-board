
import { of, map } from 'Libs/rx.js'
import {
  makeContainerE,
  equiped,
  withPresetVertical, withJustifyBetween,
  withFullPct, withYScroll, withScrollbarHidden
} from 'MobiusUI'
import { a } from 'Libs/dom.js'

const mePage = source => {
  return {
    DOM: of(0).pipe(
      map(() => {
        return makeContainerE(equiped(
          withPresetVertical, withJustifyBetween, withFullPct, withYScroll, withScrollbarHidden
        )({
          selector: '.mobius-padding--base',
          children: [
            a(
              '.mobius-text--center.mobius-margin-bottom--small.mobius-padding--small.mobius-border--all.mobius-rounded--small.mobius-text--bold.mobius-text--primary',
              { props: { href: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIyODcyNjQ4NA==#wechat_redirect' } },
              '👉 点击关注公众号，随时获取本地通信息查询服务 👈'
            ),
            a(
              '.mobius-text--center.mobius-text--xs.mobius-margin-y--large',
              { props: { href: 'http://beian.miit.gov.cn/', target: '_blank' } },
              '粤ICP备19147948号-1'
            )
          ]
        }))
      })
    )
  }
}

export { mePage }
