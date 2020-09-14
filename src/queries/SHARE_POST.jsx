import { gql } from "apollo-boost";

const SHARE_POST = gql`
mutation SharePost($username: String!, $wif: String!, $author: String!, $permlink: String!){
    share(
        username: $username,
        wif: $wif,
        author: $author,
        permlink: $permlink,
    ){
        result
        transaction_id
    }
}
`;
export { SHARE_POST }
