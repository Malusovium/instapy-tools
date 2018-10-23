import xs, { Stream } from 'xstream'
import { div
       , VNode
       , DOMSource 
       } from '@cycle/dom'
import { StateSource } from 'cycle-onionify'
import isolate from '@cycle/isolate'

import { BaseSources, BaseSinks } from '../interfaces'

import
  { map
  , filter
  , join
  , pick
  , path
  , values
  , compose
  , take // redact
  } from 'rambda'

import { style } from 'typestyle'
import * as csstips from 'csstips'
import { setupPage, normalize } from 'csstips'

import { api
       , MethodComponentType
       , ArgComponentType
       } from '../../../src'

import { Arg } from './arg'
import { method } from './method'

import { configOut } from './config-out'

export interface Sources extends BaseSources {
  onion: StateSource<State>
}
export interface Sinks extends BaseSinks {
  onion: Stream<Reducer | {}>
}

// State
export type State =
  { _methods: object
  , methods: object
  }

export const defaultState =
  { _methods: {}
  , methods: {}
  }

export type Reducer = (prev: State) => State;

normalize()
setupPage('#app')

const { raw, setupInterface, setupArgComponent } = api

const lY =
  (value: any) => {console.log(value); return value}

// const methodLens =
//   (methodName, args) => (
//     { get: (parentState) => (
//         { ...parentState[methodName]
//         , subComponents: lY(args)
//         , title: methodName
//         }
//       )
//     , set: (parentState, childState) => (
//         { ...parentState
//         , [methodName]: childState
//         }
//       )
//     }
//   )
// const methodLens =
//   (name: string) => (
//     { get: (state) => state[name]
//     , set: (state, childState) => (
//         { ...state
//         , [name]: childState
//         }
//       )
//     }
//   )

const tempComponent =
  ({DOM, onion}) => (
    { DOM: onion.state$.map( ({count}) => div(`The counter is at: ${count}`))
    , onion: xs.of((prev => prev ? prev : {count: 1}))
    }
  )

const tempMethodComponentList =
  [ isolate
    ( tempComponent
    , 'first'
    )
  , isolate
    ( tempComponent
    , 'second'
    )
  , isolate
    ( tempComponent
    , 'third'
    )
  ]

const methodLens =
  (methodName) => (
    { get: (parentState) => (
        { ...parentState._methods[methodName]
        , name: methodName
        }
      )
    , set: (parentState, childState) => (
        { ...parentState
        , _methods:
          { ...parentState._methods
          , [methodName]: childState
          }
        , methods:
          { ...parentState.methods
          , [methodName]: childState.value
          }
        }
      )
    }
  )

const isolatedMethod =
  (args, methodName) =>
    isolate
    ( method(args)
    , { onion: methodLens(methodName)
      , '*': methodName
      }
    )

const compList =
  (childComponents) =>
    ({DOM, onion}) => {
      const childComponentsSinks =
        compose
        ( map
          ( (component:any) => component({DOM, onion}) )
        , values
        )(childComponents)
      const childComponentsDOM =
        map(path('DOM'), childComponentsSinks)
      const childComponentsOnion =
        map(path('onion'), childComponentsSinks)

      return (
        { DOM: childComponentsDOM
        , onion: childComponentsOnion
        }
      )
    }

const toArray =
  (arr) => [...arr]

const filterIncludedMethods =
  (methods, _methods) => {
    const includedMethodNames =
      compose
      ( join(',')
      , values
      , map
        ( (_, methodName) => methodName )
      , filter
        ( ({ isIncluded }: any) => isIncluded )
      )(_methods)
    const includedMethods =
      pick
      ( includedMethodNames
      , methods
      )

    console.log(includedMethodNames)

    return includedMethods
  }

const configLens =
  (key: string) =>
    ( { get: (parentState) => (
          { ...parentState[key]
          , methods:
              filterIncludedMethods
              ( parentState.methods
              , parentState._methods
              )//parentState.methods

          }
        )
      , set: (parentState, childState) => (
          { ...parentState
          , [key]: childState
          }
        )
      }
    )

export const App =
  ({DOM, onion}: Sources): Sinks => {
    const interfaceApi =
      setupInterface
      ( raw
      , isolatedMethod
      , Arg({})
      )

    const methods =
      compList(interfaceApi)({DOM, onion})

    const config =
      isolate
      ( configOut
      , { onion: configLens('config')
        , '*': 'config'
        }
      )({DOM, onion})

    // const methods =
    //   { DOM: take<any>(3, methodsPre.DOM)
    //   , onion: take<any>(3, methodsPre.onion)
    //   }

    // const setUserInteract =
    //   interfaceApi['set_sleep_reduce']({DOM, onion})
      // interfaceApi['__init__']({DOM, onion})
      // interfaceApi['end']({DOM, onion})
      // interfaceApi['unfollow_users']({DOM, onion})
      // interfaceApi['interact_by_URL']({DOM, onion})
      // interfaceApi['set_user_interact']({DOM, onion})
      // interfaceApi['set_selenium_remote_session']({DOM, onion})

    // const template =
    //   isolate(component, 'template')({DOM, onion})

    return (
      { DOM:
          view
          ( onion.state$
              .debug('well?')
          , config.DOM
          , methods.DOM
          // , [ setUserInteract.DOM ]
          )
      , onion:
          actions
          ( DOM
          , methods.onion
          , config.onion
          // , [ setUserInteract.onion.debug('onion') ]
          )
      }
    )
  }

const actions =
  (DOM: DOMSource, methods, config) => {
    const init$ =
      xs.of<Reducer>
         ( (prev) => prev ? prev : defaultState )

    return xs.merge
              ( init$
              , ...methods
              , config
              )
  }

const wrapperStyle =
  style
  ( { fontSize: '1em'
    , padding: '2em'
    , borderRadius: '.4em'
    }
  , csstips.vertical
  )

const titleStyle =
  style
  ( { fontSize: '3em'
    }
  )

const componentsStyle =
  style
  ( csstips.horizontal
  )

const styles =
  { wrapper: wrapperStyle
  , title: titleStyle
  , body: componentsStyle
  , methodsWrapper:
      style
      ( { flex: 1
        }
      )
  , configWrapper:
      style
      ( { flex: 1
        }
      )
  }

const view =
  (state$, config, methods) =>
    xs.combine(state$, config, ...methods)
      .map
       ( ([{ count }, config, ...methods]) =>
         div
         ( `.${styles.wrapper}`
         , [ div(`.${styles.title}`, 'Instapy Tools GUI')
           , div
             ( `.${styles.body}`
             , [ div(`.${styles.methodsWrapper}`, methods)
               , div(`.${styles.configWrapper}`, config)
               ]
             )
           ]
         )
       )
