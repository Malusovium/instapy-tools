// intent
import xs, { Stream } from 'xstream'
import { DOMSource } from '@cycle/dom'

import { State, Reducer } from './types'

const defaultState: State =
  { name: ''
  , value: []
  , _default: []
  }

const intent =
  ( DOM: DOMSource
  , childComponents
  ) => {
    const init$ =
      xs
        .of<Reducer>
         ( (prev) => (
             { ...defaultState
             , ...prev
             }
           )
         )

    return xs.merge(init$, ...childComponents)
  }

export
  { intent
  }
