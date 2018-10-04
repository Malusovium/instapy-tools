import xs, { Stream } from 'xstream'
import { div
       , input
       , VNode
       , DOMSource
       } from '@cycle/dom'
import { StateSource } from 'cycle-onionify'
import isolate from '@cycle/isolate'

import { BaseSources, BaseSinks } from '../../interfaces'

import { style } from 'typestyle'
import * as csstips from 'csstips'

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
export type State =
  number
export const defaultState: State =
  0
export type Reducer = (prev: State) => State;

export const Number =
  (_constrains) =>
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
  (_defaultValue: number) =>
    (DOM: DOMSource) => {
      const init$ =
        xs.of<Reducer>
           ( (prev) =>
               prev ? prev
               : _defaultValue ? _defaultValue
               : defaultState
           )

      const update$ =
        DOM
          .select('input')
          .events('input')
          .map(path('target.value'))
          .map
           ( (nextValue) =>
               (prevValue) =>
                 nextValue
           )

      return xs.merge
                ( init$
                , update$
                )
    }

const wrapperStyle =
  style
  ( { fontSize: '1em'
    , padding: '.4em'
    }
  , csstips.vertical
  )

const nameStyle =
  style
  ()

const inputStyle =
  style
  ()

const styles =
  { wrapper: wrapperStyle
  , name: nameStyle
  , input: inputStyle
  }

const view =
  (argName) =>
    (state$) =>
      state$
        .map
         ( (value) =>
             div
             ( `.${styles.wrapper}`
             , [ div(`.${styles.name}`, argName)
               , input
                 (`.${styles.input}`
                 , { attrs:
                     { type: 'number'
                     }
                   , props:
                     { value: value
                     }
                   }
                 )
               , div(value)
               ]
             )
         )
