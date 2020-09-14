import { useEffect, useState } from "react";
import axios from "axios";

export default function useFollowingSearch(username, start, what) {
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
            query GetUsers{
                get_following_user(
                    username: "${username}",
                    start :"${start}",
                    what: "${what}",
                    limit: 12
                ){
                    faccount {
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
        setUsers((prevUsers) => {
            let accounts = res.data.data.get_following_user

            return [
              ...new Set([
                ...prevUsers,
                ...accounts.map((b) => b),
              ]),
            ];
          
        });

        setHasMore(res.data.data.get_following_user.length > 0);
        setVisible(false);
        console.log(visible);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [start]);

  return { visible,error, users, hasMore, setUsers };
}
