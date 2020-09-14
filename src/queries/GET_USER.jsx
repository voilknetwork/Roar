import { gql } from "apollo-boost";

const GET_USER = gql`
  query GetUserInfo($username: String!){
        account(name: $username){
          id
          bitcoin
          bitcoincash
          name
          owner{
            weight_threshold
            account_auths
            key_auths
          }
          active{
            weight_threshold
            account_auths
            key_auths
          }
          posting{
            weight_threshold
            account_auths
            key_auths
          }
          memo_key
          json_metadata {
            cover_image
            name
            about
            location
            website
            profile_image
          }
          comment_count
          followers{
            follower_count
            following_count
          }
          balance
          vsd_balance
          coining_shares
          
          
        }
}`

export { GET_USER }
