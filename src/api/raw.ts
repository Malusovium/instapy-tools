import { readFileSync } from 'fs'

export const raw =
  JSON.parse(readFileSync(__dirname + '/../../api.json', 'utf-8'))
