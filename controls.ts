import { controls } from './src'

const { start, stop, status, logs } = controls()

type log = (val:any) => any
const log:log =
  (val) => { console.log(val); return val }

type selfLog = (out:any) => (val:any) => any
const selfLog: selfLog =
  (out) =>
    (val) => { console.log(out); return val }

start()
  .then(selfLog('start'))
  .then(log)
  .then(selfLog('\n'))

