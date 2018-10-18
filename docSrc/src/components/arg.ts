import { api
       , ArgComponentType
       } from '../../../src'

import { ifElse
       , pathOr
       } from 'rambda'

import { inputNone } from './input-none'
import { inputBoolean } from './input-boolean'
import { inputString } from './input-string'
import { inputNumber } from './input-number'
import { inputArray } from './input-array'
import { inputTuple } from './input-tuple'
import { inputUnion } from './input-union'

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

const minimalArgComponent =
  ({DOM, onion}) => (
    { DOM:
        onion
          .state$
          .map
           ( ({value, _default}) => 
               div(`value: ${value}, default: ${_default}`)
           )
    , onion: xs.of( (prev) =>({ value: '', _default: '', ...prev}))
    }
  )

const logY =
  (value:any) => {console.log(value); return value}

const defaultLens =
  (def, argName, _) => (
    { get:
        (parentState) => (
          { ...parentState[`_${argName}`]
          , _default: def
          , name: argName
          , value:
              pathOr
              ( def
              , [ `_${argName}`, 'value' ]
              , parentState
              )
          }
        )
    , set:
        (parentState, childState) => (
          { ...parentState
          , [`_${argName}`]: childState
          , value:
              { ...parentState.value
              , [argName]: childState.value
              }
          }
        )
    }
  )

const maybeObject =
  (key: string, value: any) =>
    value === undefined
      ? {}
      : { [key]: value }

const numberLens =
  (def, argName, { _step, _min, _max }) => (
    { get:
        (parentState) => (
          { ...parentState[`_${argName}`]
          , _default: def
          , name: argName
          , value:
              pathOr
              ( def
              , [ `_${argName}`, 'value' ]
              , parentState
              )
          , ...maybeObject('step', _step)
          , ...maybeObject('min', _min)
          , ...maybeObject('max', _max)
          }
        )
    , set:
        (parentState, childState) => (
          { ...parentState
          , [`_${argName}`]: childState
          , value:
            { ...parentState.value
            , [argName]: childState.value
            }
          }
        )
    }
  )

const unionLens =
  (def, argName) => (
    { get:
        (parentState) => (
          { ...parentState[`_${argName}`]
          , _default: def
          , name: argName
          , value:
              pathOr
              ( def
              , [ `_${argName}`, 'value' ]
              , parentState
              )
          }
        )
    , set:
        (parentState, childState) => (
          { ...parentState
          , [`_${argName}`]: childState
          , value:
            { ...parentState.value
            , [argName]:
                childState[`_${childState.active}`] === undefined
                  ? def
                  : childState[`_${childState.active}`].value
            }
          }
        )
    }
  )

const argIsolate =
  (component, lens, _sub = undefined) =>
    (def, argName) =>
      isolate
      ( component
      , { onion: lens(def, argName, _sub)
        , '*': argName
        }
      )

export const Arg=
  ( { _default = defaultLens
    , none = defaultLens
    , boolean = defaultLens
    , string = defaultLens
    , number = numberLens
    , array = defaultLens
    , tuple = defaultLens
    , union = unionLens
    }
  ): ArgComponentType =>
    setupArgComponent
    ( { _default: argIsolate(minimalArgComponent, _default)
      , none: argIsolate(inputNone, none)
      , boolean: argIsolate(inputBoolean, boolean)
      , string: argIsolate(inputString, string)
      , number: (_constraints) => argIsolate(inputNumber, number, _constraints)
      , array: () => argIsolate(inputArray, array)
      , tuple: (_subTypes) => argIsolate(inputTuple(_subTypes), tuple)
      , union: (_options) => argIsolate(inputUnion(_options), union)
      }
    )
