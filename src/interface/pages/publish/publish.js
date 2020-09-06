
import { map } from 'Libs/rx.js'
import {
  makeContainerE,
  equiped, withFullPct, withYScroll, withScrollbarHidden
} from 'MobiusUI'
import { Postform } from './postform.js'

const publishPage = source => {
  const postform = Postform(source).DOM

  return {
    DOM: postform.pipe(
      map((form) => {
        return makeContainerE(equiped(withFullPct, withYScroll, withScrollbarHidden)({
          selector: '.mobius-padding--base',
          children: [form]
        }))
      })
    )
  }
}

export { publishPage }
