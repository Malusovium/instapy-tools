// view
import xs, { Stream } from 'xstream'
import { div
       , h2
       , p
       , VNode
       } from '@cycle/dom'
import { State } from './types'
import * as styles from './styles'

const dom =
    ( [ { title
        , paragraph
        }
      , components
      ]
    ) =>
      div
      ( `.${styles.container}`
      , [ h2(`.${styles.title}`, title)
        , p(`.${styles.paragraph}`, paragraph)
        , div(components)
        ]
      )

type view =
  (stream$: [State, VNode[]]) => VNode

const view =
  (state$: Stream<State>) =>
    state$
      .map(dom)

export
  { view
  }
