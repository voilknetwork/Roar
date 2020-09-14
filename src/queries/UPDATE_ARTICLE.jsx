import { gql } from "apollo-boost";
const UPDATE_ARTICLE = gql`
  mutation UpdateArticle(
    $username: String!, 
    $wif: String!, 
    $title: String!,
    $permlink: String!,
    $category: String!, 
    $tags: String!, 
    $body: String!
    )
  {
    update_a_post(
        username: $username,
        wif: $wif,
        title: $title,
        permlink: $permlink,
        category: $category,
        tags: $tags,
        body: $body
    ){
        result
        transaction_id
    }
}`;

export { UPDATE_ARTICLE }