import { gql } from "apollo-boost";

const TAGS = gql`
  query Tags($limit: Int!){
    get_tags(limit: $limit){
      name
      total_payouts
      net_votes
      top_posts
      comments
      trending
    }
  }
`;

export { TAGS }

