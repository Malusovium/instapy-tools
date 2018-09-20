const { readFileSync, writeFileSync } = require('fs')
const { FuseBox, QuantumPlugin, JSONPlugin, WebIndexPlugin } = require('fuse-box')
const { task, context, tsc } = require('fuse-box/sparky')

const buildDeclaration =
  async (inDir, outDir) => {
    await tsc
          ( inDir
          , { emitDeclarationOnly: true
            , target: 'esnext'
            , outDir: outDir
            }
          )
  }

const replaceWithJson =
  ( sourceFile
  , outFile
  , jsonFilePath
  , templString
  ) => {
    const json = readFileSync(jsonFilePath, 'utf-8')
    const source = readFileSync(sourceFile, 'utf-8')
    const newSource =
      source
        .split(templString)
        .join(json)
    writeFileSync(outFile, newSource)
  }
const replaceApiJsonObj =
  () => 
    replaceWithJson
    ( 'src/api/raw.tmpl'
    , 'src/api/raw.ts'
    , './api.json'
    , '{{apiJson}}'
    )


task
( "tools:raw"
, async (context) => {
    replaceApiJsonObj()
  }
)

task
( "tools:build"
, async (context) => {
    replaceApiJsonObj()
    await tsc
          ( '.'
          , { target: 'esnext'
            , outDir: 'lib'
            }
          )
  }
)

const getDocConfig =
  (isProduction = false) =>
    FuseBox
      .init
       ( { homeDir: '.'
         , target: 'browser@es6'
         , output: 'docs/$name.js'
         , modulesFolder: ['node_modules', 'docSrc/node_modules']
         , plugins:
           [ WebIndexPlugin({ template: './docSrc/src/index.html'})
           , isProduction
             && QuantumPlugin
                ( { uglify: true
                  , threeshake: true
                  }
                )
           ]
         }
       )

task
( 'doc:build'
, async (context) => {
    const fuse = getDocConfig(true)
    fuse
      .bundle('app')
      .instructions('> index.ts')
    await fuse.run()
  }
)

task
( 'doc:dev'
, async (context) => {
    const fuse = getDocConfig()
    fuse
      .dev({ fallback: 'index.html' })
    fuse
      .bundle('app')
      .instructions('> docSrc/src/index.ts')
      .hmr()
      .watch()
    await fuse.run()
  }
)
