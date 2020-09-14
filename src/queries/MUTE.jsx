import { gql } from "apollo-boost";

const MUTE = gql`
query Mute($username: String!, $wif: String!,$following: String!){
    mute(
        username: $username,
        wif: $wif,
        following: $following
    ){
        result
        transaction_id
    }
}
`;
export { MUTE }
