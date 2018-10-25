// intent
import xs, { Stream } from 'xstream'
import { DOMSource } from '@cycle/dom'

import { State, Reducer } from './types'

const defaultState: State =
  { name: 'Method'
  , isIncluded: false
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

    const include$ =
      DOM
        .select('[data-include]')
        .events('click')
        .mapTo
         ( (prevState) => (
             { ...prevState
             , isIncluded: !prevState.isIncluded
             }
           )
         )

    return xs.merge
              ( init$
              , include$
              , ...childComponentOnion
              )
  }

export
  { intent
  }
