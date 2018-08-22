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
      , setupCreate
      , setupMethod
      , makeDoAtType
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

#### makeDoAtType
```ts
comming soonTM this will probably be nicer in the next version
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

## To-Do
  - [x] generate api.json, 'including types'
  - [x] expose api generated from api.json
  - [x] add bot controls
