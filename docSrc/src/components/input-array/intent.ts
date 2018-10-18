// intent
import xs, { Stream } from 'xstream'
import { DOMSource } from '@cycle/dom'

import { State, Reducer } from './types'

import { path
       , replace
       , split
       , equals
       , reject
       , compose
       , map
       } from 'rambda'

const defaultState: State =
  { name: ''
  , value: []
  , _default: []
  }

type FilterOut =
  (match:string) => (inArr:string[]) => string[]

const filterOut: FilterOut =
  compose<any, any, any>
  ( reject
  , equals
  )

const intent =
  (DOM: DOMSource) => {
    const init$ =
      xs
        .of<Reducer>
         ( (prev) => (
             { ...defaultState
             , ...prev
             }
           )
         )

    const input$ =
      DOM
        .select('textarea')
        .events('input')
        .map(path('target.value'))
        .map(replace(/#/g, ' #'))
        .map(split(' '))
        .map(filterOut(''))
        .map(filterOut('#'))
        .map
         ( (newValue) =>
             (prevState) => (
               { ...prevState
               , value: newValue
               }
             )
         )

    return xs.merge(init$, input$)
  }

export
  { intent
  }
