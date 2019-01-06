import { writeFileSync } from 'fs'

const defaultInstapyPath = `${__dirname}/../../InstaPy`

const importInstapy =
  [ 'from instapy import InstaPy'
  , 'from instapy.util import smart_run'
  ]

type Path = string
type Init = string
type PythonMethod = string

const takeSessionName =
  (init: Init) =>
    init.split(' ')[0]

const padLeft4List =
  (inList: string[]) => inList.map((str) => `    ${str}`)

type MakeSmartRun =
  (init: Init, configLines: PythonMethod[]) =>
     PythonMethod[]
const makeSmartRun: MakeSmartRun =
  (init, configLines) =>
    [ `with smart_run(${takeSessionName(init)})`
    , ...padLeft4List(configLines.slice(0, -1))
    ]

type setupCreate =
  (smartRun?: boolean, projectPath?: Path) =>
    (configLines: PythonMethod[], write?: boolean, out?: string) =>
      string

export const setupCreate: setupCreate =
  (smartRun = false, projectPath = defaultInstapyPath) =>
    (configLines, write = false, out = 'docker_quickstart.py') => {
      const [ init, ...configMethods ] = configLines
      console.log(configLines)
      console.log()
      const config =
        [ ...importInstapy
        , '\n'
        , init
        , ...smartRun
          ? makeSmartRun(init, configMethods || [])
          : configMethods || []
        ].join('\n') + '\n'

      if(write) {
        writeFileSync(`${projectPath}/${out}`, config)
      }

      return config
    }
