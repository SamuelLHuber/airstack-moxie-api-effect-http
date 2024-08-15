import { BunRuntime, BunHttpServer, BunContext } from "@effect/platform-bun"
import { Effect, Layer, Logger, pipe } from "effect"
import { HttpError, RouterBuilder } from "effect-http"
import { NodeSwaggerFiles } from "effect-http-node"
import { HttpServer } from "@effect/platform"

import { moxieApi } from "./moxie-api-spec"
import { getUserAuctionBids } from "./functions/getUserAuctionBids"


const app = RouterBuilder.make(moxieApi).pipe(
  RouterBuilder.handle("getOrdersErc20", ({ body }) =>
    pipe(
      getUserAuctionBids(body.addressEth),
    )
  ),
  RouterBuilder.build
);

const server = pipe(
  HttpServer.serve(app),
  HttpServer.withLogAddress,
  Layer.provide(NodeSwaggerFiles.SwaggerFilesLive),
  Layer.provide(BunHttpServer.layer({ port: 3000 })),
  Layer.provide(BunContext.layer),
  Layer.provide(Logger.pretty),
  Layer.launch
)

BunRuntime.runMain(server)