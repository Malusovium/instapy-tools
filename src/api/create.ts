import { writeFileSync } from 'fs'

const defaultInstapyPath = `${__dirname}/../../InstaPy`

const makeHeadTmpl = `
from instapy import InstaPy
`

type setupCreate =
  (projectPath?: string) =>
    (configLines: string[], write?: boolean, out?: string) =>
      string

export const setupCreate: setupCreate =
  (projectPath = defaultInstapyPath) =>
    (configLines, write = false, out = 'docker_quickstart.py') => {
      const config =
        [ makeHeadTmpl
        , ...configLines
        ].join('\n') + '\n'

      if(write) {
        writeFileSync(`${projectPath}/${out}`, config)
      }

      return config
    }
