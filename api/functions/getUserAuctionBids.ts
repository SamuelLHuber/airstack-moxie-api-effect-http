import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse
} from "@effect/platform"
import { Schema } from "@effect/schema"
import { Effect, Schedule } from "effect"

// Define the schema for the API response
const Order = Schema.Struct({
  buyAmount: Schema.String,
  sellAmount: Schema.String,
  price: Schema.String,
  status: Schema.String,
  timestamp: Schema.String,
  txHash: Schema.String
})

const User = Schema.Struct({
  orders: Schema.Array(Order)
})

const ApiResponse = Schema.Struct({
  data: Schema.Struct({
    users: Schema.Array(User)
  })
})

export const getUserAuctionBids = (userAddress: string) => Effect.gen(function* (_) {
  const query = `
    query MyQuery($userAddress: Bytes!) {
      users(where: { address: $userAddress }) {
        orders {
          buyAmount
          sellAmount
          price
          status
          timestamp
          txHash
        }
      }
    }
  `

  const variables = { userAddress }

  const createRequest = Effect.gen(function* (_) {
    const baseRequest = HttpClientRequest.post(
      "https://api.studio.thegraph.com/query/23537/moxie_auction_stats_mainnet/version/latest"
    )
    const requestWithHeaders = HttpClientRequest.setHeaders(baseRequest, {
      "Content-Type": "application/json",
    })
    return yield* _(HttpClientRequest.jsonBody(requestWithHeaders, { query, variables }))
  })

  const retryPolicy = Schedule.exponential(1000).pipe(
    Schedule.compose(Schedule.recurs(3)),
    Schedule.upTo("4 seconds")
  )

  const request = yield* _(createRequest)
  const response = yield* _(Effect.retry(
    HttpClient.fetchOk(request),
    retryPolicy
  ))
  const result = yield* _(HttpClientResponse.schemaBodyJson(ApiResponse)(response))
  return result.data.users[0]?.orders || []
})