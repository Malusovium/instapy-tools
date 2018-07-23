import { split
       , reverse
       , takeLast
       } from 'rambda'
import { composeExec } from './utils'

// const revArr =
//   (arr: any[]) =>
//     arr.reduce
//     ( (arr, curr) => [...arr, curr], [])
//
// const splitStringAt =
//   (delimiter: string) =>
//     (str: string) =>
//       str.split(delimiter)
//
// const takeLastN =
//   (n: number) =>
//     (arr:string[]) =>
//       (arr.length <= n)
//         ? arr
//         : arr
//             .reverse()
//             .slice(0, n)
//             .reverse()

export const logs =
  (projectPath:string) =>
    composeExec(projectPath)('logs', 'web')
      .then(split('\n'))
      .then<any>(takeLast(30))

