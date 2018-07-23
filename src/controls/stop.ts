import { composeExec } from './utils'

export const stop =
  (projectPath: string) =>
    composeExec(projectPath)('stop')

