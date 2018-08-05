import { map
       , values
       , reduce
       , pick
       , path
       , compose
       , anyPass
       } from 'rambda'

import { Type
       , makeValidation
       } from '../utils/types'

type ApiArgs =
  { [index: string]: Type[]
  }

type MethodName = string
type MethodArgs =
  { [index:string]: any }

const gotBool =
  (bool: boolean) =>
    (acc: boolean, curr: boolean) =>
      curr === bool ? bool : acc

const exists =
  (apiJsonObj:any) => (
    { arg:
        (name: string): boolean =>
          apiJsonObj.args[name] !== undefined
    , method:
        (name: string): boolean =>
          apiJsonObj.method[name] !== undefined
    }
  )

const typesToValidator =
  (types: Type[]) =>
    compose
    ( anyPass
    , map<any, any>(makeValidation)
    )(types)

const argTypesToValidators =
  (apiArgs: ApiArgs) =>
    map(typesToValidator, apiArgs)

const pickArgTypeValidators =
  (apiArgs: ApiArgs) =>
    (argsToPick: string[]) =>
      compose
      ( pick(argsToPick)
      , argTypesToValidators
      )(apiArgs)

const allArgsExistOnMethod =
  (pickedArgs: MethodArgs, args: MethodArgs) =>
    compose
    ( reduce
      ( (acc: boolean, curr:string) =>
          path(curr, pickedArgs) === undefined
            ? false
            : acc
      , true
      )
    , keys
    )(args)

const keys =
  (obj:any) => Object.keys(obj)

export const setupValidateMethod =
  (apiJsonObj:any) =>
    (methodName: MethodName, args: MethodArgs): boolean =>  {
      const pickedMethodArgs: any =
        compose
        ( pickArgTypeValidators(apiJsonObj.args)
        , keys
        , path(`methods.${methodName}`)
        )(apiJsonObj)

      console.log(pickedMethodArgs)
      if (allArgsExistOnMethod(pickedMethodArgs, args)) {
        const validatedList =
          compose
          ( reduce(gotBool(false), true)
          , values
          , map( (val:any, key:string) => pickedMethodArgs[key](val))
          )(args)

        return validatedList
      } else {
        return false
      }
    }

