// view
import { Stream } from 'xstream'
import { div
       , h4
       } from '@cycle/dom'
import { State } from './types'
import * as styles from './styles'

import { mustArray } from './../../utils/must'

const dom =
  ( { name
    , value
    , _default
    }
  ) =>
    div
    ( { class:
        { [styles.container]: true
        }
      }
    , [ ...mustArray
        ( name !== ''
        , h4
          ( { class: { [styles.title]: true }
            }
          , name
          )
        )
      , div
        ( { class: { [styles.paragraph]: true }
          }
        , value
        )
      ]
    )

const view =
  (state$: Stream<State>) =>
    state$
      .map(dom)

export
  { view
  }
