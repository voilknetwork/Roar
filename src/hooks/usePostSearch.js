import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'universal-cookie';

export default function usePostSearch(query, pageNumber) {
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState(false);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const cookies = new Cookies();
  const [type, setType] = useState(cookies.get("type")|"trending")
  useEffect(() => {
    setPosts([]);
  }, [query]);

  useEffect(() => {
    setVisible(true);
    setError(false);
    let cancel;

    setType(cookies.get("type"))
    let methodname = "get_trending_posts"
    if(type=="created") {
      methodname = "get_created_posts"
    }
    else if(type=="active") {
      methodname = "get_active_posts"
    }
    else if(type=="cashout") {
      methodname = "get_cashout_posts"
    }
    else if(type=="payout") {
      methodname = "get_cashout_posts"
    }
    else if(type=="voted") {
      methodname = "get_voted_posts"
    }
    else if(type=="children") {
      methodname = "get_children_posts"
    }
    else if(type=="popular") {
      methodname = "get_popular_posts"
    }
    else if(type=="commented") {
      methodname = "get_commented_posts"
    }


    axios({
      url: "https://graphql.voilk.com/graphql",
      method: "post",
      data: {
        query: `
          query TrendingPosts{
            ${methodname}(tag: "${query}", limit: 10, page: ${pageNumber}, truncate: 0) {
              id
              author
              account {
                name
                json_metadata{
                  cover_image
                  name
                  about
                  location
                  website
                  profile_image
                }
              }
              permlink
              category
              parent_author
              parent_permlink
              title
              body
              json_metadata
              last_update
              created
              active
              last_payout
              depth
              children
              net_votes
              abs_rshares
              vote_rshares
              children_abs_rshares
              cashout_time
              max_cashout_time
              total_vote_weight
              reward_weight
              total_payout_value
              curator_payout_value
              author_rewards
              net_votes
              root_author
              root_permlink
              max_accepted_payout
              percent_voilk_dollars
              allow_replies
              allow_replies
              allow_curation_rewards
              beneficiaries
              url
              root_title
              pending_payout_value
              total_pending_payout_value
              active_votes {
                voter
                weight
                rshares
                percent
                reputation
                time
              }
              replies {
                id
                author
                account {
                    name
                    json_metadata{
                      cover_image
                      name
                      about
                      location
                      website
                      profile_image
                    }
                  }
                permlink
                category
                parent_author
                parent_permlink
                title
                body
                json_metadata
                last_update
                created
                active
                last_payout
                depth
                children
                net_votes
                abs_rshares
                vote_rshares
                children_abs_rshares
                cashout_time
                max_cashout_time
                total_vote_weight
                reward_weight
                total_payout_value
                curator_payout_value
                author_rewards
                net_votes
                root_author
                root_permlink
                max_accepted_payout
                percent_voilk_dollars
                allow_replies
                allow_replies
                allow_curation_rewards
                beneficiaries
                url
                root_title
                pending_payout_value
                total_pending_payout_value
                active_votes {
                  voter
                  weight
                  rshares
                  percent
                  reputation
                  time
                }
                replies {
                  id
                  author
                  account {
                    name
                    json_metadata{
                      cover_image
                      name
                      about
                      location
                      website
                      profile_image
                    }
                  }
                  permlink
                  category
                  parent_author
                  parent_permlink
                  title
                  body
                  json_metadata
                  last_update
                  created
                  active
                  last_payout
                  depth
                  children
                  net_votes
                  abs_rshares
                  vote_rshares
                  children_abs_rshares
                  cashout_time
                  max_cashout_time
                  total_vote_weight
                  reward_weight
                  total_payout_value
                  curator_payout_value
                  author_rewards
                  net_votes
                  root_author
                  root_permlink
                  max_accepted_payout
                  percent_voilk_dollars
                  allow_replies
                  allow_replies
                  allow_curation_rewards
                  beneficiaries
                  url
                  root_title
                  pending_payout_value
                  total_pending_payout_value
                  active_votes {
                    voter
                    weight
                    rshares
                    percent
                    reputation
                    time
                  }
                  replies {
                    id
                    author
                    account {
                        name
                        json_metadata{
                          cover_image
                          name
                          about
                          location
                          website
                          profile_image
                        }
                      }
                    permlink
                    category
                    parent_author
                    parent_permlink
                    title
                    body
                    json_metadata
                    last_update
                    created
                    active
                    last_payout
                    depth
                    children
                    net_votes
                    abs_rshares
                    vote_rshares
                    children_abs_rshares
                    cashout_time
                    max_cashout_time
                    total_vote_weight
                    reward_weight
                    total_payout_value
                    curator_payout_value
                    author_rewards
                    net_votes
                    root_author
                    root_permlink
                    max_accepted_payout
                    percent_voilk_dollars
                    allow_replies
                    allow_replies
                    allow_curation_rewards
                    beneficiaries
                    url
                    root_title
                    pending_payout_value
                    total_pending_payout_value
                    active_votes {
                      voter
                      weight
                      rshares
                      percent
                      reputation
                      time
                    }
                    replies {
                      id
                      author
                      account {
                        name
                        json_metadata{
                          cover_image
                          name
                          about
                          location
                          website
                          profile_image
                        }
                      }
                      permlink
                      category
                      parent_author
                      parent_permlink
                      title
                      body
                      json_metadata
                      last_update
                      created
                      active
                      last_payout
                      depth
                      children
                      net_votes
                      abs_rshares
                      vote_rshares
                      children_abs_rshares
                      cashout_time
                      max_cashout_time
                      total_vote_weight
                      reward_weight
                      total_payout_value
                      curator_payout_value
                      author_rewards
                      net_votes
                      root_author
                      root_permlink
                      max_accepted_payout
                      percent_voilk_dollars
                      allow_replies
                      allow_replies
                      allow_curation_rewards
                      beneficiaries
                      url
                      root_title
                      pending_payout_value
                      total_pending_payout_value
                      active_votes {
                        voter
                        weight
                        rshares
                        percent
                        reputation
                        time
                      }
                      replies {
                        id
                        author
                        account {
                            name
                            json_metadata{
                              cover_image
                              name
                              about
                              location
                              website
                              profile_image
                            }
                          }
                        permlink
                        category
                        parent_author
                        parent_permlink
                        title
                        body
                        json_metadata
                        last_update
                        created
                        active
                        last_payout
                        depth
                        children
                        net_votes
                        abs_rshares
                        vote_rshares
                        children_abs_rshares
                        cashout_time
                        max_cashout_time
                        total_vote_weight
                        reward_weight
                        total_payout_value
                        curator_payout_value
                        author_rewards
                        net_votes
                        root_author
                        root_permlink
                        max_accepted_payout
                        percent_voilk_dollars
                        allow_replies
                        allow_replies
                        allow_curation_rewards
                        beneficiaries
                        url
                        root_title
                        pending_payout_value
                        total_pending_payout_value
                        active_votes {
                          voter
                          weight
                          rshares
                          percent
                          reputation
                          time
                        }
                        replies {
                          id
                          author
                          account {
                            name
                            json_metadata{
                              cover_image
                              name
                              about
                              location
                              website
                              profile_image
                            }
                          }
                          permlink
                          category
                          parent_author
                          parent_permlink
                          title
                          body
                          json_metadata
                          last_update
                          created
                          active
                          last_payout
                          depth
                          children
                          net_votes
                          abs_rshares
                          vote_rshares
                          children_abs_rshares
                          cashout_time
                          max_cashout_time
                          total_vote_weight
                          reward_weight
                          total_payout_value
                          curator_payout_value
                          author_rewards
                          net_votes
                          root_author
                          root_permlink
                          max_accepted_payout
                          percent_voilk_dollars
                          allow_replies
                          allow_replies
                          allow_curation_rewards
                          beneficiaries
                          url
                          root_title
                          pending_payout_value
                          total_pending_payout_value
                          active_votes {
                            voter
                            weight
                            rshares
                            percent
                            reputation
                            time
                          }
                          replies {id}
                          author_reputation
                          promoted
                          body_length
                          reblogged_by
                        }
                        author_reputation
                        promoted
                        body_length
                        reblogged_by
                      }
                      author_reputation
                      promoted
                      body_length
                      reblogged_by
                    }
                    author_reputation
                    promoted
                    body_length
                    reblogged_by
                  }
                  author_reputation
                  promoted
                  body_length
                  reblogged_by
                }
                author_reputation
                promoted
                body_length
                reblogged_by
              }
              author_reputation
              promoted
              body_length
              reblogged_by
            }
          }
          `,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {

        console.log(res.data)

        setPosts((prevPosts) => {
          if(type=="created"){
            return [
              ...new Set([
                ...prevPosts,
                ...res.data.data.get_created_posts.map((b) => b),
              ]),
            ];
          }
          else if(type=="active"){
            return [
              ...new Set([
                ...prevPosts,
                ...res.data.data.get_active_posts.map((b) => b),
              ]),
            ];
          }
          else if(type=="cashout"){
            return [
              ...new Set([
                ...prevPosts,
                ...res.data.data.get_cashout_posts.map((b) => b),
              ]),
            ];
          }
          else if(type=="payout"){
            return [
              ...new Set([
                ...prevPosts,
                ...res.data.data.get_cashout_posts.map((b) => b),
              ]),
            ];
          }
          else if(type=="voted"){
            return [
              ...new Set([
                ...prevPosts,
                ...res.data.data.get_voted_posts.map((b) => b),
              ]),
            ];
          }
          else if(type=="children"){
            return [
              ...new Set([
                ...prevPosts,
                ...res.data.data.get_children_posts.map((b) => b),
              ]),
            ];
          }
          else if(type=="popular"){
            return [
              ...new Set([
                ...prevPosts,
                ...res.data.data.get_popular_posts.map((b) => b),
              ]),
            ];
          }
          else if(type=="commented"){
            return [
              ...new Set([
                ...prevPosts,
                ...res.data.data.get_commented_posts.map((b) => b),
              ]),
            ];
          }
          else {
            return [
              ...new Set([
                ...prevPosts,
                ...res.data.data.get_trending_posts.map((b) => b),
              ]),
            ];
          }
        });
        if(type=="created"){
          setHasMore(res.data.data.get_created_posts.length > 0);
        }
        else if(type=="active"){
          setHasMore(res.data.data.get_active_posts.length > 0);
        }
        else if(type=="cashout"){
          setHasMore(res.data.data.get_cashout_posts.length > 0);
        }
        else if(type=="payout"){
          setHasMore(res.data.data.get_payout_posts.length > 0);
        }
        else if(type=="voted"){
          setHasMore(res.data.data.get_voted_posts.length > 0);
        }
        else if(type=="children"){
          setHasMore(res.data.data.get_children_posts.length > 0);
        }
        else if(type=="popular"){
          setHasMore(res.data.data.get_popular_posts.length > 0);
        }
        else if(type=="commented"){
          setHasMore(res.data.data.get_commented_posts.length > 0);
        }
        else {
          setHasMore(res.data.data.get_trending_posts.length > 0);
        }
        setVisible(false);
        console.log(visible);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber, type]);

  return { visible, type, error, posts, hasMore, setType };
}
