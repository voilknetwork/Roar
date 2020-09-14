import { gql } from "apollo-boost";

const UPDATE_COMMENT = gql`
  mutation UpdateComment(
      $username: String!, 
      $wif: String!, 
      $parent_author: String!,
      $parent_permlink: String!,
      $permlink: String!, 
      $tags: String!, 
      $body: String!){
    update_a_comment(
      username: $username,
      wif: $wif,
      parent_author: $parent_author,
      parent_permlink: $parent_permlink,
      permlink: $permlink,
      tags: $tags,
      body: $body
    ){
      result
      transaction_id
    }
  }
`;

export { UPDATE_COMMENT }