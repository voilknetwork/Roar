import { gql } from "apollo-boost";

const POST_ARTICLE = gql`
  mutation PostArticle($username: String!, $wif: String!, $title: String!, $tags: String!, $body: String!){
    make_a_post(
      username: $username,
      wif: $wif,
      title: $title,
      tags: $tags,
      body: $body
    ){
      result
      transaction_id
    }
  }
`;

export { POST_ARTICLE }