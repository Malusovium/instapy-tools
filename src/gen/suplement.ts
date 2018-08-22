import { pipe
       , Dictionary
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

const to1Type =
  (arr: Type[]) =>
    arr.length === 0 ? undefined
    : arr.length === 1 ? arr[0]
    : createType.union(arr)

const topLevelType =
  ({_name, _types}: Arg) => (
    { _name: _name
    , _type: to1Type(_types)
    }
  )

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
  , replaceTypes
    ( 'selenium_url'
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
  , replaceTypes
    ( 'sort'
    , [ createType.union([ 'top', 'random' ]) ]
    )
  , replaceTypes
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

const tupleTypes =
  pipe
  ( replaceTypes
    ( 'customList'
    , [ createType
          .tuple
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
          .tuple
           ( [ createType.boolean()
             , createType.union([ 'all', 'nonfollowers' ])
             ]
           ) 
      ]
    )
  )

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

const suplementTypes =
  longPipe
  ( stringTypes
  , arrayTypes
  , unionTypes
  , booleanTypes
  , numberTypes
  , tupleTypes
  )

const suplementArgs =
  pipe
  ( suplementTypes
  , map(topLevelType)
  )

export const suplement =
  ({methods, args}:any) => (
    { args: suplementArgs(args)
    , methods: methods
    }
  )
