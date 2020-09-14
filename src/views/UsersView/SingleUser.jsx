import React,{useState, useEffect, useContext} from 'react'
import {UserContext, LoginContext} from "../../contexts"
import axios from "axios";
import isLoggedin from '../../constants/isloggedin';
const API_LINK = "https://graphql.voilk.com/graphql"
function SingleUser({user}) {
    const context = useContext(LoginContext);
    const username = context.username;
    const password = context.password;

    const name = user.name;

    const [state, setState, fetchData] = useContext(UserContext);
    const isLoading = state.isLoading;
    let userdata, metadata, mana;
    // for follow
    //console.log(state)

    const [unfollowButton, setUnfollowButton] = useState(<a href="#" title="" 
    onClick={(e) => {
        e.preventDefault()
        handleFollow("unfollow")
        fetchData()
    }}
    
    class="unflww">UnFollow</a>)

    const [followButton, setFollowButton] = useState(<a href="#" title="" 
    onClick={(e) => {
        e.preventDefault()
        handleFollow("follow")
        fetchData()
    }}
    
    class="flww"><i class="la la-plus"></i> Follow</a>)

    const [muteButton, setMuteButton] = useState(<a href="#" title=""
    onClick={(e) => {
        e.preventDefault()
        handleFollow("mute")
    }}
    class="hre"> Mute</a>)

    const [unMuteButton, setUnMuteButton] = useState(<a href="#" title=""
    onClick={(e) => {
        e.preventDefault()
        handleFollow("unmute")
    }}
    class="hre"> UnMute</a>
    )

    const [fButton, setFButton] = useState(<a href="#" title="" 
    class="flww"><i className="la la-spinner rotating"></i></a>)
    const [mButton, setMButton] = useState(<a href="#" title="" 
    class="flww"><i className="la la-spinner rotating"></i></a>)

    useEffect(() => {
        if(!state.isLoading){
            state.userdata.user_following.includes(name)?setFButton(unfollowButton):setFButton(followButton)
            state.userdata.user_ignored.includes(name)?setMButton(unMuteButton):setMButton(muteButton)
        }
    }, [followButton, unfollowButton])

    useEffect(() => {
        if(!state.isLoading){
            state.userdata.user_following.includes(name)?setFButton(unfollowButton):setFButton(followButton)
            state.userdata.user_ignored.includes(name)?setMButton(unMuteButton):setMButton(muteButton)
        }
    }, [state])

    if (!isLoading) {
        userdata = state.userdata;
        metadata = userdata.json_metadata;
        mana = (userdata.voting_manabar.current_mana * 100) / 10000;
    }


    function handleFollow(type){
        if(type=="follow"||type=="unfollow"){
        setFButton(<a href="#" title="" 
        class="flww"><i className="la la-spinner rotating"></i></a>)
        }
        else {
            setMButton(<a href="#" title="" 
        class="hre"><i className="la la-spinner rotating"></i></a>)
        }


        const query = `mutation {
            ${type}(username: "${username}",wif: "${password}", following: "${name}"){
                result
                transaction_id
            }
        }`
        axios({
            url: API_LINK,
            method: 'post',
            data: { query: query }
          }).then((result) => {
            console.log(result.data)
            
            if(result.data.data){
                if(type=="follow"){
                    if(result.data.data.follow.result){
                    setFButton(unfollowButton)
                    setMButton(muteButton)

                    }else if(!result.data.data.follow.result) {
                        setFButton(followButton)
                    }
                }
                else if(type=="unfollow"){
                    if(result.data.data.unfollow.result){
                    setFButton(followButton)
                    }else if(!result.data.data.unfollow.result) {
                        setFButton(unfollowButton)
                    }
                }

                else if(type=="mute"){
                    if(result.data.data.mute.result){
                    setMButton(unMuteButton)
                    setFButton(followButton)
                    }
                }

                else if(type=="unmute"){
                    if(result.data.data.unmute.result){
                    setMButton(muteButton)
                    }
                }
            }
          }).catch(error=>{
              console.log(error)
          });
    }
    return (
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="company_profile_info">
                <div class="company-up-info">
                    <img src={user.json_metadata.profile_image} alt="" />
    <h3>{user.name}</h3>
    <h4>{user.json_metadata.about?user.json_metadata.about.slice(0,17):null}</h4>
    {(isLoggedin(username, password)&&(username!==name))?
                    <ul>
                        <li>{fButton}</li>
                        <li><a href={`/chat/${username}:${user.name}`} title="" class="message-us"><i class="fa fa-envelope"></i></a></li>
                    </ul>:null}
                </div>
                <a href={`/profile/@${user.name}`} title="" class="view-more-pro">View Profile</a>
            </div>
        </div>
    )
}

export default SingleUser
