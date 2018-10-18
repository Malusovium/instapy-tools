import { api
       , ArgComponentType
       } from '../../../../src'
import { None } from './none'
import { Boolean } from './boolean'
import { String } from './string'
import { Number } from './number'
import { Union } from './union'
import { Array } from './array'
import { Tuple } from './tuple'

import { unionLens, compLens } from './../../utils/comp-isolate'

// <START to-remove
import xs, { Stream } from 'xstream'
import { div
       , VNode
       , DOMSource 
       } from '@cycle/dom'
import { StateSource } from 'cycle-onionify'
import isolate from '@cycle/isolate'
// END>

const { setupArgComponent } = api

const SimpleArgComponent =
  (wrapFn) =>
    (def, name) =>
      wrapFn
      ( ({DOM, onion}) => (
          { DOM: xs.of(div(name + ': arg input' + '\n' + 'default Input: ' + def))
          , onion: xs.of( (prev) => ({...prev, value: def}))
          }
        )
      , name
      )

// export const Arg: ArgComponentType =
//   (wrapFn:any) =>
//     setupArgComponent
//     ( { _default: SimpleArgComponent(wrapFn)
//       , none: None(wrapFn)
//       , boolean: Boolean(wrapFn)
//       , string: String(wrapFn) // SimpleArgComponent
//       , number: Number(wrapFn) // (_constrains) => SimpleArgComponent
//       , union: Union(wrapFn) //(_options) => SimpleArgComponent(wrapFn)
//       , array: Array(wrapFn) // (_subType) => SimpleArgComponent
//       , tuple: Tuple(wrapFn)//(_subTypes) => SimpleArgComponent
//       }
//     )
export const Arg: ArgComponentType =
  setupArgComponent
  ( { _default: SimpleArgComponent
    , none: None //SimpleArgComponent(wrapFn)
    , boolean: Boolean //SimpleArgComponent(wrapFn)
    , string: String // SimpleArgComponent(wrapFn)
    , number: Number // (_constrains) => SimpleArgComponent(wrapFn) 
    // , union: Union(wrapFn(compLens))
    // , union: Union(wrapFn(unionLens))
    // , union: Union(wrapFn())
    , union: (_options) => SimpleArgComponent
    , array: Array
    // , array: (_) => SimpleArgComponent(wrapFn) // Array(wrapFn)
    , tuple: Tuple
    }
  )
