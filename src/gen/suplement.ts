import { pipe
       , findIndex
       , map
       , update
       } from 'rambda'

import { Type
       , createType
       } from '../utils/types'

type Arg =
  { _name: string
  , _types: any[]
  }

const longPipe =
  (...pipeFns: any[]) =>
    (val: any):any => {
      const [ pipeFnHead, ...pipeFnTail ] =
        pipeFns.reverse()

      return pipeFnHead === undefined
        ? val
        : pipeFnHead( longPipe(...pipeFnTail.reverse())(val) )
    }

const replaceTypes =
  (name: string, types: Type[]) =>
    (args: Arg[]) => {
      const index =
        findIndex
        ( ({_name}) => _name === name
        , args
        )

      if (index === -1) {
        return args
      } else {
        const updatedArgs =
          update
          ( index
          , ( { _name: name
              , _types: types
              }
            )
          )(args)

        return updatedArgs
      }
    }

const concatTypes =
  (name: string, types: Type[]) =>
    (args: Arg[]) => {
      const index =
        findIndex
        ( ({_name}) => _name === name
        , args
        )

      if (index === -1) {
        return args
      } else {
        const updatedArgs =
          update
          ( index
          , { _name: name
            , _types:
              [ ...args[index]._types
              , ...types
              ]
            }
          )(args)

        return updatedArgs
      }
    }

const stringTypes =
  longPipe
  ( concatTypes
    ( 'username'
    , [ createType.string() ]
    )
  , concatTypes
    ( 'password'
    , [ createType.string() ]
    )
  , concatTypes
    ( 'browser_profile_path'
    , [ createType.string() ]
    )
  , concatTypes
    ( 'proxy_address'
    , [ createType.string() ]
    )
  , concatTypes
    ( 'api_key'
    , [ createType.string() ]
    )
  , concatTypes
    ( 'url'
    , [ createType.string() ]
    )
  , concatTypes
    ( 'campaign'
    , [ createType.string() ]
    )
  )

const arrayTypes =
  longPipe
  ( concatTypes
    ( 'comments'
    , [ createType.array('String') ]
    )
  , concatTypes
    ( 'tags'
    , [ createType.array('String') ]
    )
  , concatTypes
    ( 'users'
    , [ createType.array('String') ]
    )
  , concatTypes
    ( 'words'
    , [ createType.array('String') ]
    )
  , concatTypes
    ( 'friends'
    , [ createType.array('String') ]
    )
  , concatTypes
    ( 'tags_skip'
    , [ createType.array('String') ]
    )
  , concatTypes
    ( 'usernames'
    , [ createType.array('String') ]
    )
  , concatTypes
    ( 'followlist'
    , [ createType.array('String') ]
    )
  , concatTypes
    ( 'locations'
    , [ createType.array('String') ]
    )
  )

const unionTypes =
  pipe
  ( concatTypes
    ( 'media'
    , [ createType.union([ 'Photo', 'Video' ]) ]
    )
  , concatTypes
    ( 'sort'
    , [ createType.union([ 'top', 'random' ]) ]
    )
  , concatTypes
    ( 'style'
    , [ createType.union([ 'FIFO', 'LIFO', 'RANDOM' ]) ]
    )
  , replaceTypes
    ( 'compare_by'
    , [ createType.union([ 'latest', 'earliest', 'day', 'month', 'year' ]) ]
    )
  , replaceTypes
    ( 'compare_track'
    , [ createType.union([ 'first', 'median', 'last' ]) ]
    )
  )

const booleanTypes =
  pipe
  ( concatTypes
    ( 'delimit_by_numbers'
    , [ createType.boolean() ]
    )
  )

// type deepLog = (val:any) => any
// const deepLog: deepLog =
//   (val) => {
//     Array.isArray(val) || typeof val === 'object'
//       ? map(deepLog, val)
//       : console.log(val)
//
//     return val
//   }
//
// type subLog = (prop: string) => (val:any) => any
// const subLog: subLog =
//   (prop) =>
//     (val) => {
//       typeof val === 'object'
//       && val[prop] !== undefined
//         ? console.log(val[prop])
//         : console.log(val)
//
//       return val
//     }

const deepTypes =
  pipe
  ( replaceTypes
    ( 'customList'
    , [ createType
          .array
           ( [ createType.boolean()
             , createType.array('String')
             , createType.union([ 'all', 'nonfollowers' ])
             ]
           ) 
      ]
    )
  , replaceTypes
    ( 'InstapyFollowed'
    , [ createType
          .array
           ( [ createType.boolean()
             , createType.union([ 'all', 'nonfollowers' ])
             ]
           ) 
      ]
    )
  )

type log = (val:any) => any
const log: log =
  (val) => {console.log(val); return val}

// Have no clue on: proxy_chrome_extension

const numberTypes =
  longPipe
  ( concatTypes
    ( 'potency_ratio'
    , [ createType.number({step: 0.01, min: 0}) ]
    )
  , concatTypes
    ( 'unfollow_after'
    , [ createType.number({ step: 1, min: 0}) ]
    )
  , concatTypes
    ( 'min'
    , [ createType.number({ step: 1, min: 0}) ]
    )
  , concatTypes
    ( 'min_followers'
    , [ createType.number({ step: 1, min: 0}) ]
    )
  , concatTypes
    ( 'min_following'
    , [ createType.number({ step: 1, min: 0}) ]
    )
  , concatTypes
    ( 'max'
    , [ createType.number({ step: 1, min: 1}) ]
    )
  , concatTypes
    ( 'max_followers'
    , [ createType.number({ step: 1, min: 1}) ]
    )
  , concatTypes
    ( 'max_following'
    , [ createType.number({ step: 1, min: 1}) ]
    )
  , replaceTypes
    ( 'page_delay'
    , [ createType.number({ step: 1, min: 0}) ]
    )
  , replaceTypes
    ( 'daysold'
    , [ createType.number({ step: 1, min: 0}) ]
    )
  , replaceTypes
    ( 'sleep_delay'
    , [ createType.number({ step: 1, min: 0}) ]
    )
  , replaceTypes
    ( 'follow_likers_per_photo'
    , [ createType.number({ step: 1, min: 0}) ]
    )
  , replaceTypes
    ( 'times'
    , [ createType.number({ step: 1, min: 1}) ]
    )
  , replaceTypes
    ( 'limit'
    , [ createType.number({ step: 1, min: 1}) ]
    )
  , replaceTypes
    ( 'max_pic'
    , [ createType.number({ step: 1, min: 1}) ]
    )
  , replaceTypes
    ( 'photos_grab_amount'
    , [ createType.number({ step: 1, min: 1}) ]
    )
  , replaceTypes
    ( 'posts'
    , [ createType.number({ step: 1, min: 1}) ]
    )
  , replaceTypes
    ( 'proxy_port'
    , [ createType.number({ step: 1, min: 1, max: 65535}) ]
    )
  , replaceTypes
    ( 'percentage'
    , [ createType.number({ step: 1, min: 0, max: 100}) ]
    )
  , replaceTypes
    ( 'amount'
    , [ createType.number({ step: 1, min: 1 })
      , createType.none()
      ]
    )
  )

export const suplement =
  ({methods, args}:any) => (
    { args: // args
      longPipe
      // ( map(log)
      ( stringTypes
      , arrayTypes
      , unionTypes
      , booleanTypes
      , numberTypes
      , deepTypes
      // , map(log)
      // , map(subLog('_types'))
      )(args)
    , methods: methods
    }
  )
