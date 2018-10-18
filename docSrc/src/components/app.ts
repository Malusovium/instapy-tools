import xs, { Stream } from 'xstream'
import { div
       , VNode
       , DOMSource 
       } from '@cycle/dom'
import { StateSource } from 'cycle-onionify'
import isolate from '@cycle/isolate'

import { BaseSources, BaseSinks } from '../interfaces'

import { map, values, compose } from 'rambda'

// Typestyle setup

import { style } from 'typestyle'
import * as csstips from 'csstips'
import { setupPage, normalize } from 'csstips'
normalize()
setupPage('#app')

import { api
       , MethodComponentType
       , ArgComponentType
       } from '../../../src'

import { compIsolate } from './../utils/comp-isolate'

import { Method } from './method-old-old'
import { Arg } from './arg'

import { method } from './method'

export interface Sources extends BaseSources {
  onion: StateSource<State>
}
export interface Sinks extends BaseSinks {
  onion: Stream<Reducer | {}>
}

// State
export interface State {
  count: number
}
export const defaultState: State = {
  count: 5
};
export type Reducer = (prev: State) => State;

const { raw, setupInterface, setupArgComponent } = api

import { component } from './../template'

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
const methodLens =
  (name: string) => (
    { get: (state) => state[name]
    , set: (state, childState) => (
        { ...state
        , [name]: childState
        }
      )
    }
  )

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

const isolatedMethod =
  (args, methodName) =>
    isolate
    ( method(args)
    , methodName
    )

export const App =
  ({DOM, onion}: Sources): Sinks => {
    const interfaceApi =
      setupInterface
      ( raw
      , isolatedMethod
      , Arg({})
      )

    const setUserInteract =
      // interfaceApi['end']({DOM, onion})
      interfaceApi['unfollow_users']({DOM, onion})
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
          , [ setUserInteract.DOM ]
          )
      , onion:
          actions
          ( DOM
          , [ setUserInteract.onion ]
          )
      }
    )
  }

const actions =
  (DOM: DOMSource, components) => {
    const init$ =
      xs.of<Reducer>
         ( (prev) => prev ? prev : defaultState )

    return xs.merge
              ( init$
              , ...components
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
  ()

const styles =
  { wrapper: wrapperStyle
  , title: titleStyle
  , components: componentsStyle
  }

const view =
  (state$, components) =>
    xs.combine(state$, ...components)
      .map
       ( ([{ count }, ...components]) =>
         div
         ( `.${styles.wrapper}`
         , [ div(`.${styles.title}`, 'Instapy Tools GUI')
           , div(`.${styles.components}`, components)
           ]
         )
       )
