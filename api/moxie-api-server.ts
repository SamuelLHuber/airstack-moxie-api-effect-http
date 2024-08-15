import { BunRuntime, BunHttpServer, BunContext } from "@effect/platform-bun"
import { Effect, Layer, pipe } from "effect"
import { HttpError, RouterBuilder } from "effect-http"
import { HttpServer } from "@effect/platform"

import { moxieApi } from "./moxie-api-spec"
import { getUserAuctionBids } from "./functions/getUserAuctionBids"
import { SwaggerFilesLive } from "./BunSwaggerFiles"


const app = RouterBuilder.make(moxieApi).pipe(
  RouterBuilder.handle("getOrdersErc20", ({ body }) =>
    pipe(
      getUserAuctionBids(body.addressEth),
    )
  ),
  RouterBuilder.build
);

const HttpLive = HttpServer.serve(app).pipe(
  Layer.provide(BunHttpServer.layer({ port: 3000 })),
  Layer.provide(SwaggerFilesLive),
  Layer.provide(BunContext.layer),
  Layer.launch,
  Effect.scoped
)

BunRuntime.runMain(HttpLive)
