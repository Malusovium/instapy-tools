import { prettyBotStatus } from './status'
import { start } from './start'
import { stop } from './stop'
import { logs } from './logs'

const defaultInstapyPath = `${__dirname}/../../InstaPy`

// type controls =
//   (projectPath?:string) => (
//     { start: () => Promise<string>
//     , stop: () => Promise<string>
//     , status: () => Promise<string>
//     , logs: () => Promise<string[]>
//     }
//   )
type Watch =
  <T>(args: T) => void
type Watcher =
  { set: (watch: Watch) => void
  , reset: () => void
  }

type ControlManagerMethods =
  { start: () => Promise<string>
  , stop: () => Promise<string>
  , logs: Watcher
  , status: Watcher
  }

type SetupControls =
  (projectPath: string) => ControlManagerMethods
const setupControls: SetupControls =
  (projectPath) => {
    let botStatus = 'idle'
    let watchBotLogs: Watch | null = null
    let watchBotStatus: Watch | null = null

    const _start =
      () => start(projectPath)
    const _stop =
      () => stop(projectPath)
    const _status =
      () => {
        if (typeof watchBotStatus === 'function') {
          watchBotStatus(botStatus)
        }
      }
    const _logs =
      () => {
        logs
        (projectPath)
        ( (log) => {
            if (typeof watchBotLogs === 'function') {
              watchBotLogs(log)
            }
          }
        )
      }

    const _updateBotStatus =
      () => {
        setTimeout
        ( () => {
            prettyBotStatus(projectPath)
              .then
               ( (newBotStatus: string) => {
                   if (newBotStatus !== botStatus) {
                     botStatus = newBotStatus
                     _status()
                   }
                 }
               )
              .then(_updateBotStatus)
          }
        , 100
        )
      }

    _updateBotStatus()

    return (
      { start: _start
      , stop: _stop
      , logs:
        { set:
            (watch) => {
              watchBotLogs = watch
              // console.log('seter')
              _logs()
            }
        , reset:
            () => {
              watchBotLogs = null
            }
        }
      , status:
        { set:
            (watch) => {
              watchBotStatus = watch
              _status()
            }
        , reset:
            () => {
              watchBotStatus = null
            }
        }
      }
    )
  }

export
  { setupControls
  }

// export const controls: controls =
//   (projectPath = defaultInstapyPath) => (
//     { start: () => start(projectPath)
//     , stop: () => stop(projectPath)
//     , logs: () => logs(projectPath)
//     , status: () => prettyBotStatus(projectPath)
//     }
//   )
