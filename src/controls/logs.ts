import { split
       , join
       , tail
       , map
       , reduce
       , startsWith
       , filter
       , compose
       , toString
       , type as rType
       } from 'rambda'
import { composeSpawn } from './utils'

const takeFrom =
  (char: string) =>
    reduce
    ( (acc, curr) =>
        acc.length > 0
          ? [ ...acc, curr ]
          : curr === char
              ? [ curr ]
              : []
    , []
    )

const removeServicePrefix =
  (log:string) =>
    startsWith('web', log)
      ? compose<any, any, any, any, any>
        ( join('')
        , tail
        , takeFrom('|')
        , split('')
        )(log)
      : log

const logs =
  (projectPath:string) =>
    (cb: (log:string) => void) => {
      const logger =
        composeSpawn
        (projectPath)
        ('logs', '-f', '--no-color', 'web')

      logger
        .stdout
        .on
         ( 'data'
         , (data) => {
             compose
             ( map<any, any>(cb)
             // , map<any, any>(removeServicePrefix)
             , filter((log) => log !== '')
             , split('\n')
             , toString
             )(data)
           }
         )
    }

export
  { logs
  }
