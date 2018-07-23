import { prettyBotStatus } from './status'
import { start } from './start'
import { stop } from './stop'
import { logs } from './logs'

type log = (val:any) => any
const log:log =
  (val) => { console.log(val); return val }

type selfLog = (out:any) => (val:any) => any
const selfLog: selfLog =
  (out) =>
    (val) => { console.log(out); return val }

const PROJECT_PATH = 'InstaPy'

// prettyBotStatus(PROJECT_PATH)
//   .then(selfLog('prettyBot'))
//   .then(log)
//   .then(selfLog('\n'))
//
// start(PROJECT_PATH)
//   .then(selfLog('start'))
//   .then(log)
//   .then(selfLog('\n'))

// stop(PROJECT_PATH)
//   .then(selfLog('stop'))
//   .then(log)
//   .then(selfLog('\n'))

// logs(PROJECT_PATH)
//   .then(selfLog('logs'))
//   .then(log)
//   .then(selfLog('\n'))
