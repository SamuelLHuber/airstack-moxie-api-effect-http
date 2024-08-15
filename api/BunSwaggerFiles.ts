import * as FileSystem from "@effect/platform/FileSystem"
import * as Path from "@effect/platform/Path"
import * as SwaggerRouter from "effect-http/SwaggerRouter"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Record from "effect/Record"

/** @internal */
const readFile = (path: string) => Effect.flatMap(FileSystem.FileSystem, (fs) => fs.readFile(path))

/** @internal */
const SWAGGER_FILE_NAMES = [
  "index.css",
  "swagger-ui.css",
  "swagger-ui-bundle.js",
  "swagger-ui-standalone-preset.js",
  "favicon-32x32.png",
  "favicon-16x16.png"
]

/** @internal */
const findSwaggerDistPath = Effect.gen(function*(_) {
  const fs = yield* _(FileSystem.FileSystem)
  const path = yield* _(Path.Path)
  
  const swaggerPath = path.join(process.cwd(), "node_modules", "swagger-ui-dist")
  
  if (yield* _(fs.exists(swaggerPath))) {
    return swaggerPath
  }
  
  throw new Error("Could not find swagger-ui-dist directory")
})

/** @internal */
const readSwaggerFile = (swaggerBasePath: string, file: string) =>
  Effect.flatMap(Path.Path, (path) => readFile(path.join(swaggerBasePath, file)).pipe(Effect.orDie))

/** @internal */
export const SwaggerFilesLive = Effect.gen(function*(_) {
  const swaggerBasePath = yield* _(findSwaggerDistPath)

  const files = yield* _(
    SWAGGER_FILE_NAMES,
    Effect.forEach((path) => Effect.zip(Effect.succeed(path), readSwaggerFile(swaggerBasePath, path))),
    Effect.map(Record.fromEntries)
  )

  const size = Object.entries(files).reduce(
    (acc, [_, content]) => acc + content.byteLength,
    0
  )
  const sizeMb = (size / 1024 / 1024).toFixed(1)

  yield* _(Effect.logDebug(`Static swagger UI files loaded (${sizeMb}MB)`))

  return { files }
}).pipe(Layer.effect(SwaggerRouter.SwaggerFiles))