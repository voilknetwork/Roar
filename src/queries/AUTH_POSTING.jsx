import { gql } from "apollo-boost";

const AUTH_POSTING = gql`
  query AuthPosting(
      $username: String!, 
      $wif: String!
    ){
        auth_posting(
        username: $username,
        wif: $wif
        
        ){
            authenticated
            public_key
            private_key
        }
    }
`;

export { AUTH_POSTING }
