import {
  makeContainerE,
  makeSelectC, makeInputC, makeTextareaC, makeButtonC,
  asCenterItem
} from 'MobiusUI'
import { makePostformDriver, makePostformBtnDriver } from 'Interface/drivers/postform.driver.js'
import { combineLatest, map } from 'Libs/rx.js'
import { randomString, prop } from 'MobiusJS'

const Postform = (source) => {
  const Tag = makeSelectC({
    unique: `select--${randomString(7)}`,
    children: null,
    componentToDriverMapper: e => [e.target.dataset.name, e.target.value],
    driver: makePostformDriver(),
    driverToComponentMapper: prop('tags'),
    config: {}
  })
  const Title = makeInputC({
    unique: `input--${randomString(7)}`,
    children: null,
    componentToDriverMapper: e => [e.target.dataset.name, e.target.value],
    driver: makePostformDriver(),
    driverToComponentMapper: prop('title'),
    config: {}
  })
  const Detail = makeTextareaC({
    unique: `textarea--${randomString(7)}`,
    children: null,
    componentToDriverMapper: e => [e.target.dataset.name, e.target.value],
    driver: makePostformDriver(),
    driverToComponentMapper: prop('detail'),
    config: {}
  })
  const Tel = makeInputC({
    unique: `input--${randomString(7)}`,
    children: null,
    componentToDriverMapper: e => [e.target.dataset.name, e.target.value],
    driver: makePostformDriver(),
    driverToComponentMapper: prop('tel'),
    config: {}
  })
  const Button = makeButtonC({
    unique: `button--${randomString(7)}`,
    children: null,
    // componentToDriverMapper: evt => {},
    driver: makePostformBtnDriver(),
    driverToComponentMapper: () => ({
      title: '提交发布'
    }),
    config: {}
  })

  return {
    DOM: combineLatest(
      Tag(source).DOM, Title(source).DOM, Detail(source).DOM, Tel(source).DOM, Button(source).DOM
    ).pipe(
      map(([tag, title, detail, tel, button]) => {
        return makeContainerE({
          selector: '.mobius-layout__vertical',
          children: [tag, title, detail, tel, asCenterItem(button)]
        })
      })
    )
  }
}

export { Postform }
