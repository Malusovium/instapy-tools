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
import { setupPage, normalize } from 'csstips'
normalize()
setupPage('#app')

import { api
       , MethodComponentType
       , ArgComponentType
       } from '../../../src'

import { Method } from './method'
import { Arg } from './inputs'

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

const argToDiv =
  (component:any, name:string) =>
    div(`This arg = ${name}`)

const baseMethodComponent: MethodComponentType =
  (args: {}) =>
    div
    ( [ 'Method_something'
      , ...compose
        ( values
        , map(argToDiv)
        )(args)
      ]
    )

// const simpleBaseArgComponent: ArgComponentType =
//   setupArgComponent
//   ( { _default: SimpleArgComponent
//     , none: SimpleArgComponent
//     , boolean: SimpleArgComponent
//     , string: SimpleArgComponent
//     , number: (_constrains) => SimpleArgComponent
//     , union: (_options) => SimpleArgComponent
//     , array: (_subType) => SimpleArgComponent
//     , tuple: (_subTypes) => SimpleArgComponent
//     }
//   )

// const baseArgComponent: ArgComponent =
//   setupArgComponent
//   ( { _default: (def, argName) => argName + '_default'
//     , none: (def, argName) => argName + 'none'
//     , boolean: (def, argName) => argName + 'boolean'
//     , string: (def, argName) => argName + 'string'
//     , number: (_constrains) => (def, argName) => argName + 'number'
//     , union: (_options) => (def, argName) => argName + 'union'
//     , array: (_subType) => (def, argName) => argName + 'array'
//     , tuple: (_subTypes) => (def, argName) => argName + 'tuple'
//     }
//   )

export const App =
  ({DOM, onion}: Sources): Sinks => {
    const interfaceApi =
      setupInterface
      ( raw
      , Method
      , Arg
      // , simpleBaseArgComponent
      )

    const testObj =
      { first: 'val1'
      , second: 'val2'
      , third: 'val3'
      }

    const setUserInteract =
      interfaceApi['set_user_interact']({DOM, onion})

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

const view =
  (state$, components) =>
    xs.combine(state$, ...components)
      .map
       ( ([{ count }, ...components]) =>
         div
         ( [ div('app' + count)
           , div(components)
           ]
         )
       )
