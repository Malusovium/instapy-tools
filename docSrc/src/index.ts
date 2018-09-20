import xs, { Stream } from 'xstream';
import { makeDOMDriver } from '@cycle/dom';
import onionify from 'cycle-onionify';

import { setup, run } from '@cycle/run';

import { App } from './components/app';

const main = onionify(App);

run(main, { DOM: makeDOMDriver('#app') })
