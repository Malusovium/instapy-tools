import { Dictionary
       , equals
       , toLower
       , reject
       , is
       , anyPass
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
  , _subType: 'Number' | 'String'
  }

export type Union =
  { _name: 'Union'
  , _options: any[]
  }

export type Tuple =
  { _name: 'Tuple'
  , _subTypes: Type[]
  }

export type Type =
  None
  | Bool
  | Num
  | Str
  | Union
  | Arr
  | Tuple

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
  , union:
      ( options: any[]
      ): Union => (
        { _name: 'Union'
        , _options: options
        }
      )
  , array:
      ( _type:  'String' | 'Number'
      ): Arr => (
        { _name: 'Array'
        , _subType: _type
        }
      )
  , tuple:
      ( types: Type[]
      ): Tuple => (
        { _name: 'Tuple'
        , _subTypes: types
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
  (val) => val === null

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

const isExact =
  (expected: any) =>
    (got:any) =>
      equals(expected, got)

const toArray =
  (input: any) => [...input]

const validateUnion =
  (options: Union["_options"]): TypeValidator =>
    (val) => {
      if(options.length === 0) {
        return true
      } else {
        const typeValidators: any[] =
          compose
          ( toArray // hacky function to satisfy typescript /w Dictionary It shouldn't have to be called
          , map(makeValidation)
          , reject( ({_name}:any) => _name === undefined)
          )(options)

        const exactValueValidators =
          compose
          ( toArray // hacky function to satisfy typescript /w Dictionary It shouldn't have to be called
          , map(isExact)
          , reject( ({_name}:any) => _name !== undefined)
          )(options)

        const validators: any = [ ...typeValidators, ...exactValueValidators ]

        return anyPass(validators)(val)
      }
    }

const validateArray =
  (_type: Arr["_subType"]): TypeValidator =>
    (val) => {
      if (_type === 'String') {
        return val.reduce(isTypeReducer('String'), true)
      } else if(_type === 'Number') {
        return val.reduce(isTypeReducer('Number'), true)
      } else {
        return false
      }
    }

const validateTuple =
  (typeList: Tuple["_subTypes"]): TypeValidator =>
    (val) => {
      if (val.length === typeList.length) {
        return false
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

export type TypesWithFunctions =
  { _default: any
  , none: any
  , boolean: any
  , string: any
  , number: (_constraints: Num["_constraints"]) => any
  , union: (_options: Union["_options"]) => any
  , array: (_subType: Arr["_subType"]) => any
  , tuple: (_subTypes: Tuple["_subTypes"]) => any
  }

type MakeDoAtType =
  (typesWithFunctions: TypesWithFunctions) =>
    (_type: Type) => any

export const makeDoAtType: MakeDoAtType =
  ( { _default
    , none
    , boolean
    , string
    , number
    , union
    , array
    , tuple
    }
  ) =>
    (_type) => // typesWithFunctions[toLower(getTypeName(_type))]
      _type._name === 'None' ? none
      : _type._name === 'Boolean' ? boolean
      : _type._name === 'String' ? string
      : _type._name === 'Number' ? number(_type._constraints)
      : _type._name === 'Union' ? union(_type._options)
      : _type._name === 'Array' ? array(_type._subType)
      : _type._name === 'Tuple' ? tuple(_type._subTypes)
      : _default

export const makeValidation =
  makeDoAtType
  ( { _default: (val:any) => false
    , none: validateNone
    , boolean: validateBoolean
    , string: validateString
    , number: validateNumber
    , union: validateUnion
    , array: validateArray
    , tuple: validateTuple
    }
  )
