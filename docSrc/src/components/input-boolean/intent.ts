// intent
import xs, { Stream } from 'xstream'
import { DOMSource } from '@cycle/dom'

import { State, Reducer } from './types'

const defaultState: State =
  { name: ''
  , value: false
  , _default: false
  }

const intent =
  (DOM: DOMSource) => {
    const init$ =
      xs
        .of<Reducer>
         ( (prev) => (
             { ...defaultState
             , ...prev
             }
           )
         )

    const flip$ =
      DOM
        .select('div[data-flip]')
        .events('click')
        .mapTo
         ( (prev) => (
             { ...prev
             , value: !prev.value
             }
           )
         )

    return xs.merge(init$, flip$)
  }

export
  { intent
  }
