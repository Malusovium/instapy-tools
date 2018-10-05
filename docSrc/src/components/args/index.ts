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
          , onion: xs.of( (prev) => prev ? prev : def )
          }
        )
      , name
      )

export const Arg: ArgComponentType =
  (wrapFn:any) =>
    setupArgComponent
    ( { _default: SimpleArgComponent(wrapFn)
      , none: None(wrapFn)
      , boolean: Boolean(wrapFn)
      , string: String(wrapFn) // SimpleArgComponent
      , number: Number(wrapFn) // (_constrains) => SimpleArgComponent
      , union: Union(wrapFn) //(_options) => SimpleArgComponent(wrapFn)
      , array: Array(wrapFn) // (_subType) => SimpleArgComponent
      , tuple: Tuple(wrapFn)//(_subTypes) => SimpleArgComponent
      }
    )
