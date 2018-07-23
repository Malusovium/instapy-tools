import { genApi
       } from './src'

import { writeFileSync } from 'fs'

const api = genApi('./InstaPy')

writeFileSync
( './api.json'
, JSON.stringify( api, null, 2)
)

if (process.env.NODE_ENV === 'test') {
  const sleepWait =
    (internal: number) => setTimeout(sleepWait, internal)

  sleepWait(100000)
}
