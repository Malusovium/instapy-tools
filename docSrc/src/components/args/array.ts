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
       , map
       , flatten
       , contains
       , reject
       , join
       , compose
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
  { value: string[] | number[] }
export const defaultState: State =
  { value: [] }
export type Reducer = (prev: State) => State;

const prefix =
  (add:string) =>
    (source:string) =>
      `${add}${source}`

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

const prefixChar =
  (prefix:string, match:string) =>
    (source:string) =>
      source === match
        ? `${prefix}${match}`
        : source

const replaceTo =
  (match:string, to: string) =>
    (source:string) =>
      source === match
        ? to
        : source

const actions =
  (defaultValue) =>
    (DOM: DOMSource) => {
      const init$ =
        xs.of<Reducer>
           ( initReducer(defaultValue, defaultState) )

      const update$ =
        DOM
          .select('textarea')
          .events('keyup')
          .map(path('target.value'))
          .map(split(''))
          .map<any>(map(replaceTo('\n', ' ')))
          .map<any>(map(replaceTo(',', ' ')))
          .map<any>(map(prefixChar(' ', '#')))
          .map(join(''))
          .map<any>(split(' '))
          .map<any>(reject( (val) => contains(val, ['', '#'])))
          .map
           ( (nextValue) =>
               (prev) => (
                 { ...prev
                 , value: nextValue
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
  ( { padding: '.4em'
    }
  )

const styles =
  { wrapper: wrapperStyle
  , name: nameStyle
  , input: inputStyle
  }

const view =
  (argName) =>
    (state$) =>
      state$
        .map(path('value'))
        .map(join(' '))
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
