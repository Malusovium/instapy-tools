// view
import xs, { Stream } from 'xstream'
import { div
       , h4
       } from '@cycle/dom'
import { State } from './types'
import * as styles from './styles'

import
  { dropLast
  } from 'rambda'

import { mustArray } from './../../utils/must'

const pickList =
  (childComponents, acc: any[] = []) =>
    childComponents.length < 1
      ? acc
      : pickList
        ( dropLast(1, childComponents)
        , [ div
            ( `.${styles.pickWrapper}`
            , [ childComponents[childComponents.length - 1]
              , div(`.${styles.pick}`,  { dataset: { pick: `${childComponents.length - 1}`} })
              ]
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
    , [ ...mustArray
        ( name !== ''
        , h4(`.${styles.name}`, name)
        )
      , div
        ( `.${styles.childWrapper}`
        , [ div
            ( { class:
                { [styles.hidden]: pickListOpen
                , [styles.open]: true
                }
              , dataset: { pickOpen: true }
              }
            , '^'
            )
          , div
            ( { class:
                { [styles.pickListWrapper]: true
                , [styles.hidden]: !pickListOpen
                }
              }
            , pickList(childComponents)
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
