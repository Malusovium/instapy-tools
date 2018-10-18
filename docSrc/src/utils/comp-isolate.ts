import { ifElse
       , isNil
       } from 'rambda'
import isolate from '@cycle/isolate'

export const initReducer =
  (preffered, otherwise = {}) =>
    (prev) => (
        { ...otherwise
        , ...ifElse
          ( preffered === undefined
          , () => ({})
          , () => ({value: preffered})
          )
        , ...prev
        }
      )

export const compLens =
  (componentKey, valueKey) => (
    { get: (state) => (
        { ...state[componentKey]
        }
      )
    , set: (state, childState) => (
        { ...state
        , [componentKey]: childState
        , [valueKey]: childState.value
        }
      )
    }
  )

const logIt =
  (val) => { console.log(val); return val }

export const unionLens =
  (componentKey, valueKey) => (
    { get: (state) => (
        { ...state[componentKey]
        }
      )
    , set: (state, childState) => (
        { ...state
        , [componentKey]: childState
        , [valueKey]: childState.value
        }
      )
    }
  )
// export const unionLens =
//   (componentKey, valueKey) => (
//     { get: (state) => (
//         { ...state[componentKey]
//         }
//       )
//     , set: (state, childState) => (
//         { ...state
//         , [componentKey]: childState
//         , [valueKey]: null
//         // , [valueKey]: logIt(childState[`op${childState.active}`]) || null
//             // !isNil(childState.active) ? 'hi'
//             // : !childState[`op${childState.active}`] ? 'oi'
//             // : childState[`op${childState.active}`]
//
//               // ? childState[`${childState.active}`].value
//               // : null
//         }
//       )
//     }
//   )

export const compIsolate =
  (lens = compLens) =>
    (component, name) =>
      isolate
      ( component
      , { onion: lens(`_${name}`, name)
        , '*': name
        }
      )
