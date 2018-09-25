import { map
       , compose
       } from 'rambda'

import { makeDoAtType
       , Type
       , TypesWithFunctions
       } from '../utils/types'

export type MethodComponent =
  (args: object, methodName: string) => any

export type ArgComponent =
  (_type: any) => any

type BuildComponentArg =
  (argName: string, def: any) => any

type ComponentArgs =
  { [index: string]: BuildComponentArg }

type BuildArg =
  (argsTypes: ComponentArgs) =>
    (def: any, argName: string) => any

const buildArg: BuildArg =
  (argsTypes) =>
    (def: any, argName: string) =>
      argsTypes[argName](def, argName)

type BuildMethodWithArgs =
  (methodComponent: MethodComponent, argsTypes: ComponentArgs) =>
    (argsMethod: any, methodName: string) => ({[index:string]: any})

const buildMethodWithArgs: BuildMethodWithArgs =
  (methodComponent, argsTypes) =>
    (argsMethod, methodName) => {
      const buildedArgs =
        map(buildArg(argsTypes), argsMethod)

      return methodComponent(buildedArgs, methodName)
    }

export const setupArgComponent =
  makeDoAtType

export const setupInterface =
  ( {args, methods}:any
    , methodComponent: MethodComponent
    , argComponent: ArgComponent
  ) => {
    const argToTypeFns:any =
      map(argComponent, args)
    const buildedComponents =
      map(buildMethodWithArgs(methodComponent, argToTypeFns), methods)

    return buildedComponents
  }
