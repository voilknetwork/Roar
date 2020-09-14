import { gql } from "apollo-boost";

const POST_COMMENT = gql`
  mutation PostComment(
      $username: String!, 
      $wif: String!, 
      $parent_author: String!,
      $parent_permlink: String!, 
      $tags: String!, 
      $body: String!){
    make_a_comment(
      username: $username,
      wif: $wif,
      parent_author: $parent_author,
      parent_permlink: $parent_permlink,
      tags: $tags,
      body: $body
    ){
      result
      transaction_id
    }
  }
`;

export { POST_COMMENT }