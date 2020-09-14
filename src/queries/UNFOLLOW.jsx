import { gql } from "apollo-boost";

const UNFOLLOW = gql`
query UnFollow($username: String!, $wif: String!,$following: String!){
    unfollow(
        username: $username,
        wif: $wif,
        following: $following
    ){
        result
        transaction_id
    }
}
`;
export { UNFOLLOW }
