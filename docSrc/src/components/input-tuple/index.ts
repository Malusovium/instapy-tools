// index
import { intent } from './intent'
import { view } from './view'

import
  { State
  , Reducer
  , Component
  } from './types'

import
  { map
  , values
  , path
  , compose
  , zip
  , pathOr
  , update
  } from 'rambda'

import
  { Arg
  } from './../arg'

const defaultLens =
  (_0, key, _1) => (
    { get: (parentState) => (
        { ...parentState[`_${key}`]
        , _default: parentState._default[key]
        , value:
            pathOr
            ( parentState._default[key]
            , [ `_${key}`, 'value' ]
            , parentState
            )
        }
      )
    , set: (parentState, childState) => (
        { ...parentState
        , [`_${key}`]: childState
        , value:
            update
            ( key
            , childState.value
            , parentState.value
            )
        }
      )
    }
  )

const numberLens =
  (_, key, { _step, _min, _max }) => (
    { get:
        (parentState) => (
          { ...parentState[`_${key}`]
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

const compList =
  (childComponents) =>
    ({DOM, onion}) => {
      const childComponentsSinks =
        map
        ( (component:Component) => component({DOM, onion})
        , childComponents
        )
      const childComponentsDOM =
        map(path('DOM'), childComponentsSinks)
      const childComponentsOnion =
        map(path('onion'), childComponentsSinks)

      return (
        { DOM: childComponentsDOM
        , onion: childComponentsOnion
        }
      )
    }

const inputTuple =
  (_subTypes): Component =>
    ({DOM, onion}) => {
      const childComponents =
        compose
        ( map( ([index, makeComponent]) => makeComponent(null, index))
        , zip([0,1,2,3,4,5,6,7,8,9])
        , map
          ( Arg
            ( { _default: defaultLens
              , none: defaultLens
              , boolean: defaultLens
              , string: defaultLens
              , number: defaultLens
              , array: defaultLens
              , tuple: defaultLens
              , union: defaultLens
              }
            )
          )
        )(_subTypes)
      const childComponentsSinks =
        compList(childComponents)({DOM, onion})

      console.log(_subTypes)
      console.log(childComponents)
      console.log(childComponentsSinks)

      return (
        { DOM:
            view
            ( onion.state$
            , childComponentsSinks.DOM
            )
        , onion:
            intent
            ( DOM
            , childComponentsSinks.onion
            )
        }
      )
    }

export
  { State
  , inputTuple
  }
