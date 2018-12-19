import { setupControls } from './src'

const controls = setupControls(`${__dirname}/InstaPy`)

type log = (val:any) => any
const log:log =
  (val) => { console.log(val); return val }

type selfLog = (out:any) => (val:any) => any
const selfLog: selfLog =
  (out) =>
    (val) => { console.log(out); return val }

// controls
//   .start()
//   .then(console.log)
// setTimeout
// ( () => {
//     controls
//       .start()
//       .then(console.log)
//   }
// , 10000
// )

controls
  .logs
  .set((log) => {console.log(log)})
// controls
//   .status
//   .set((status) => {console.log(status)})

setTimeout(() => {}, 100000)
