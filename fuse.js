const { FuseBox, QuantumPlugin, JSONPlugin } = require('fuse-box')
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

task
( "build"
, async (context) => {
    const fuse =
      FuseBox
        .init
         ( { homeDir: 'src'
           , output: 'lib/$name.js'
           , package:
             { name: 'instapyTools'
             , entry: 'index.ts'
             }
           , useTypeScriptCompiler: true
           , plugins:
             [ JSONPlugin()
             , QuantumPlugin
               ( { bakeApiIntoBundle: "index"
                 , target: 'server@esnext'
                 , containedAPI: true
                 }
               )
             ]
           }
         )
    fuse
      .bundle('index')
      .instructions('> index.ts')

    await fuse.run()
    await buildDeclaration('.', 'lib')
  }
)

