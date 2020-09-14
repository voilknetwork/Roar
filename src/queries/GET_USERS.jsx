import { gql } from "apollo-boost";

const GET_USERS = gql`
  query GetUsers(
      $lowerBound: String!, 
      $limit: Int!
    ){
    lookup_accounts(
        lowerBound: $lowerBound,
        limit: $limit
    ){
        id
        name
        json_metadata {
          about
          profile_image
        }
    }
  }
`;

export { GET_USERS }