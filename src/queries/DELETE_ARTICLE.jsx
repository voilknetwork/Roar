import { gql } from "apollo-boost";

const DELETE_ARTICLE = gql`
  mutation DeleteArticle(
      $username: String!, 
      $wif: String!, 
      $permlink: String!
    ){
    delete_a_post(
        username: $username,
        wif: $wif,
        permlink: $permlink,
    ){
      result
      transaction_id
    }
  }
`;

export { DELETE_ARTICLE }