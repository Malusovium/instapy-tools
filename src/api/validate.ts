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
  { [index: string]: Type
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

const typeToValidator =
  (type: Type) =>
    makeValidation(type)

const argTypeToValidator =
  (apiArgs: ApiArgs) =>
    map(typeToValidator, apiArgs)

const pickArgTypeValidators =
  (apiArgs: ApiArgs) =>
    (argsToPick: string[]) =>
      compose
      ( pick(argsToPick)
      , argTypeToValidator
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

const logIt = (val:any) => { console.log(val); return val }

export const setupValidateMethod =
  (apiJsonObj:any) =>
    ({name, args}: {name: string, args: MethodArgs}): boolean =>  {
      const pickedMethodArgs: any =
        compose
        ( pickArgTypeValidators(apiJsonObj.args)
        , keys
        , path(`methods.${name}`)
        )(apiJsonObj)

      if (allArgsExistOnMethod(pickedMethodArgs, args)) {
        const validatedList =
          compose
          ( reduce(gotBool(false), true)
          // , logIt
          , values
          , map( (val:any, key:string) => pickedMethodArgs[key](val))
          )(args)

        return validatedList
      } else {
        return false
      }
    }

