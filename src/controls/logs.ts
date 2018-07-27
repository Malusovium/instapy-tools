import { split
       , reverse
       , takeLast
       } from 'rambda'
import { composeExec } from './utils'

export const logs =
  (projectPath:string) =>
    composeExec(projectPath)('logs', 'web')
      .then(split('\n'))
      .then<any>(takeLast(30))

