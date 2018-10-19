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
    ( `.${styles.container}`
    , [ ...mustArray
        ( name !== ''
        , h4(`.${styles.title}`, name)
        )
      , div(`.${styles.paragraph}`, 'None')
      ]
    )

const view =
  (state$: Stream<State>) =>
    state$
      .map(dom)

export
  { view
  }
