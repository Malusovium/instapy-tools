import { readFileSync
       , writeFileSync
       } from 'fs'
import { execSync } from 'child_process'

import { pipe } from 'rambda'

import { trimExcessData } from './trim'
import { extract } from './extract'
import { suplement } from './suplement'

const rawInstapyData =
  readFileSync( `InstaPy/instapy/instapy.py`, 'utf-8')

const getInstapyHash =
  () =>
    execSync('cd InstaPy; git rev-parse HEAD')
      .toString('utf8')
      .split('\n')[0]

const addGitHash =
  (api: any) => (
    { git: getInstapyHash()
    , ...api
    }
  )

export const genApi =
  (rawInstapy: string) =>
    pipe
    ( trimExcessData
    , extract
    , suplement
    , addGitHash
    )(rawInstapy)

const api = genApi(rawInstapyData)

// writeFileSync
// ( './api.json'
// , JSON.stringify( api, null, 2)
// )

// console.log(api)
// only used for dev:
const sleepWait =
  (internal: number) => setTimeout(sleepWait, internal)

sleepWait(100000)
