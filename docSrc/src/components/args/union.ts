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
       , zip
       , filter
       , is
       , map
       , path
       , Dictionary
       } from 'rambda'

import { compIsolate, initReducer } from './../../utils/comp-isolate'
import { Arg } from './index'

export interface Sources extends BaseSources {
  onion: StateSource<State>
}
export interface Sinks extends BaseSinks {
  onion: Stream<Reducer>
}

// State
export type State =
  { active: number
  , op0: any
  }
export const defaultState: State =
  { active: 0
  , op0: null
  }
export type Reducer = (prev: State) => State;

const isType =
  (val) =>
    val !== undefined
    && val._name !== undefined
    && val._name === 'None'
    || val._name === 'Boolean'
    || val._name === 'String'
    || val._name === 'Number'
    || val._name === 'Union'
    || val._name === 'Array'
    || val._name === 'Tuple'

const miniComponent =
  (str: string) =>
    ({DOM, onion}) => (
      { DOM: div(str)
      , onion: xs.of(() => str)
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

            const subOptions =
              compose
              ( map( (component:any) => component({DOM, onion}))
              , map
                ( ([index, wrappedComponent]) =>
                    wrappedComponent(null, `op${index}`)
                )
              , zip([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
              , map<any, any>
                ( ( _type) =>
                    Arg
                    ( compIsolate
                    // ( subIsolate(compLens(`_${_type._name}`, _type._name))
                    // ( subIsolate(subLens(_type), _type._name)
                    // ( tempSubIsolate({}, _type._name)
                    // ( isolate
                    )(_type)
                )
              , filter(isType)
              )( _options )

            console.log(subOptions)

            return (
              { DOM:
                  view
                  ( argName, literals )
                  ( onion.state$
                  , map(path('DOM'), subOptions)
                  )
              , onion:
                  actions
                  ( def )
                  ( DOM
                  , map(path('onion'), subOptions)
                  )
              }
            )
          }
        , argName
        )

const actions =
  (defaultValue) =>
    (DOM: DOMSource, subOptions) => {
      const init$ =
        xs.of<Reducer>
           ( initReducer(defaultValue, defaultState) )

      const pick$ =
        DOM
          .select('div[data-action]')
          .events('click')
          .map(path('target.dataset.num'))

      // const updatePick$ =
      //   pick$
      //     .map
      //      ( (pickedNum) =>
      //          (prev) => (
      //            { ...prev
      //            , active: pickedNum
      //            }
      //          )
      //      )

      // const switchOutput$ =
      //   xs.combine(pick$, ...subOptions)
      //     .map
      //      ( ([pick, ...options]) =>
      //          options[pick]
      //      )
      //      // .startWith(subOptions[0])
      //      .debug('well?')

      // const literal$ =
      //   DOM
      //     .select('.literal')
      //     .events('click')
      //     .map(path('target.innerText'))
      //     .map
      //      ( (next) => (prev) => (next) )

    return xs.merge
              ( init$
              // , updatePick$
              // , switchOutput$
              , ...subOptions
              // , literal$
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

const pick =
  (num:number) =>
    div({dataset: {action: 'pick', num: `${num}`}}, num)

const view =
  (argName, literals) =>
    (state$, subOptions) =>
      state$
        .mapTo(
      div('union')
        )
      // xs.combine(state$, ...subOptions)
      //   .map
      //    ( ( [ { active
      //          }
      //        , ...options
      //        ]
      //      ) =>
      //        div
      //        ( `.${styles.wrapper}`
      //        , [ div(`.${styles.name}`, argName)
      //          , div
      //            ( `.${styles.input}`
      //            , [ div
      //                ( '.pick'
      //                , [ pick(0)
      //                  , pick(1)
      //                  , pick(2)
      //                  , pick(3)
      //                  , pick(4)
      //                  ]
      //                )
      //              , options[active]
      //              ]
      //            )
      //          ]
      //        )
      //    )
