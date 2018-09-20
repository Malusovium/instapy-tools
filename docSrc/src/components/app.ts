import xs, { Stream } from 'xstream'
import { div
       , VNode
       , DOMSource 
       } from '@cycle/dom'
import { StateSource } from 'cycle-onionify'
import isolate from '@cycle/isolate'

import { BaseSources, BaseSinks } from '../interfaces'

// Typestyle setup
import { setupPage, normalize } from 'csstips'
normalize()
setupPage('#app')

import * as api from '../../../lib'

export interface Sources extends BaseSources {
  onion: StateSource<State>
}
export interface Sinks extends BaseSinks {
  onion?: Stream<Reducer>
}

// State
export interface State {
}
export const defaultState: State = {
  counter: { count: 5 },
};
export type Reducer = (prev?: State) => State | undefined;

export function App(sources: Sources): Sinks {
  const initReducer$ = xs.of<Reducer>(
    prevState => (prevState === undefined ? defaultState : prevState)
  )

  // const { setupArgComponent, raw } = api
  // const { raw } = api
  console.log(api)
  // console.log(typeof setupArgComponent)

  return {
    DOM: xs.of(div('hi'))
    // DOM: xs.of(div(api.raw === undefined ? 'Undefined': 'Is somthing'))
  }
}
