import
  { exec
  , spawn
  } from 'child_process'

const dockerCompose =
  (projectPath: string, composeFile: string = 'docker-prod.yml') =>
    `docker-compose --file ${projectPath}/${composeFile}`

const wrappedExec =
  (command:string) =>
    new Promise( (res, rej) =>
      exec
      ( command
      , (error, stdout, stderr) =>
          error
            ? rej(error)
            : res(stdout || stderr )
      )
    )

const composeExec =
  (projectPath: string) =>
    (...args:string[]) =>
      wrappedExec
      ( [ dockerCompose(projectPath)
        , ...args
        ]
        .join(' ')
      )

const composeSpawn =
  (projectPath: string) =>
    (...args:string[]) => {
      const [compose, ...preArgs] = dockerCompose(projectPath).split(' ')
      return spawn(compose, [ ...preArgs, ...args])
    }

export
 { composeExec
 , composeSpawn
 }
