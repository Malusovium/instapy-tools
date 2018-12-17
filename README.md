# Instapy-Tools

Note: this lib is pre v1 stage, expect thing breaking/buggy.

Want to build on top of Instapy? Then this is the toolset for you!

Batteries included:
  - Ability to generate machine readable api in JSON format from python code
  - Be able to controle the bot directly from js, using docker-compose
  - TypeScript InstaPy api, generated from api.json (comming soon™)

Requirements:
  - node > 10
  - docker
  - docker-compose
  - linux, Note: Using windows/mac and it works somehow let me now :)

## Usage

### Api from generated api.json

#### import and extract api methods
```ts
import { api } from 'instapy-tools'

const { raw
      , setupValidateMethod
      , setupMethod
      , setupCreate
      , setupArgComponent
      , setupInterface
      } = api
```

#### getting the raw `jsonApiObj` (api.json)
```ts
console.log(raw) // thats it...
```

#### setting up and using validateMethod
```ts
// setup
const validateMethod = setupValidateMethod(raw)

//usage
const validatedMethod1 =
  validateMethod
  ( { name: 'like_by_tags'
    , args:
      { tags: ['#cats', '#coolcats', '#aliencatsinspace']
      , amount: 50
      }
    }
  )
console.log(validatedMethod1) // true

const validatedMethod2 =
  validateMethod
  ( { name: 'like_by_tags'
    , args:
      { tags: ['#cats', '#coolcats', '#aliencatsinspace']
      , usernames: ['#user1', '#user2'] // dosen't exist on the method
      }
    }
  )
console.log(validatedMethod2) // false

const validatedMethod3 =
  validateMethod
  ( { name: 'like_by_tags'
    , args:
      { tags: ['#cats', '#coolcats', '#aliencatsinspace']
      , amount: -1 // lower than the constraint
      }
    }
  )
console.log(validatedMethod3) // false
```

#### setting up and using method
```ts
const method = setupMethod(raw) // uses 'session' as default name for the sessionObject
const methodBot = setupMethod(raw, 'bot') // now uses 'bot' for the sessionObject

const methodLine1 =
  method
  ( { name: 'like_by_tags'
    , args:
      { tags: ['#cats', '#coolcats', '#aliencatsinspace']
      , amount: 50
      }
    }
  )

const methodLine1Bot =
  methodBot
  ( { name: 'like_by_tags'
    , args:
      { tags: ['#cats', '#coolcats', '#aliencatsinspace']
      , amount: 50
      }
    }
  )

console.log(methodLine1) // 'session.like_by_tags(tags=['#cats', '#coolcats', 'aliencatsinspace'], amount=50)'
console.log(methodLine1Bot) // 'bot.like_by_tags(tags=['#cats', '#coolcats', 'aliencatsinspace'], amount=50)'
```

##### special case for the initializer
```ts
const methodInit =
  method
  ( { name: '__init__'
    , args:
      { username: 'userName'
      , password: 'passWord'
      }
    }
  )

console.log(methodInit) // session = InstaPy(username='userName', password='passWord')
```

#### Seting up and using create
```ts
const create = setupCreate() // uses default InstaPyPath
const create = setupCreate('/path/to/instapy/project')

const config =
  create
  ( [ method({name: '__init__', args: {someArgs...}})
    , method(with some input...)
    , method(with some input...)
    , method(with some input...)
    , method(with some input...)
    , method(with some input...)
    , method(with some input...)
    , method(with some input...)
    , '# a python comment in the code'
    , method(with some input...)
    , method(with some input...)
    , method({name: 'end'})
    ]
  )

console.log(create)
/*
from instapy import InstaPy

session = InstaPy(...)
session.method(...)
session.method(...)
session.method(...)
session.method(...)
session.method(...)
session.method(...)
session.method(...)
# a python comment in the code
session.method(...)
session.method(...)
session.end()
*/

create([...string], true) // will write the output to 'docker_quickstart.py'
create([...string], true, 'my-config.py') // will write the output to 'my-config.py'
```

#### Setup interface/ setup arg component
To "easily" generate an ui from api.json use these functions `setupInterface` and `setupArgComponent`
```ts
// def: default value given to argComponent
// argName: name given of argument
const fallbackComponent =
  (def, argName) => {
    // gets returned when it couldn't make out the type
    console.log(`${argName} has Type: fallback with default: ${def}`)
  }

const noneComponent =
  (def, argName) => () => {
    console.log(`${argName} has Type: None with default: ${def}`)
  }

const booleanComponent =
  (def, argName) => () => {
    console.log(`${argName} has Type: Boolean with default: ${def}`)
  }

const stringComponent =
  (def, argName) => () => {
    console.log(`${argName} has Type: String with default: ${def}`)
  }

// _constraints:
// { _step: undefined | number
// , _min: undefined | number
// , _max: undefined | number
// }
const numberComponent =
  (_constraints) => (def, argName) => () => {
    console.log(`${argName}, Type: Number, default: ${def}`)
  }

// _subType: 'Number' | 'String'  // Note: It is never 'Number'
const arrayComponent =
  (_subType) => (def, argName) => () => {
    console.log(`${argName}, Type: Array, default: ${def}`)
  }

// _subTypes list of all the types in order
const tupleComponent =
  (_subTypes) => (def, argName) => () => {
    // _subTypes.map(argComponent) <- use something like this here
    console.log(`${argName}, Type: Tuple, default: ${def}`)
  }

// _options: list of Types, Numbers and Strings
const unionComponent =
  (_options) => (def, argName) => () => {
    console.log(`${argName}, Type: Union, default: ${def}`)
  }

const argComponent =
  setupArgComponent
  ( { _default: fallbackComponent
    , boolean: booleanComponent
    , string: stringComponent
    , number: numberComponent
    , array: arrayComponent
    , tuple: tupleComponent
    , union: unionComponent
    }
  )

// args: { argName: buildArg } from raw.<methodName>.args
// methodName: said name of method from raw.<methodName>
const methodComponent =
  (args, methodName) => () => {
    //do everything you need to do
    console.log(methodName)
    if (args !== undefined) {
      if (args.enabled !== undefined) {
        args.enabled()
      }
      if (args.percentage !== undefined) {
        args.percentage()
      }
      if (args.times !== undefined) {
        args.times()
      }
    }
  }

const interface =
  setupInterface
  ( raw
  , methodComponent
  , argComponent
  )

interface.set_do_follow()
// set_do_follow
// enabled, Type: Union, default: false
// percentage, Type: Union, default: 0
// times, Type: Number, default: 1
```

### Control bot from TS/JS

#### Setup controls

```ts
import { controls } from 'instapy-tools'

const { start
      , stop
      , status
      , logs
      } = controls('Instapy') // Takes a string location to InstaPy Project Location

start()
  .then( (val:any) => {console.log(val)}) // succes

```

#### start

```ts
// Starts bot using docker-compose
// Uses "docker_quickstart.py" as configuration file taken from InstaPy Project path
start()
  .then( (val:any) => {console.log(val)}) // succes
```

#### stop

```ts
// Stops bot using docker-compose
stop()
  .then( (val:any) => {console.log(val)}) // succes
```

#### status

```ts
// Get bot-status using docker-compose
// returns: 'Not Initialised' | 'Done' | 'Running' | 'Stopped'
status()
  .then( (val:any) => {console.log(val)}) // Done
```

#### logs

```ts
// Get bot-logs using docker-compose
// returns: Last 30 lines of logs from InstaPy's output
logs()
  .then( (val:any) => {console.log(val)}) // Array of logLines
```

### Generating api.json

# Deprecated this kind of functionality will be moved to InstaPy soon, hopefully

#### Cloning InstaPy Project

```
npm run instapy:clone
```

#### Updating InstaPy

```
npm run instapy:update
```

#### Generate api.json

```
npm run gen-api
```

#### Develop api.json

```
npm run gen-api:dev
```

#### Updating and publishing the Project

```
npm version <major | minor | patch>
npm publish
```

## To-Do
  - [x] generate api.json, 'including types'
  - [x] expose api generated from api.json
  - [x] add bot controls
