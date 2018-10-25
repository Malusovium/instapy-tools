// view
import xs, { Stream } from 'xstream'
import { div
       , h2
       , VNode
       } from '@cycle/dom'
import { State } from './types'
import * as styles from './styles'

import { mustArray } from './../../utils/must'

const dom =
  ( [ { name
      , isIncluded
      }
    , childComponents
    ]
  ) =>
    div
    ( `.${styles.container}`
    , [ h2
        ( { dataset: { include: true }
          , class:
            { [styles.name]: true
            , [styles.includeTrue]: isIncluded
            }
          }
        , name
        )
      , ...mustArray
        ( isIncluded
        , div(childComponents)
        )
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
