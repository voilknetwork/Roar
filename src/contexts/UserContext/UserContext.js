import React, {useState, useReducer, useEffect, useContext} from 'react'
import LoginContext from "../LoginContext/LoginContext";


export const UserContext = React.createContext()
export const UserConsumer = UserContext.Consumer
export const UserProvider = UserContext.Provider



export const UserProviderComponent = (props) => {
    const context = useContext(LoginContext);
  
    const [state, setState] = useState({isLoading: true, isProfileLoading: true, userdata: null})
    
    const username = context.username;
    const password = context.password;

    function fetchData (){
      console.log('fetching data..');
      //setState({isLoading: true})
      fetch('https://graphql.voilk.com/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `{ 
            account(name: "${username}") { 
            id 
            name 
            json_metadata {
              cover_image 
              name 
              about 
              location 
              website 
              profile_image
            } 
            voting_manabar {
              current_mana
            } 
            balance 
            vsd_balance 
            savings_balance 
            savings_vsd_balance 
            savings_withdraw_requests 
            coining_shares 
            delegated_coining_shares 
            received_coining_shares 
            coining_withdraw_rate 
            next_coining_withdrawal
          }
          get_user_followers(username: "${username}", limit: 500)

          get_user_following(username: "${username}", limit: 500)
        
          get_user_muted(username: "${username}", limit: 500)
        
          get_user_ignored(username: "${username}", limit: 500)
        }` }),
      })
      .then(res => res.json())
      .then(res => {
        if (res.data.account !== null) {
          let userdata = []
          userdata = res.data.account
          userdata["user_followers"] = res.data.get_user_followers
          userdata["user_following"] = res.data.get_user_following
          userdata["user_muted"] = res.data.get_user_muted
          userdata["user_ignored"] = res.data.get_user_ignored
          setState({isLoading: false, userdata})
        }
        else {
            console.log("Could not connect..")
        }
      })
    }
    useEffect(()=> {
      fetchData();
    }, [])



    return (
    <UserProvider value={[
        state,
        setState,
        fetchData
    ]}>
        {props.children}
    </UserProvider>
    )
}

export default UserContext