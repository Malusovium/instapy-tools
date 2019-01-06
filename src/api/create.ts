import { writeFileSync } from 'fs'

const defaultInstapyPath = `${__dirname}/../../InstaPy`

const importInstapy =
  [ 'from instapy import InstaPy'
  , 'from instapy.util import smart_run'
  ]

type Path = string
type PythonMethod = string

const takeSessionName =
  (configLine: PythonMethod) =>
    configLine.split('.')[0]

type MakeSmartRun =
  (configLines: PythonMethod[]) =>
     PythonMethod[]
const makeSmartRun: MakeSmartRun =
  (configLines) =>
    [ `with smart_run(${takeSessionName(configLines[0])}`
    , ...configLines.slice(0, -1)
    ]

type setupCreate =
  (projectPath?: Path, smartRun?: boolean) =>
    (init:PythonMethod, configLines: PythonMethod[], write?: boolean, out?: string) =>
      string

export const setupCreate: setupCreate =
  (projectPath = defaultInstapyPath, smartRun = false) =>
    (init, configLines, write = false, out = 'docker_quickstart.py') => {
      const config =
        [ ...importInstapy
        , '\n'
        , init
        , ...smartRun
          ? makeSmartRun(configLines)
          : configLines
        ].join('\n') + '\n'

      if(write) {
        writeFileSync(`${projectPath}/${out}`, config)
      }

      return config
    }
