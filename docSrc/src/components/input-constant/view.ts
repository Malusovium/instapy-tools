// view
import { Stream } from 'xstream'
import { div
       , h4
       } from '@cycle/dom'
import { State } from './types'
import * as styles from './styles'

const dom =
  ( { name
    , value
    , _default
    }
  ) =>
    div
    ( `.${styles.container}`
    , [ h4(`.${styles.title}`, name)
      , div(`.${styles.paragraph}`, value)
      ]
    )

const view =
  (state$: Stream<State>) =>
    state$
      .map(dom)

export
  { view
  }
