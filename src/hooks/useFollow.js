import { useEffect, useState } from "react";
import axios from "axios";
const API_LINK = "https://graphql.voilk.com/graphql"

export default function useFollow(username, following, wif, call){

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)

    const query = `query Follow {
        follow(username: "${username}",wif: "${password}", follower: "${name}"){
            result
            transaction_id
        }
    }`
    if(call){
    axios({
        url: API_LINK,
        method: 'post',
        data: { query }
      }).then((result) => {
        console.log(result.data)
        setLoading(false)
        setData(result.data)
      });
    }
    return [loading, data]
}