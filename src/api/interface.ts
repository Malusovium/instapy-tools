import { map
       , compose
       } from 'rambda'

import { makeDoAtType
       , Type
       , TypesWithFunctions
       } from '../utils/types'

type methodComponent =
  (args:object) => any

type argComponent =
  (_type: any) => any

type buildComponentArg =
  (argName: string, def: any) => any

type componentArgs =
  { [index: string]: buildComponentArg }

type buildArg =
  (argsTypes: componentArgs) =>
    (def:any, argName: string) => any

const buildArg: buildArg =
  (argsTypes) =>
    (def:any, argName: string) =>
      argsTypes[argName](argName, def)

type buildMethodWithArgs =
  (methodComponent: methodComponent, argsTypes: componentArgs) =>
    (argsMethod: any, methodName: string) => ({[index:string]: any})

const buildMethodWithArgs: buildMethodWithArgs =
  (methodComponent, argsTypes) =>
    (argsMethod, methodName) => {
      const buildedArgs =
        map(buildArg(argsTypes), argsMethod)

      return methodComponent(buildedArgs)
    }

export const setupArgComponent =
  makeDoAtType

export const setupInterface =
  ( {args, methods}:any
    , methodComponent: methodComponent
    , argComponent: argComponent
  ) => {
    const argToTypeFns:any =
      map(argComponent, args)
    const buildedComponents =
      map(buildMethodWithArgs(methodComponent, argToTypeFns), methods)

    return buildedComponents
  }
