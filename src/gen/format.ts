import { reduce
       , map
       , Dictionary
       } from 'rambda'

const objReducer =
  (key:string, value:string) =>
    (acc: {[index:string]: any}, curr: {[index:string]: any}) => (
      { ...acc
      , [curr[key]]: curr[value]
      }
    )

const toObject =
  (key:string, value:string) =>
    (arr: any[]) =>
      reduce(objReducer(key, value), {})(arr)


const toObjectArgs =
  toObject('_name', '_types')

const toObjectMethods =
  toObject('_name', '_args')

const toObjectMethodArgs =
  toObject('_name', '_default')

const formatArgs =
  toObjectArgs

const formatMethods =
  (methods: any) => {
    const methodObj = toObjectMethods(methods)
    const methodArgObj =
      map<any, any>
      ( toObjectMethodArgs
      , methodObj
      )

    return methodArgObj
  }

export const format =
  ({args, methods}:any) => (
    { args: formatArgs(args)
    , methods: formatMethods(methods)
    }
  )
