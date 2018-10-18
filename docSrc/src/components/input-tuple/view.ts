// view
import xs, { Stream } from 'xstream'
import { div
       , h4
       } from '@cycle/dom'
import { State } from './types'
import * as styles from './styles'

const dom =
  ( [ { name
      }
    , childComponents
    ]
  ) =>
    div
    ( `.${styles.container}`
    , [ h4(`.${styles.name}`, name)
      , div(`.${styles.args}`, childComponents)
      ]
    )

const headTailPair =
  ([head, ...tail]:any[]) => [head, tail]

const view =
  (state$: Stream<State>, childComponents) =>
    xs.combine(state$, ...childComponents)
      .map(headTailPair)
      .map(dom)

export
  { view
  }
