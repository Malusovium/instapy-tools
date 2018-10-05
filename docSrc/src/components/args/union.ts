import xs, { Stream } from 'xstream'
import { div
       , VNode
       , DOMSource
       } from '@cycle/dom'
import { StateSource } from 'cycle-onionify'
import isolate from '@cycle/isolate'

import { BaseSources, BaseSinks } from '../../interfaces'

import { style } from 'typestyle'
import * as csstips from 'csstips'

import { values
       , pluck
       , compose
       , reject
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
  null
export const defaultState: State =
  null
export type Reducer = (prev: State) => State;

const isType =
  (val) =>
    val !== undefined
    && val.name !== undefined
    && val.name === 'None'
    || val.name === 'Boolean'
    || val.name === 'String'
    || val.name === 'Number'
    || val.name === 'Union'
    || val.name === 'Array'
    || val.name === 'Tuple'

const miniComponent =
  (str: string) =>
    ({DOM, onion}) => (
      { DOM: div(str)
      , onion: xs.of(str)
      }
    )

export const Union =
  (wrapFn) =>
    (_options) =>
      (def, argName) =>
        wrapFn
        ( ({DOM, onion}) => {
            const literals =
              reject(isType, _options)
              // compose
              // ( (component:any) => component({DOM, onion})
              // , map(miniComponent)
              // )(_options)

            return (
              { DOM:
                  view
                  ( argName, literals )
                  ( onion.state$
                  )
              , onion:
                  actions
                  ( def )
                  ( DOM
                  )
              }
            )
          }
        , argName
        )

const actions =
  (_defaultValue) =>
    (DOM: DOMSource) => {
      const init$ =
        xs.of<Reducer>
           ( (prev) =>
               prev ? prev
               : _defaultValue ? _defaultValue
               : defaultState
           )

      const literal$ =
        DOM
          .select('.literal')
          .events('click')
          .map(path('target.innerText'))
          .map
           ( (next) => (prev) => (next) )

    return xs.merge
              ( init$
              , literal$
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
  (csstips.horizontal)

const valueStyle =
  style
  ()

const styles =
  { wrapper: wrapperStyle
  , name: nameStyle
  , input: inputStyle
  , value: valueStyle
  }

const divify =
  (val) => div(`.literal`, val)

const view =
  (argName, literals) =>
    (state$) =>
      state$
        .map
         ( (value) =>
             div
             ( `.${styles.wrapper}`
             , [ div(`.${styles.name}`, argName)
               , div
                 ( `.${styles.input}`
                 , [ div(map(divify, literals))
                   , div(`.${styles.value}`, value === null ? 'None' : value)
                   ]
                 )
               ]
             )
         )
