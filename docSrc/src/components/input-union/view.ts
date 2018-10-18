// view
import xs, { Stream } from 'xstream'
import { div
       , h4
       } from '@cycle/dom'
import { State } from './types'
import * as styles from './styles'

const pickList =
  (n: number, acc: any[] = []) =>
    n < 0
      ? acc
      : pickList
        ( n - 1
        , [ div
            ( { dataset: { pick: `${n}` } }
            , `${n}`
            )
          , ...acc
          ]
        )

const dom =
  ( [ { name
      , active
      , pickListOpen
      }
    , childComponents
    ]
  ) =>
    div
    ( `.${styles.container}`
    , [ h4(`.${styles.name}`, name)
      , div
        ( `.${styles.childWrapper}`
        , [ div
            ( { class:
                { [styles.hidden]: pickListOpen
                }
              , dataset: { pickOpen: true }
              }
            , 'Open'
            )
          , div
            ( { class:
                { [styles.pickListWrapper]: true
                , [styles.hidden]: !pickListOpen
                }
              }
            , pickList(childComponents.length - 1)
            )
          , div
            ( { class:
                { [styles.hidden]: pickListOpen
                }
              }
            , childComponents[active]
            )
          ]
        )
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
