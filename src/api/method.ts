import { is
       , values
       , identity
       , ifElse
       , compose
       , map
       , join
       } from 'rambda'

import { makeDoAtType
       , TypesWithFunctions
       , Type
       , Num
       , Union
       , Arr
       , Tuple
       } from '../utils/types'

type MethodName = string
type MethodArgs =
  { [index:string]: any }

// const execFnVal =
//   ([fn, val]: [any, (val:any) => string]) =>
//     fn(val)

const execFnVal =
  ([val, fn]: [any, (val:any) => string]) =>
    fn(val)

const addQuotes =
  (quoteChar: string, closeQoute?: string) =>
    (str: string) =>
      `${quoteChar}${str}${(closeQoute ? closeQoute : quoteChar)}`

const addSingleQuotes =
  addQuotes(`'`)

const addBrackets =
  addQuotes('[', ']')

const addParenthesis =
  addQuotes('(', ')')

const toNone =
  () => 'None'

const toBool =
  (bool: boolean) => bool ? 'True' : 'False'

const toString =
  (str: string) => addSingleQuotes(str)

const toNumber =
  (_: Num["_constraints"]) =>
    (num: number) => `${num}`

const toPythonVal =
  (val: any) =>
    (val === null) ? toNone()
    : is(Boolean, val) ? toBool(val)
    : is(String, val) ? toString(val)
    : is(Number, val) ? toNumber({})(val)
    : is(Array, val) ? toArray('String')(val)
    : toNone()

const toUnion =
  (_: Union["_options"]) =>
    (union: any) =>
      toPythonVal(union)

const toArray =
  (_: Arr["_subType"]) =>
    (arr: string[] | number[]) =>
      compose
      ( addBrackets
      , join(', ')
      , ifElse
        ( is(String, arr[0])
        , map<any, any>(addSingleQuotes)
        , identity
        )
      )(arr)

const toTuple =
  (_subTypes: Tuple["_subTypes"]) =>
    (arr: any[]) =>
      compose
      ( addParenthesis
      , join(', ')
      , map<any, any>(toPythonVal)
      )(arr)

const argVal =
  makeDoAtType
  ( { _default: () => `Can't compute`
    , none: toNone
    , boolean: toBool
    , string: toString
    , number: toNumber
    , union: toUnion
    , array: toArray
    , tuple: toTuple
    }
  )

const affix =
  (str1: string) =>
    (str2: string) =>
      `${str1}${str2}`

const doth =
  (fn: any) =>
    (val:any) => { fn(val); return val}

const arg =
  (apiJsonArgs: any) =>
    (val: any, argName: string) =>
      compose
      ( affix(argName)
      , affix('=')
      , argVal(apiJsonArgs[argName])
      )(val)

const log =
  (val:any) => {
    console.log(val)
    return val
  }

const toPythonArgs =
  (apiJsonArgs: any) =>
    (args: MethodArgs) =>
      compose
      ( addParenthesis
      , join(', ')
      , log
      , values
      , map<any, any>(arg(apiJsonArgs))
      )(args)

export const setupMethod =
  (apiJsonObj:any, session: string = 'session') =>
    ({name, args}: {name: string, args: MethodArgs}): string =>
      compose
      ( ifElse
        ( name === '__init__'
        , compose
          ( affix(session)
          , affix(' = ')
          , affix('InstaPy')
          )
        , compose
          ( affix(session)
          , affix('.')
          , affix(name)
          )
        )
      , toPythonArgs(apiJsonObj.args)
      )(args)
