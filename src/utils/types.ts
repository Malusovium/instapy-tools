import { Dictionary
       , is
       , contains
       , zip
       , reduce
       , map
       , compose
       }  from 'rambda'

export type None =
  { _name: 'None' }

export type Bool =
  { _name: 'Boolean' }

export type Num =
  { _name: 'Number'
  , _constraints:
    { _min?: number
    , _max?: number
    , _step?: number
    }
  }

export type Str =
  { _name: 'String' }

export type Arr =
  { _name: 'Array'
  , _subTypes: Type[] | 'Number' | 'String'
  }

export type Union =
  { _name: 'Union'
  , _options: any[]
  }

export type Tuple =
  { _name: 'Tuple'
  , _options: any[]
  }

export type Type =
  None
  | Bool
  | Num
  | Str
  | Arr
  | Union
  // | Tuple

const ifValExists =
  (prop: string, val?: any) => 
    val === undefined
      ? ({})
      : ({ [prop]: val })

export const createType =
  { none:
      (): None => ({ _name: 'None' })
  , boolean:
      (): Bool => ({ _name: 'Boolean' })
  , string:
      (): Str => ({ _name: 'String' })
  , number:
      ( { step
        , min
        , max
        }:
        { step?: number
        , min?: number
        , max?: number
        } = {}
      ): Num => (
        { _name: 'Number'
        , _constraints:
          { ...ifValExists('_step', step)
          , ...ifValExists('_min', min)
          , ...ifValExists('_max', max)
          }
        }
      )
  , array:
      ( types: Type[] | 'String' | 'Number'
      ): Arr => (
        { _name: 'Array'
        , _subTypes: types
        }
      )
  , union:
      ( options: any[]
      ): Union => (
        { _name: 'Union'
        , _options: options
        }
      )
  }

type TypeValidator =
  (val: any) => boolean

const isTypeReducer =
  (_type: 'String' | 'Number') =>
    (acc: boolean, curr:any) =>
      is(_type === 'String' ? String : Number, curr)
        ? acc
        : false

const gotBool =
  (bool: boolean) =>
    (acc: boolean, curr: boolean) =>
      curr === bool ? bool : acc

const executeValFunc =
  ([val, func]: [any, (val:any) => boolean]) =>
    func(val)

const validateNone: TypeValidator =
  (val) => val === 'None'

const validateBoolean: TypeValidator =
  (val) => is(Boolean, val)

const validateString: TypeValidator =
  (val) => is(String, val)

const validateNumber =
  ({ _step, _min, _max}: Num["_constraints"] ): TypeValidator =>
    (val) =>
      is(Number, val)
      && (_step === undefined || val % _step === 0)
      && (_min === undefined || val > _min)
      && (_max === undefined || val < _max)

const validateArray =
  (typeList: Arr["_subTypes"]): TypeValidator =>
    (val) => {
      if (val.length === typeList.length) {
        return false
      } else if (typeList === 'String') {
        return val.reduce(isTypeReducer('String'), true)
      } else if(typeList === 'Number') {
        return val.reduce(isTypeReducer('Number'), true)
      } else {
        return compose
               ( reduce
                 ( gotBool(false)
                 , true
                 )
               , map<any, any>(executeValFunc)
               , zip<any>(val)
               , map<any, any>(makeValidation)
               )(typeList)
      }
    }
const validateUnion =
  (options: Tuple["_options"]): TypeValidator =>
    (val) =>
      contains(val, options)

export const makeValidation =
  (_type: Type) =>
    _type._name === 'None' ? validateNone
    : _type._name === 'Boolean' ? validateBoolean
    : _type._name === 'String' ? validateString
    : _type._name === 'Number' ? validateNumber(_type._constraints)
    : _type._name === 'Array' ? validateArray(_type._subTypes)
    : _type._name === 'Union' ? validateUnion(_type._options)
    : (val:any) => false
