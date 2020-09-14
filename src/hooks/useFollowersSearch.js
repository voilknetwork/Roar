import { useEffect, useState } from "react";
import axios from "axios";

export default function useFollowersSearch(username, start, what) {
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setUsers([])
  }, [what, username])
  
  useEffect(() => {
    setVisible(true);
    setError(false);
    let cancel;

    axios({
      url: "https://graphql.voilk.com/graphql",
      method: "post",
      data: {
          query: `
            query GetFollowers{
                get_followers_user(
                    username: "${username}",
                    start :"${start}",
                    what: "${what}",
                    limit: 12
                ){
                    account {
                        name
                        json_metadata {
                          name
                          about
                          profile_image
                        }
                        coining_shares
                    }
                  }
            }
          `
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
          console.log(res.data.data)
        setUsers((prevUsers) => {
            let accounts = res.data.data.get_followers_user

            return [
              ...new Set([
                ...prevUsers,
                ...accounts.map((b) => b),
              ]),
            ];
          
        });

        setHasMore(res.data.data.get_followers_user.length > 0);
        setVisible(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [start, username]);

  return { visible,error, users, hasMore, setUsers };
}
