import { dropLast
       , filter
       , drop
       , join
       , reduce
       , map
       , pipe
       , split
       , type
       , not
       } from 'rambda'

import { mergeWithLastWhen
       } from './reducers'

type RawInstapy = string
type RawInstapyLine = string

type RawInstapyMethod = string

const isRawInstapyMethod =
  (rawInstapyLine: RawInstapyLine) =>
    rawInstapyLine.startsWith('    def') // 4

const toOneLineMethod =
  mergeWithLastWhen
  ( '('
  , '):'
  , ''
  , isRawInstapyMethod
  )
  // (acc:string[], curr:string) =>
  //   acc.length > 0
  //   && isRawInstapyMethod(acc[acc.length - 1])
  //   && acc[acc.length - 1].includes('(')
  //   && not( acc[acc.length - 1].endsWith('):') )
  //     ? [ ...dropLast(1, acc), `${acc[acc.length - 1]}${curr}` ]
  //     : [ ...acc, curr ]

const isNConsecutiveTimes =
  (char: string, arr: string[], index: number = 0) => {
    const rec: any = (n: number) =>
       n < 0
        ? true
        : index + 1 - n <= 0
          ? false
          : arr[index - n] !== char
            ? false
            : rec(n - 1)

    return rec
  }

const maxConsecutive =
  (checkString: string, n: number = 1) =>
    (acc:string[], curr:string, index: number, arr:string[]) => {
      return isNConsecutiveTimes(checkString, arr, index)(1)
        ? acc
        : [ ...acc, curr ]
    }

const trimExcessWhiteSpace =
  (str: string): any =>
    str.split('')
      .reduce(maxConsecutive(' '), [])
      .join('')

const isString =
  (val:any) =>
    type(val) === 'String'

const dropDef =
  (str: string) =>
    pipe
    ( split('')
    , drop(5)
    , join('')
    )(str)

export const trimExcessData =
  (rawInstapy: RawInstapy): any =>
    pipe
    ( split('\n')
    , reduce(toOneLineMethod, [])
    , filter(isString)
    , filter(isRawInstapyMethod)
    , map(trimExcessWhiteSpace)
    , map(dropDef)
    )(rawInstapy)
