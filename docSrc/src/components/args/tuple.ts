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
       , zip
       , compose
       , take
       , update
       , pluck
       , map
       , path
       , Dictionary
       } from 'rambda'

import { initReducer } from './../../utils/comp-isolate'
import { Arg } from './index'

export interface Sources extends BaseSources {
  onion: StateSource<State>
}
export interface Sinks extends BaseSinks {
  onion: Stream<Reducer>
}

// State
export type State =
  { value: any[] }
export const defaultState: State =
  { value: [] }
export type Reducer = (prev: State) => State;

const subLens =
  (index) => (
    { get: state => (
        { ...state[`_${index}`]
        }
      )
    , set: (state, childState) => (
        { ...state
        , [`_${index}`]: childState
        , value: update(index, childState.value, state.value)
        }
      )
    }
  )

const subIsolate =
  () =>
    (lens) =>
      (component, name) =>
        isolate
        ( component
        , { onion: lens
          , '*': name + ' sub'
          }
        )

const logIt =
  (val) => { console.log(val); return val}

export const Tuple =
  (wrapFn) =>
    (_subTypes) =>
      (def, argName) =>
        wrapFn
        ( ({DOM, onion}) => {
            const subArgs =
              compose
              ( map( (component:any) => component({DOM, onion}))
              , map
                ( ([index, wrappedComponent]) =>
                    wrappedComponent(def[index], index + '')
                )
              , map<any, any>
                ( ([index, _type]) =>
                    [ index
                    , Arg
                      ( subIsolate(subLens(index))
                      )(_type)
                    ]
                )
              , zip<any>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
              )( _subTypes )

            return (
              { DOM:
                  view
                  ( argName )
                  ( onion.state$
                  , map(path('DOM'), subArgs)
                  // , pluck('DOM', subArgs)
                  )
              , onion:
                  actions
                  ( def )
                  ( DOM
                  , map(path('onion'), subArgs)
                  // , pluck('onion', subArgs)
                  )
              }
            )
          }
        , argName
        )

const actions =
  (defaultValue) =>
    (DOM: DOMSource, subArgs) => {
      const init$ =
        xs.of<Reducer>
           ( initReducer(defaultValue, defaultState) )

    return xs.merge
              ( init$
              , ...subArgs
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
    (state$, subArgs) =>
      xs.combine(state$, ...subArgs)
        .map
         ( ([empty, ...subDoms]) =>
             div
             ( `.${styles.wrapper}`
             , [ div(`.${styles.name}`, argName)
               , div(`.${styles.input}`, subDoms)
               ]
             )
         )
