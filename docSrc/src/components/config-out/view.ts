// view
import { Stream } from 'xstream'
import { div
       , h2
       , pre
       } from '@cycle/dom'
import { State } from './types'
import * as styles from './styles'
import
  { compose
  , ifElse
  , equals
  , map
  , join
  , values
  , Dictionary
  } from 'rambda'

// import { api } from 'instapy-tools'
import { api } from './../../../../src'

const { raw, setupMethod } = api

const pyMethod = setupMethod(raw)

const dom =
  ( { name
    , config
    }
  ) =>
    div
    ( `.${styles.container}`
    , [ h2(`.${styles.name}`, name)
      , pre(`.${styles.config}`, config)
      ]
    )

const lY =
  (prefix: any) =>
    (val:any) => {
      console.log(prefix)
      console.log(val)
      return val
    }

type methodsToConfig =
  (methods: {[index:string]: {} }) => string

const methodsToConfig =
  compose
  ( join('\n')
  , map<any, any>(pyMethod)
  , values
  , map<any, any>
    ( (args, methodName) => (
        { name: methodName
        , args: args
        }
      )
    )
  )

const toConfigReducer =
  (fromState:State) => (
    { ...fromState
    , config:
        ifElse
        ( equals({})
        , (_) => 'Please check a method'
        , methodsToConfig
        )(fromState.methods)
    }
  )

const view =
  (state$: Stream<State>) =>
    state$
      // .debug('config-state')
      .map(toConfigReducer)
      // .debug('post-state')
      .map(dom)

export
  { view
  }
