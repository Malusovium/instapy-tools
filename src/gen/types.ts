export type None =
  { _name: 'None' }

export type Bool =
  { _name: 'Boolean' }

export type Num =
  { _name: 'Number'
  , _min?: number
  , _max?: number
  , _step?: number
  }

export type Str =
  { _name: 'String' }

export type Arr =
  { _name: 'Array'
  , _subTypes: any[] | 'Number' | 'String'
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
      , ...ifValExists('_step', step)
      , ...ifValExists('_min', min)
      , ...ifValExists('_max', max)
      }
    )
  , array:
    ( types: Type[] | 'String' | 'Number'
    ): Arr => (
      { _name: 'Array'
      , _subTypes: types
      }
    )
  , tuple:
    ( options: any[]
    ): Tuple => (
      { _name: 'Tuple'
      , _options: options
      }
    )
  }

