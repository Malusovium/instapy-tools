// view
import { Stream } from 'xstream'
import { div
       , h2
       , p
       } from '@cycle/dom'
import { State } from './types'
import * as styles from './styles'

const dom =
  ( { title
    , paragraph
    }
  ) =>
    div
    ( `.${styles.container}`
    , [ h2(`.${styles.title}`, title)
      , p(`.${styles.paragraph}`, paragraph)
      ]
    )

const view =
  (state$: Stream<State>) =>
    state$
      .map(dom)

export
  { view
  }
