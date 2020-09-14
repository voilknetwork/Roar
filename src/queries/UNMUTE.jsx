import { gql } from "apollo-boost";

const UNMUTE = gql`
query UnMute($username: String!, $wif: String!,$following: String!){
    unmute(
        username: $username,
        wif: $wif,
        following: $following
    ){
        result
        transaction_id
    }
}
`;
export { UNMUTE }
