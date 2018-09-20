import { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';

export type Component = (s: BaseSources) => BaseSinks;

export interface BaseSources {
  DOM: DOMSource
}

export interface BaseSinks {
  DOM?: Stream<VNode>
}
