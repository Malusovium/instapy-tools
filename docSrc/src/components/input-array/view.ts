// view
import { Stream } from 'xstream'
import { div
       , h4
       , textarea
       } from '@cycle/dom'
import { State } from './types'
import * as styles from './styles'

import { join } from 'rambda'

import { mustArray } from './../../utils/must'

const dom =
  ( { name
    , value
    }
  ) =>
    div
    ( `.${styles.container}`
    , [ ...mustArray
        ( name !== ''
        , h4(`.${styles.name}`, name)
        )
      , textarea
        ( `.${styles.textarea}`
        , { props: { value: value } }
        )
      ]
    )

const view =
  (state$: Stream<State>) =>
    state$
      .map
       ( (state) => (
           { ...state
           , value: join(' ', state.value)
           }
         )
       )
      .map(dom)

export
  { view
  }
