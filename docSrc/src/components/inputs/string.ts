import xs, { Stream } from 'xstream'
import { div
       , VNode
       , DOMSource
       } from '@cycle/dom'
import { StateSource } from 'cycle-onionify'
import isolate from '@cycle/isolate'

import { BaseSources, BaseSinks } from '../../interfaces'

import { style } from 'typestyle'

import { values
       , compose
       , map
       , path
       , Dictionary
       } from 'rambda'

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

export const <inputArg> =
  (def, argName) =>
    isolate
    ( ({DOM, onion}) => {

        return (
          { DOM:
              view
              (argName)
              ( onion.state$ )
          , onion:
              actions
              ( DOM )
          }
        )
      }
    , argName
    )

const actions =
  (DOM: DOMSource) => {
    const init$ = xs.of<Reducer>( (prev) => prev ? prev : defaultState )

    return xs.merge
              ( init$
              )
  }

const view =
  (argName) =>
    (state$) =>
      state$
        .map
         ( ({count}) =>
             div
             ( [ div(argName)
               , div(count)
               ]
             )
         )
