import { map
       , compose
       } from 'rambda'

import { makeDoAtType
       , Type
       , TypesWithFunctions
       } from '../utils/types'

type methodFn =
  (args:object) => any

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
  (methodFn: methodFn, argsTypes: componentArgs) =>
    (argsMethod: any, methodName: string) => ({[index:string]: any})

const buildMethodWithArgs: buildMethodWithArgs =
  (methodFn, argsTypes) =>
    (argsMethod, methodName) => {
      const buildedArgs =
        map(buildArg(argsTypes), argsMethod)

      return methodFn(buildedArgs)
    }

const setupInterface =
  ({args, methods}:any, methodFn: methodFn, typeWithFunctions: TypesWithFunctions) => {
    const argToTypeFns:any =
      map(makeDoAtType(typeWithFunctions), args)
    const buildedComponents =
      map(buildMethodWithArgs(methodFn, argToTypeFns), methods)

    return buildedComponents
  }
