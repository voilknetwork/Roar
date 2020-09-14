import { gql } from "apollo-boost";

const FOLLOW = gql`
query Follow($username: String!, $wif: String!,$following: String!){
    follow(
        username: $username,
        wif: $wif,
        following: $following
    ){
        result
        transaction_id
    }
}
`;

export { FOLLOW }
