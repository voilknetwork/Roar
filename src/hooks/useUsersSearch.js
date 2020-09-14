import { useEffect, useState } from "react";
import axios from "axios";

export default function useUsersSearch(lowerBound) {
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState([]);
  const [hasMore, setHasMore] = useState(false);

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
                lookup_accounts(lowerBound: "${lowerBound}", limit: 12){
                    id
                    name
                    json_metadata {
                      about
                      profile_image
                    }
                    coining_shares
                  }
            }
          `
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setUsers((prevUsers) => {
            let accounts = res.data.data.lookup_accounts

            return [
              ...new Set([
                ...prevUsers,
                ...accounts.map((b) => b),
              ]),
            ];
          
        });

        setHasMore(res.data.data.lookup_accounts.length > 0);
        setVisible(false);
        console.log(visible);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [lowerBound]);

  return { visible,error, users, hasMore, setUsers };
}
