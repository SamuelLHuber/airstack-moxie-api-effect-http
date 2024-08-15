import { BunRuntime } from "@effect/platform-bun"
import { Effect, Console } from "effect"
import { getUserAuctionBids } from "./api/functions/getUserAuctionBids"

const program = getUserAuctionBids("0x48f9887cab979b6f476bba3cc96808be8b8a2b72").pipe(
  Effect.map((orders) => `Success: ${JSON.stringify(orders, null, 2)}`),
  Effect.catchAll((error) => Effect.succeed(`Error: ${error}`)),
  Effect.flatMap(Console.log),
  Effect.scoped
)

BunRuntime.runMain(program)