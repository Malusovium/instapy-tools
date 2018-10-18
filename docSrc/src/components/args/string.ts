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

import { initReducer } from './../../utils/comp-isolate'

export interface Sources extends BaseSources {
  onion: StateSource<State>
}
export interface Sinks extends BaseSinks {
  onion: Stream<Reducer>
}

// State
export type State =
  { value: string }
export const defaultState: State =
  { value: '' }
export type Reducer = (prev: State) => State

export const String =
  (wrapFn:any) =>
    (def, argName) =>
      wrapFn
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
  (defaultValue) =>
    (DOM: DOMSource) => {
      const init$ =
        xs.of<Reducer>
           ( initReducer(defaultValue, defaultState) )

      const update$ =
        DOM
          .select('input')
          .events('input')
          .map(path('target.value'))
          .map
           ( (newVal) =>
               (prev) => (
                 { ...prev
                 , value: newVal
                 }
               )
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
         ( ({value}) =>
             div
             ( `.${styles.wrapper}`
             , [ div(`.${styles.name}`, argName)
               , input
                 ( { props:
                     { value: value
                     }
                   }
                 )
               ]
             )
         )
