// intent
import xs, { Stream } from 'xstream'
import { DOMSource } from '@cycle/dom'

import { State, Reducer } from './types'

const defaultState: State =
  { title: 'Template Component'
  , paragraph: 'This is am example component.'
  , subComponents: []
  }

const intent =
  (DOM: DOMSource) => {
    const init$ =
      xs
        .of<Reducer>
         ( (prev) =>
             ({ ...defaultState, ...prev })
         )

    return xs.merge
              ( init$ )
  }

export
  { intent
  }
