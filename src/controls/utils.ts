import { exec } from 'child_process'

const dockerCompose =
  (projectPath:string, ...args:string[]) =>
      [ `docker-compose --file ${projectPath}/docker-prod.yml`
      , ...args
      ].join(' ')

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

export const composeExec =
  (projectPath: string) =>
    (...args:string[]) =>
      wrappedExec( dockerCompose(projectPath, ...args) )
