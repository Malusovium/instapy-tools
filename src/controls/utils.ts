import { exec } from 'child_process'

const dockerCompose =
  (projectPath:string, ...args:string[]) =>
      [ `docker-compose --file ${projectPath}/docker-prod.yml`
      , ...args
      ].join(' ')

const wrappedExec =
  (command:string) =>
    new Promise( (res, rej) =>
      exec( command
          , (error, stdout, stderr) => {
              console.log(error, stdout, stderr)
              error || stderr
                ? rej(error ? error : new Error(stderr))
                : res(stdout)
            }
          )
    )

export const composeExec =
  (projectPath: string) =>
    (...args:string[]) =>
      wrappedExec( dockerCompose(projectPath, ...args) )
