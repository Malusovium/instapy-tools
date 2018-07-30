import { pipe
       , Dictionary
       , pluck
       , uniq
       , update
       , map
       , findIndex
       , take
       , includes
       , reduce
       , flatten
       , reject
       , equals
       , reverse
       , drop
       , contains
       , split
       , join
       } from 'rambda'

import { mergeWithLastWhen
       } from './reducers'

import { createType } from './types'

type MethodLine = string

type Arg =
  { _name: string
  , _types: string[]
  }

type MethodArg =
  { _name: string
  , _default: string
  }

type Method =
  { _name: string
  , _args: MethodArg[]
  }

const log =
  (val:any) => {console.log(val); return val}

const dropMethodName =
  pipe
  ( split('(')
  , drop(1)
  , join('(')
  )

const trimArgs =
  pipe
  ( split('')
  , reverse
  , drop(2)
  , reverse
  , join('')
  )

const extractArgName =
  (arg: string) =>
    includes('=', arg)
      ? pipe
        ( split('=')
        , take(1)
        , join('')
        )(arg)
      : arg

const argDefault =
  (arg: string) =>
    includes('=', arg)
      ? pipe
        ( split('=')
        , reverse
        , take(1)
        , join('')
        )(arg)
      : 'None'

const extractArg =
  (arg: string) => (
    { _name: extractArgName(arg)
    , _default: argDefault(arg)
    }
  )

const formatArg =
  pipe
  ( reject<any>(equals('self'))
  , reject<any>(equals('**kwargs'))
  , map(extractArg)
  )

const extractMethodArgs =
  (methodLine: MethodLine):any =>
    pipe
    ( dropMethodName
    , trimArgs
    , split(', ')
    , reduce
      ( mergeWithLastWhen
        ( '=('
        , ')'
        , ', '
        )
      , []
      )
    , formatArg
    )(methodLine)

const isString =
  (def: string) =>
    def.startsWith(`'`)
    && def.endsWith(`'`)

const isNumber =
  (def: any) =>
    !isNaN(def)

const isArray =
  (def: string) =>
    def.startsWith('[')
    && def.endsWith(']')

const isBoolean =
  (def: string) =>
    def === 'True'
    || def === 'False'

const isNone =
  (def: string) =>
    def === 'None'

const extractType =
  (def: string) =>
    isNone(def) ? createType.none()
    : isBoolean(def) ? createType.boolean()
    : isString(def) ? createType.string()
    : isNumber(def) ? createType.number()
    : isArray(def) ? createType.array('String')
    : 'NAT'

const replaceDefaultType =
  ({_name, _default}: MethodArg) => (
    { _name: _name
    , _types: [ extractType(_default) ]
    }
  )

const concatTypes =
  (acc: any[], curr: Arg): any => {
    const index =
      findIndex
      ( ({_name}: Arg) => _name === curr._name
      , acc
      )

    return index === -1
      ? [ ...acc, curr ]
      : update
        ( index
        , { _name: curr._name
          , _types:
            uniq
            ( [ ...acc[index]._types
              , ...curr._types
              ]
            )
          }
        , acc
        )
  }

const extractArgs =
  (methodLines: MethodLine[]) =>
    pipe
    ( map(extractMethodArgs)
    , flatten
    , map<any, any>(replaceDefaultType)
    , reduce(concatTypes, [])
    // , map(log)
    )(methodLines)

const extractMethodName =
  (methodLine: MethodLine) =>
    pipe
    ( split('(')
    , take(1)
    , join('')
    )(methodLine)

const formatMethod = // Method
  (methodLine: MethodLine): any => (
    { _name: extractMethodName(methodLine)
    , _args: extractMethodArgs(methodLine)
    }
  )

const isName =
  (name:string) =>
    ({_name}: Method | Arg) =>
      _name === name

const replaceNameMethod =
  (fn: (val:any) => string ) =>
    ({_name, _args }: Method) => (
      { _name: fn(_name)
      , _args
      }
    )

const extractMethods =
  (methodLines: MethodLine[]) =>
    pipe
    ( map(formatMethod)
    , reject(isName('like_by_feed'))
    , map
      ( replaceNameMethod
        ( (_name) =>
            _name === 'like_by_feed_generator'
              ? 'like_by_feed'
              : _name
        )
      )
    )(methodLines)

export const extract =
  (methodLines: MethodLine[]) => (
    { args: extractArgs(methodLines)
    , methods: extractMethods(methodLines)
    }
  )
