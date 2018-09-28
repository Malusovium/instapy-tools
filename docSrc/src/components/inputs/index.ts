import { api
       , ArgComponentType
       } from '../../../../src'
import { None } from './none'
import { Boolean } from './boolean'

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
  (def, name) =>
    isolate
    ( ({DOM, onion}) => (
        { DOM: xs.of(div(name + ': arg input' + '\n' + 'default Input: ' + def))
        , onion: xs.of( (prev) => prev ? prev : def )
        }
      )
    , name
    )

export const Arg: ArgComponentType =
  setupArgComponent
  ( { _default: SimpleArgComponent
    , none: None
    , boolean: Boolean // SimpleArgComponent
    , string: SimpleArgComponent
    , number: (_constrains) => SimpleArgComponent
    , union: (_options) => SimpleArgComponent
    , array: (_subType) => SimpleArgComponent
    , tuple: (_subTypes) => SimpleArgComponent
    }
  )
