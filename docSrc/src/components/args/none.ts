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
  { value: any }
export const defaultState: State =
  { value: null }
export type Reducer = (prev: State) => State;

export const None =
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
                ( DOM )
            }
          )
        }
      , argName
      )

const actions =
  (DOM: DOMSource) => {
    const init$ =
      xs.of<Reducer>(initReducer({value: null}, defaultState))

    return xs.merge
              ( init$
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
               , div(`.${styles.input}`, 'None')
               ]
             )
         )
