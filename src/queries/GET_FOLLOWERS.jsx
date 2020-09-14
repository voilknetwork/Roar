import { gql } from "apollo-boost";

const GET_FOLLOWERS = gql`
  query GetFollowers($username: String!){
    get_followers(username: $username){
        account
        follower_count
        following_count
    }
}`

export { GET_FOLLOWERS }
