import React, {useEffect, useState} from 'react'
import { useQuery } from 'react-apollo'
import { GET_USERS } from '../../queries/GET_USERS'
import Suggestion from './Suggestion'
import Loading from '../Loading/Loading'

function SuggestionBox() {
    const [r_users, setR_users] = useState([])
    const { loading, error, data, refetch } = useQuery(GET_USERS, {
        variables: {lowerBound: "", limit: 50}
    });
    useEffect(() => {
        if(!loading&&r_users.length<7){
            let users = data.lookup_accounts
            //console.log(users)
            for (let i = 0; i < 7; i++) {
                const element = Math.floor(Math.random() * 50);
                
                setR_users([...r_users, users[element]])
            }  
        }
    }, [data])

    if (loading||r_users.length<1) return <Loading />;
    if (error) return `Error! ${error.message}`;
    return (
        <div class="suggestions full-width d-none d-lg-block d-md-block">
            <div class="sd-title">
                <h3>Suggestions</h3>
                <i class="la la-ellipsis-v"></i>
            </div>
            <div class="suggestions-list">
            {r_users.map((usr,i) => {
                    if(!usr) return null
                    return(<Suggestion usr={usr} key={i} refetch={refetch}/>)
                })}
                
                
                <div class="view-more">
                    <a href="#" title="">View More</a>
                </div>
            </div>
        </div>

    )
}

export default SuggestionBox
