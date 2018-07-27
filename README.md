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
status()
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
  - [ ] expose api generated from api.json
  - [x] add bot controls
