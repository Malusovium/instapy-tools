import xs, { Stream } from 'xstream'
import { div
       , VNode
       , DOMSource
       } from '@cycle/dom'
import { StateSource } from 'cycle-onionify'
import isolate from '@cycle/isolate'

import { BaseSources, BaseSinks } from '../interfaces'

import { style } from 'typestyle'

import { values
       , compose
       , map
       , path
       // , pick
       , Dictionary
       // , toArray
       } from 'rambda'

const toArray =
  (input) => [...input]

export interface Sources extends BaseSources {
  onion: StateSource<State>
}
export interface Sinks extends BaseSinks {
  onion: Stream<Reducer>
}

// State
export interface State {
  count: number
}
export const defaultState: State =
  { count: 5
  }
export type Reducer = (prev: State) => State;

export const SimpleArgComponent =
  (def, name) =>
    isolate
    ( ({DOM, onion}) => (
        { DOM: xs.of(div(name + ': arg input' + '\n' + 'default Input: ' + def))
        , onion: xs.of( (prev) => prev )
        }
      )
    , name
    )
// {[index:string]: (sources: any) => ({onion: any, DOM: any})}

export const Method =
  (args: any, methodName) =>
    isolate
    ( ({DOM, onion}) => {
        const argsList: Dictionary<any> =
          compose
          ( map((component: any) => component({DOM, onion}))
          , values
          )(args)

        // console.log(map(path('DOM'), argsList))
        // console.log(argsList)
        return (
          { DOM:
              view
              ( onion.state$
                  .debug('component?')
              , map(path('DOM'), argsList)
              )
          , onion: xs.of( (prev) => ({ count: 20}))
                      .debug('something')
              // actions
              // ( DOM
              // , map(path('onion'), argsList)
              // )
          }
        )
      }
    , methodName
    )

const actions =
  (DOM: DOMSource, args) => {
    const init$ = xs.of<Reducer>( (prev) => prev ? prev : defaultState )

    return xs.merge
              ( init$
              // , ...args
              )
  }

const view =
  (state$, args) =>
    xs.combine(state$, ...args)
    // state$
    // xs.combine(...args)
      .map
       // ( (divList) => {
       ( ([state, ...divList]) => {
           console.log(divList)
           return div(divList)
         }
       )
