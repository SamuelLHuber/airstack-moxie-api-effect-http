// inspired by https://github.com/mikearnaldi/lambda-conf-2024/blob/main/src/api-spec.ts
import { Schema as S } from "@effect/schema";
import { pipe } from "effect";
import { Api, ApiResponse } from "effect-http";

/**
 * Schema Definitions
 */

export class Wallet extends S.Class<Wallet>("Wallet")({
  // "Ethereum address (40 hexadecimal characters starting with 0x)"
  addressEth: pipe(S.String, S.pattern(/^0x[a-fA-F0-9]{40}$/)),
}) {}

export class Order extends S.Class<Order>("Order")({
  buyAmount: S.String,
  sellAmount: S.String,
  price: S.String,
  status: S.String,
  timestamp: S.String,
  txHash: S.String,
}) {}

export class ApiError extends S.TaggedError<ApiError>()("ApiError", {
  message: S.String,
  details: S.String,
}) {}

/**
 * MOXIE API DEFINITION
 */

export const moxieApi = pipe(
  Api.make({
    title: "Moxie API",
  }),
  // Orders endpoint (using Orders placed with $MOXIE ERC20, not vested tokens)
  Api.addEndpoint(
    pipe(
      Api.post("getOrdersErc20", "/getorderserc20"),
      Api.setRequestBody(Wallet),
      Api.setResponseBody(S.Array(Order)),
      Api.setResponseStatus(200),
      Api.addResponse(ApiResponse.make(500, ApiError)),
    ),
  ),
);
