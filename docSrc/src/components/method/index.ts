// index
import { intent } from './intent'
import { view } from './view'
import { Type } from '../../../../src'

import
  { State
  , Component
  } from './types'

import
  { map
  , compose
  , values
  , path
  , take
  } from 'rambda'

type ChildComponents =
  { [index:string]: Component }

const compList =
  (childComponents) =>
    ({DOM, onion}) => {
      const childComponentsSinks =
        map
        ( (component:Component) => component({DOM, onion})
        , values(childComponents)
        )
      const childComponentsDOM =
        map<any, any>(path('DOM'), childComponentsSinks)
      const childComponentsOnion =
        map(path('onion'), childComponentsSinks)

      return (
        { DOM: childComponentsDOM
        , onion: childComponentsOnion
        }
      )
    }

const method = 
  (childComponents: ChildComponents = {}) : Component =>
    ({DOM, onion}) => {
      const childComponentsSinks =
        compList(childComponents)({DOM, onion})

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
  , method
  }
