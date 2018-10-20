// index
import { intent } from './intent'
import { view } from './view'

import { State
       , Reducer
       , Component
       } from './types'

const configOut: Component =
  ({DOM, onion}) => (
    { DOM: view(onion.state$)
    , onion: intent(DOM)
    }
  )

export
  { State
  , configOut
  }
