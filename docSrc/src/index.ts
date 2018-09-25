import xs, { Stream } from 'xstream';
import { makeDOMDriver } from '@cycle/dom';
import onionify from 'cycle-onionify';

import { Component } from './interfaces'

import { setup, run } from '@cycle/run';

import { App
       } from './components/app';

const main: Component = onionify(App);

run(main, { DOM: makeDOMDriver('#app') })
