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
    , childComponents
    ]
  ) =>
    div
    ( `.${styles.container}`
    , [ h2(`.${styles.title}`, title)
      , p(`.${styles.paragraph}`, paragraph)
      , div(childComponents)
      ]
    )

const headTailPair =
  ([head, ...tail]) => [head, tail]

const view =
  (state$: Stream<State>, childComponentsDOM: Stream<VNode>[]) =>
    xs.combine(state$, ...childComponentsDOM)
      .map(headTailPair)
      .map(dom)

export
  { view
  }
