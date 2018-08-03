type MethodName = string
type MethodArgs =
  { [index:string]: any }

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

const typeValidator =
  (types: any) =>

const validations =
  [ () => true
  , () => false
  ]

export const validateMethod =
  (apiJsonObj:any) =>
    (methodName: string, args: MethodArgs): boolean =>
      false

