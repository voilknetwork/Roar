import { gql } from "apollo-boost";

const UPVOTE = gql`
  mutation UpvoteArticle(
      $username: String!, 
      $wif: String!, 
      $author: String!,
      $permlink: String!,
      $weight: Int!
    ){
    upvote(
        username: $username,
        wif: $wif,
        author: $author,
        permlink: $permlink,
        weight: $weight
    ){
      result
      transaction_id
    }
  }
`;

export { UPVOTE }