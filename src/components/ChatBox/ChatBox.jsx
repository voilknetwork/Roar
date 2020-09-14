import React, {useState, useContext, useRef, useEffect} from 'react'
import { UserContext, LoginContext } from "../../contexts"
import { isLoggedOut, isLoggedin } from '../../constants/isloggedin';
import Profile from "../../assets/user.png"
import ChatList from './ChatList';



function ChatBox() {
    const context = useContext(LoginContext);
    const [state, setState, fetchData] = useContext(UserContext);
    const [followers, setFollowers] = useState([])
    const username = context.username
    const password = context.password

    useEffect(() => {
        if(!state.isLoading){
            let profile = state.userdata.json_metadata.profile_image || Profile
            let about = state.userdata.json_metadata.about || "I am cool :)"
            let folls = state.userdata.user_followers || []
            let muted = state.userdata.user_muted || []
            let ignored = state.userdata.user_ignored || []
            let following = state.userdata.user_following || []
            setFollowers(folls)
        }
    }, [state])

    const isLoading = state.isLoading;
    let userdata, metadata, mana;


    if (!isLoading) {
        userdata = state.userdata;
        metadata = userdata.json_metadata;
        mana = (userdata.voting_manabar.current_mana * 100) / 10000;
    }
    console.log(username + "||||" + password)

    if(isLoading) return null;
    if(!isLoggedin(username, password)) return null;

    return (
        <div class="chatbox-list">
        {followers?<ChatList followers={followers} context={context} state={state}/>:null}
    </div>
    )
}

export default ChatBox
