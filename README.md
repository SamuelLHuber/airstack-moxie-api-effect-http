# airstack-moxie-api

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run api/moxie-api-server.ts
```

to test

```
curl -X POST http://localhost:3000/getorderserc20 \
-H "Content-Type: application/json" \
-d '{"addressEth": "0x48f9887cab979b6f476bba3cc96808be8b8a2b72"}'
```

Swagger Docs will be at `localhost:3000/docs`

to test as CLI without running the api run

```
bun run auctionBids.ts
```

if you want to run the official airstack sample

```
bun run moxieAuctionBids.ts
```

## Understand Effect-TS

To learn watch the building an API section [here](https://youtu.be/BHuY6w9ed5o?feature=shared&t=1400) in this Youtube Video and if you want to learn more watch the same video from the beginning.
