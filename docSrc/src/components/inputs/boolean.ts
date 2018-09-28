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
export type State = boolean
export const defaultState: State = false
export type Reducer = (prev: State) => State;

export const Boolean =
  (def, argName) =>
    isolate
    ( ({DOM, onion}) => {

        return (
          { DOM:
              view
              ( argName )
              ( onion.state$ )
          , onion:
              actions
              ( def )
              ( DOM )
          }
        )
      }
    , argName
    )

const actions =
  (_defaultValue: boolean) =>
    (DOM: DOMSource) => {
      const init$ =
        xs.of<Reducer>
           ( (prev) =>
               prev ? prev
               : _defaultValue ? false // _defaultValue
               : defaultState
           )

      const flip$ =
        DOM
          .select('.flip')
          .events('click')
          .mapTo<Reducer>
           ( (prev) => !prev )

      return xs.merge
                ( init$
                , flip$
                )
    }

const view =
  (argName) =>
    (state$) =>
      state$
        .debug('Boolean value:')
        .map
         ( (value) =>
             div
             ( [ div(argName)
               , div('.flip', value ? 'True' : 'False')
               ]
             )
         )
