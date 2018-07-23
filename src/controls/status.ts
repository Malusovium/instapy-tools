import { composeExec } from './utils'

const countIncludesReducer =
  (containString:string) =>
      (acc:number, curr:string) =>
        curr.includes(containString)
          ? acc + 1
          : acc

const convertToBotCodes =
  (ups:number, exits:number): string =>
    ups + '' + exits

const isFirstReducer =
  (check:string) =>
    (acc:string, curr:string[]) =>
      curr[0] === check
        ? curr[1]
        : acc

const toBotStatus =
  (stdout:string):string => {
    const stdoutArr = stdout.split('\n')
    console.log(stdoutArr)
    const totalUp =
      stdoutArr.reduce(countIncludesReducer('Up'), 0)
    const totalExit =
      stdoutArr.reduce(countIncludesReducer('Exit'), 0)

    return convertToBotCodes(totalUp, totalExit)
  }

const toPrettyBotStatus =
  (botStatus:string) =>
    [ [ '00', 'Not Initalised' ]
    , [ '11', 'Done' ]
    , [ '20', 'Running' ]
    , [ '02', 'Stopped' ]
    ].reduce(isFirstReducer(botStatus), '')

export const botStatus =
  (projectPath: string) =>
    composeExec(projectPath)('ps')
      .then(toBotStatus)

export const prettyBotStatus =
  (projectPath: string) =>
    botStatus(projectPath)
      .then(toPrettyBotStatus)

