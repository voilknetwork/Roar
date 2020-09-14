import { gql } from "apollo-boost";

const GET_USERS_CUSTOM = gql`
  query GetUsers(
      $accounts: [String!]!, 
      $limit: Int!
    ){
    lookup_accounts(
        accounts: $accounts
    ){
        id
        name
        coining_shares
        json_metadata {
          about
          profile_image
        }
    }
  }
`;

export { GET_USERS_CUSTOM }