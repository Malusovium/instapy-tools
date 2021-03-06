import { execSync } from 'child_process'
import { readFileSync } from 'fs'

import { pipe } from 'rambda'

import { trimExcessData } from './trim'
import { extract } from './extract'
import { suplement } from './suplement'
import { format } from './format'

const defaultInstapyPath = `${__dirname}/../../InstaPy`

const getInstapyHash =
  (projectPath: string) =>
    execSync(`cd ${projectPath}; git rev-parse HEAD`)
      .toString('utf8')
      .split('\n')[0]

const addGitHash =
  (projectPath: string) =>
    (api: any) => (
      { git: getInstapyHash(projectPath)
      , ...api
      }
    )

const getRawInstapy =
  (projectPath: string) =>
    readFileSync( `${projectPath}/instapy/instapy.py`, 'utf-8')

export const genApi =
  (projectPath: string = defaultInstapyPath) =>
    pipe
    ( trimExcessData
    , extract
    , suplement
    , format
    , addGitHash(projectPath)
    )(getRawInstapy(projectPath))
