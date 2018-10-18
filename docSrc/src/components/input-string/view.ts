// view
import { Stream } from 'xstream'
import { div
       , h4
       , input
       } from '@cycle/dom'
import { State } from './types'
import * as styles from './styles'

const dom =
  ( { name
    , value
    }
  ) =>
    div
    ( `.${styles.container}`
    , [ h4(`.${styles.name}`, name)
      , input
        ( `.${styles.input}`
        , { props: { value: value } }
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
