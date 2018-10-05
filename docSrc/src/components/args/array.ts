import xs, { Stream } from 'xstream'
import { div
       , textarea
       , VNode
       , DOMSource
       } from '@cycle/dom'
import { StateSource } from 'cycle-onionify'
import isolate from '@cycle/isolate'

import { BaseSources, BaseSinks } from '../../interfaces'

import { style } from 'typestyle'
import * as csstips from 'csstips'

import { split
       , path
       , reject
       , join
       , compose
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
  string[] | number[]
export const defaultState: State =
  []
export type Reducer = (prev: State) => State;

export const Array =
  (wrapFn:any) =>
    (_options) =>
      (def, argName) =>
        wrapFn
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

type RemoveWhiteSpace = (string) => string

const removeWhiteSpace: RemoveWhiteSpace =
  compose
  ( join('')
  , reject<any>( (val) => val === ' ' )
  , split('')
  )

const actions =
  (_defaultValue: string[]) =>
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
          .select('textarea')
          .events('input')
          .map(path('target.value'))
          .map(removeWhiteSpace)
          .map(split(','))
          .map<any>(reject( (val) => val === ''))
          .map((next) => (prev) => next)

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
        .map(join(', '))
        .map
         ( (value) =>
             div
             ( `.${styles.wrapper}`
             , [ div(`.${styles.name}`, argName)
               , textarea
                 ( `.${styles.input}`
                 , { props:
                     { value: value }
                   }
                 )
               ]
             )
         )
