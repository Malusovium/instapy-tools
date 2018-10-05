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
  (wrapFn:any) =>
    (def, argName) =>
      wrapFn
      ( ({DOM, onion}) => {

        console.log(argName)
        console.log(def)

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
               : _defaultValue ? _defaultValue
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
  ( { color: 'white'
    , textAlign: 'center'
    }
  )

const styles =
  { wrapper: wrapperStyle
  , name: nameStyle
  , input: inputStyle
  }

const flipStateStyle =
  (isOn: boolean) =>
    isOn
      ? style
        ( { background: '#1e1'
          }
        )
      : style
        ( { background: '#7d7d7d'
          }
        )

const view =
  (argName) =>
    (state$) =>
      state$
        .debug('Boolean value:')
        .map
         ( (value) =>
             div
             ( `.${styles.wrapper}`
             , [ div(`.${styles.name}`, argName)
               , div
                 ( `.flip.${styles.input}.${flipStateStyle(value)}`
                 , value ? 'True' : 'False'
                 )
               ]
             )
         )
