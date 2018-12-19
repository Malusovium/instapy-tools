import { composeExec } from './utils'

export const start =
  (projectPath: string) =>
    composeExec(projectPath)('up', '-d', '--build')
      .then( () => 'Bot started')
