import { prettyBotStatus } from './status'
import { start } from './start'
import { stop } from './stop'
import { logs } from './logs'

const defaultInstapyPath = `${__dirname}/../../InstaPy`
console.log(defaultInstapyPath)

type controls =
  (projectPath?:string) => (
    { start: () => Promise<string>
    , stop: () => Promise<string>
    , status: () => Promise<string>
    , logs: () => Promise<string[]>
    }
  )

export const controls: controls =
  (projectPath = defaultInstapyPath) => (
    { start: () => start(projectPath)
    , stop: () => stop(projectPath)
    , logs: () => logs(projectPath)
    , status: () => prettyBotStatus(projectPath)
    }
  )
