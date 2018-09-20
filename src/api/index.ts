import { setupCreate } from './create'
import { setupValidateMethod } from './validate'
import { setupMethod } from './method'
import { raw } from './raw'
import { setupInterface
       , setupArgComponent
       } from './interface'

export const api =
  { setupCreate
  , setupValidateMethod
  , setupMethod
  , raw
  , setupInterface
  , setupArgComponent
  }
