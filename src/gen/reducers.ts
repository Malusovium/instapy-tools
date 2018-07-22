import { dropLast
       , not
       } from 'rambda'

export const mergeWithLastWhen =
  ( has:string
  , ends: string
  , joinWith: string
  , checkLastFn = (last:any) => true
  ) =>
    (acc:string[], curr:string) =>
      acc.length > 0
      && checkLastFn(acc[acc.length - 1])
      && acc[acc.length - 1].includes(has)
      && not( acc[acc.length - 1].endsWith(ends) )
        ? [ ...dropLast(1, acc)
          , `${acc[acc.length - 1]}${joinWith}${curr}` 
          ]
        : [ ...acc, curr ]
