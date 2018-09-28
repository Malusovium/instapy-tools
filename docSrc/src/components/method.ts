import xs, { Stream } from 'xstream'
import { div
       , VNode
       , DOMSource
       } from '@cycle/dom'
import { StateSource } from 'cycle-onionify'
import isolate from '@cycle/isolate'

import { BaseSources, BaseSinks } from '../interfaces'

import { style } from 'typestyle'

import { values
       , compose
       , map
       , path
       // , pick
       , Dictionary
       // , toArray
       } from 'rambda'

const toArray =
  (input) => [...input]

export interface Sources extends BaseSources {
  onion: StateSource<State>
}
export interface Sinks extends BaseSinks {
  onion: Stream<Reducer>
}

// State
export interface State {
  count: number
}
export const defaultState: State =
  { count: 5
  }
export type Reducer = (prev: State) => State;

export const Method =
  (args: any, methodName) =>
    isolate
    ( ({DOM, onion}) => {
        const argsList: Dictionary<any> =
          compose
          ( map((component: any) => component({DOM, onion}))
          , values
          )(args)

        return (
          { DOM:
              view
              (methodName)
              ( onion.state$
                  .debug('component?')
              , map(path('DOM'), argsList)
              )
          , onion:
              actions
              ( DOM
              , map(path('onion'), argsList)
              )
          }
        )
      }
    , methodName
    )

const actions =
  (DOM: DOMSource, args) => {
    const init$ = xs.of<Reducer>( (prev) => prev ? prev : defaultState )

    return xs.merge
              ( init$
              , ...args
              )
  }

const view =
  (methodName) =>
    (state$, args) =>
      xs.combine(state$, ...args)
        .map
         ( ([state, ...divList]) =>
             div
             ( [ div(methodName)
               , div(divList)
               ]
             )
         )
