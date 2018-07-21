import { readFileSync
       , writeFileSync
       } from 'fs'
import { pipe } from 'rambda'

import { trimExcessData } from './trim'
import { extract } from './extract'
import { suplement } from './suplement'

const rawInstapyData =
  readFileSync( `InstaPy/instapy/instapy.py`, 'utf-8')

const genApi =
  (rawInstapy: string) =>
    pipe
    ( trimExcessData
    , extract
    , suplement
    )(rawInstapy)
  // trimExcessData(testArr)
const api = genApi(rawInstapyData)

writeFileSync
( './api.json'
, JSON.stringify(api, null, 2)
)

console.log(api)
// only used for dev:
const sleepWait =
  (internal: number) => setTimeout(sleepWait, internal)

sleepWait(100000)
