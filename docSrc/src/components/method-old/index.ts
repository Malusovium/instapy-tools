// index
import { intent } from './intent'
import { view } from './view'
import { State
       , Reducer
       , Sources
       , Sinks
       , Component
       } from './types'

import xs from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import { compose
       , map
       , values
       , path
       } from 'rambda'
import isolate from '@cycle/isolate'

const subComponentCombine =
  (mainStream$) =>
    (subComponent$) =>
      subComponent$
        .compose(dropRepeats())
        .map
         ( (componentStreams) =>
             xs.combine(mainStream$, ...componentStreams)
               .map( ([head, ...tail]) => [head, tail])
         )
        .flatten()

const subComponentMerge =
  (mainStream$) =>
    (subComponents$) =>
      subComponents$
        .map
         ( (componentStreams) =>
             xs.merge(mainStream$, ...componentStreams)
         )
        .flatten()

const logY =
  (value:any) => {console.log(value); return value}
const method =
  ()
  ({DOM, onion}) => {
    const subComponents$ =
      onion.state$
        .map(path('subComponents'))
        .compose(dropRepeats())
        .map(values)
        // .map(logY)
        .map(map((component:any) => component({DOM, onion})))
        .debug('suBcomponents')
        // .flatten()

    const subOnion$ =
      subComponents$
        .map(map(path('onion')))
        .debug('subState')

    const subDOM$ =
      subComponents$
        .map(map(path('DOM')))

    return (
      { DOM:
          view
          // ( methodName )
          ( subComponentCombine(onion.state$)(subDOM$)
              .debug('innerState')
          // , map(path('DOM'), argList)
          )
      , onion:
          subComponentMerge(intent(DOM))(subOnion$)
            .debug('onion ping')
          // intent
          // ( DOM
          // // , map(path('onion'), argList)
          // )
      }
    )
  }

export
  { State
  , method
  }
