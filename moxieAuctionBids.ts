import { gql, GraphQLClient } from "graphql-request";


const graphQLClient = new GraphQLClient(
  "https://api.studio.thegraph.com/query/23537/moxie_auction_stats_mainnet/version/latest"
);

const query = gql`
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
`;

const variable = {
  "userAddress": "0x48f9887cab979b6f476bba3cc96808be8b8a2b72"
}


try {
  const data = await graphQLClient.request(query, variable);
  console.log(data);
} catch (e) {
  throw new Error();
}