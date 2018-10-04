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
export type State = string
export const defaultState: State = ''
export type Reducer = (prev: State) => State

export const String =
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
              ( def )
              ( DOM )
          }
        )
      }
    , argName
    )

const actions =
  (_defaultValue: string) =>
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
           ( (newVal) =>
               (prevVal) =>
                  newVal
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
         ( (stateValue) =>
             div
             ( `.${styles.wrapper}`
             , [ div(`.${styles.name}`, argName)
               , input
                 ( { props:
                     { value: stateValue
                     }
                   }
                 )
               ]
             )
         )
