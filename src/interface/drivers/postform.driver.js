import {
  makeBaseDriver, toastDriverManager,
  notEmptyV, isPhoneNumV,
  initFormConfig, withInitializer, validateItem,
  makeValidityObservables, extractValues
} from 'MobiusUI'
import {
  mpAuthObservables,
  hasOwnProperty, isTruthy,
  equiped,
  makeBaseRepository, dredge, ofType, withResponseFilter
} from 'MobiusJS'
import {
  Subject, of, startWith, shareReplay, switchMap, filter, map,
  mapTo, scan, withLatestFrom, take, partition
} from 'Libs/rx.js'
import { REQUEST_TYPES, postsObservers, postsObservables } from 'Business/services/post.service.js'

const postformConfig = {
  tags: {
    name: 'tags',
    field: '类别',
    type: 'select',
    placeholder: '点击选择发布信息的类别...',
    list: [
      { text: '招聘', value: 'hire' },
      { text: '求职', value: 'job_seeking' },
      { text: '出售', value: 'sale' },
      { text: '出租', value: 'rent' },
      { text: '求购', value: 'buying' },
      { text: '拼车', value: 'carpool' },
      { text: '顺风车', value: 'hitchhike' },
      { text: '广告', value: 'ad' },
      { text: '交友', value: 'pal' },
      { text: '打听', value: 'ask_about' },
      { text: '求助', value: 'help_seeking' },
      { text: '其它', value: 'others' }
    ],
    value: '',
    isModified: false,
    validators: [[notEmptyV, { type: 'success', message: '已填写' }, { type: 'error', message: '必须选择类别' }]],
    validity: {
      isValid: false,
      details: []
    }
  },
  title: {
    name: 'title',
    field: '标题',
    type: 'input',
    placeholder: '点击填写信息标题...',
    value: '',
    isModified: false,
    validators: [
      [notEmptyV, { type: 'success', message: '已填写' }, { type: 'error', message: '标题不能为空' }]
    ],
    validity: {
      isValid: false,
      details: []
    }
  },
  detail: {
    name: 'detail',
    field: '内容',
    type: 'textarea',
    placeholder: '点击填写详细的信息内容...',
    value: '',
    isModified: false,
    validators: [
      [notEmptyV, { type: 'success', message: '已填写' }, { type: 'error', message: '内容不能为空' }]
    ],
    validity: {
      isValid: false,
      details: []
    }
  },
  tel: {
    name: 'tel',
    field: '手机',
    type: 'input',
    placeholder: '点击填写手机号...',
    inputType: 'tel',
    value: '',
    isModified: false,
    validators: [
      [notEmptyV],
      [isPhoneNumV, { type: 'success', message: '手机号格式正确' }, { type: 'error', message: '请输入正确的手机号' }]
    ],
    validity: {
      isValid: false,
      details: []
    }
  }
}

/*********************************************************
 *                        表单运行时
 *********************************************************/
const [
  postformIn$,
  postformOut$,
  _postformOutMid$
] = makeBaseRepository(([name, value]) => ({ [name]: { value } })).array
const postformReset$ = {
  next: config => {
    _postformOutMid$.next(config)
  },
  error: () => {},
  complete: () => {}
}
const postformOutShare$ = postformOut$.pipe(
  startWith({}),
  scan((acc, cur) => {
    Object.entries(cur).forEach(([name, incomeConfig]) => {
      const formItemConfig = acc[name]
      formItemConfig.value = incomeConfig.value
      formItemConfig.isModified = hasOwnProperty('isModified', incomeConfig) ? incomeConfig.isModified : true
      formItemConfig.validity = validateItem(formItemConfig, incomeConfig)
    })
    return acc
  }, initFormConfig(postformConfig, withInitializer('initialValue'))),
  shareReplay(1)
)

const makePostformDriver = makeBaseDriver(
  () => postformIn$,
  () => postformOutShare$
)

/*********************************************************
 *                        表单有效性
 *********************************************************/

const {
  raw: postformDataValidity$,
  share: postformDataValidityShare$,
  once: postformDataValidityOnce$,
  valid: postformDataValid$,
  invalid: postformDataInvalid$
} = makeValidityObservables(postformOutShare$)

/*********************************************************
 *                        表单值
 *********************************************************/

// NOTE: 下游作源取上游
const postformData$ = postformDataValid$.pipe(
  // 只有在所有表单项都拥有有效值的时候才输出表单数据
  switchMap(() => postformOutShare$.pipe(take(1))),
  map(extractValues)
)
const postformDataShare$ = postformData$.pipe(shareReplay(1))
postformDataShare$.subscribe(data => { console.warn(data) })

/*********************************************************
 *                        表单提交
 *********************************************************/

const postSubmittalIn$ = new Subject()
// TODO: 未完成填写之前提交进行提示
const submittal$ = postSubmittalIn$.pipe(
  // 点击提交按钮之后检查数据有效性
  switchMap(() => postformDataValidityOnce$),
  filter(isTruthy),
  // 若有效，拼接请求参数并发送请求
  switchMap(() => mpAuthObservables.type('auth_state').select('openid').pipe(take(1))),
  withLatestFrom(postformDataShare$),
  map(([openid, postformData]) => {
    console.warn(openid, postformData)
    return { openid, ...postformData, tags: [postformData.tags] }
  })
)
const [validSubmittal$, invalidSubmittal$] = submittal$.pipe(partition(post => !!post.openid))

const appToastDriverManager = toastDriverManager.scope('app')
invalidSubmittal$
  .pipe(mapTo({ isShow: true, hideOnClick: true, duration: 3000, title: '🤗 请刷新页面允许获取信息后重新尝试发布！' }))
  .subscribe(ofType('main', appToastDriverManager.observers))
// 发送有效请求并拉起加载遮罩
validSubmittal$.subscribe(ofType(REQUEST_TYPES.createPost, postsObservers))
validSubmittal$
  .pipe(mapTo({ isShow: true, type: 'loading', title: '🚀 正在发布...' }))
  .subscribe(ofType('main', appToastDriverManager.observers))
// 请求成功之后隐藏遮罩
dredge(postsObservables, equiped(
  ofType(REQUEST_TYPES.createPost),
  withResponseFilter('success')
))
  .pipe(mapTo({ isShow: false }))
  .subscribe(ofType('main', appToastDriverManager.observers))
// 请求成功之后重置表单
dredge(postsObservables, equiped(
  ofType(REQUEST_TYPES.createPost),
  withResponseFilter('success')
))
  .pipe(mapTo(postformConfig))
  .subscribe(postformReset$)
// 请求失败之后报错
dredge(postsObservables, equiped(
  ofType(REQUEST_TYPES.createPost),
  withResponseFilter('error')
))
  .pipe(mapTo({ isShow: true, type: 'error', hideOnClick: true, duration: 2000, title: '发布失败请重试...' }))
  .subscribe(ofType('main', appToastDriverManager.observers))
dredge(postsObservables, equiped(
  ofType(REQUEST_TYPES.createPost),
  withResponseFilter('fail')
))
  .pipe(map(res => {
    return { isShow: true, type: 'error', hideOnClick: true, duration: 2000, title: res.status_message }
  }))
  .subscribe(ofType('main', appToastDriverManager.observers))
// 请求成功之后短暂提示
dredge(postsObservables, equiped(
  ofType(REQUEST_TYPES.createPost),
  withResponseFilter('success')
))
  .pipe(mapTo({ isShow: true, type: 'success', hideOnClick: true, duration: 2000, title: '发布成功 👌' }))
  .subscribe(ofType('main', appToastDriverManager.observers))

const makePostformBtnDriver = makeBaseDriver(
  () => postSubmittalIn$,
  () => of({}) // 提交按钮总是可用
)

export { makePostformDriver, makePostformBtnDriver }
