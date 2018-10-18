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
    , step
    }
  ) =>
    div
    ( `.${styles.container}`
    , [ h4(`.${styles.name}`, name)
      , div
        ( `.${styles.wrapper}`
        , [ input
            ( `.${styles.input}`
            , { props:
                { value: value
                , type: 'number'
                , step: step
                }
              }
            )
          , div( `.${styles.value}`, value)
          ]
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
