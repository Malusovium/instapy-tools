// intent
import xs, { Stream } from 'xstream'
import { DOMSource } from '@cycle/dom'

import { State, Reducer } from './types'

const defaultState: State =
  { title: 'Template Component'
  , paragraph: 'This is am example component.'
  }

const intent =
  (DOM: DOMSource, childComponentOnion) => {
    const init$ =
      xs
        .of<Reducer>
         ( (prev) => (
             { ...defaultState
             , ...prev
             }
           )
         )

    return xs.merge(init$, ...childComponentOnion)
  }

export
  { intent
  }
