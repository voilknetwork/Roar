import React, {useContext, useState, useEffect} from 'react'
import axios from "axios"
import {UserContext, LoginContext} from "../../contexts"
import isLoggedin from '../../constants/isloggedin';

const API_LINK = "https://graphql.voilk.com/graphql"

function UserProfile({data, name, refetch}) {
    const context = useContext(LoginContext);
    const username = context.username;
    const password = context.password;

    const [state, setState, fetchData] = useContext(UserContext);
    const isLoading = state.isLoading;
    let userdata, metadata, mana;
    // for follow
    console.log(state)

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
        fetchData()
    }}
    class="hre"> Mute</a>)

    const [unMuteButton, setUnMuteButton] = useState(<a href="#" title=""
    onClick={(e) => {
        e.preventDefault()
        handleFollow("unmute")
        fetchData()
    }}
    class="hre"> UnMute</a>
    )

    const [fButton, setFButton] = useState(<a href="#" title="" class="flww"><i className="la la-spinner"></i></a>)
    const [mButton, setMButton] = useState(<a href="#" title="" class="hre"><i className="la la-spinner"></i></a>)

    useEffect(() => {
        if(!state.isLoading){
            state.userdata.user_following.includes(name)?setFButton(unfollowButton):setFButton(followButton)
        }
    }, [followButton, unfollowButton])


    useEffect(() => {
        if(!state.isLoading){
            state.userdata.user_ignored.includes(name)?setMButton(unMuteButton):setMButton(muteButton)
        }
    }, [muteButton, unMuteButton])

    if (!isLoading) {
        userdata = state.userdata;
        metadata = userdata.json_metadata;
        mana = (userdata.voting_manabar.current_mana * 100) / 10000;
    }


    function handleFollow(type){
        if(type=="follow"||type=="unfollow"){
        setFButton(<a href="#" title="" 
        class="flww"><i className="la la-spinner"></i></a>)
        }
        else {
            setMButton(<a href="#" title="" 
        class="hre"><i className="la la-spinner"></i></a>)
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
                    refetch()

                    }
                }
                else if(type=="unfollow"){
                    if(result.data.data.unfollow.result){
                    setFButton(followButton)
                    refetch()
                    }
                }

                else if(type=="mute"){
                    if(result.data.data.mute.result){
                    setMButton(unMuteButton)
                    setFButton(followButton)
                    refetch()
                    }
                }

                else if(type=="unmute"){
                    if(result.data.data.unmute.result){
                    setMButton(muteButton)
                    
                    refetch()
                    }
                }
            }
          }).catch(error=>{
              console.log(error)
          });
    }

    return (
        <div class="col-lg-3">
            <div class="main-left-sidebar">
                <div class="user_profile">
                    <div class="user-pro-img">
                        <img src={data.account.json_metadata.profile_image} alt="" width="170px" height="170px" />
                    </div>
                    <div class="user_pro_status">
                        {(isLoggedin(username, password)&&(username!==name))?
                        <ul class="flw-hr">
                            <li>{fButton}</li>
                            <li>{mButton}</li>
                        </ul>:null}
                        <ul class="flw-status">
                            <li>
                                <span><a href={`/followers/@${data.account.name}`}>Followers</a></span>
                                <b>{data.account.followers.follower_count}</b>
                            </li>
                            <li>
                                <span><a href={`/following/@${data.account.name}`}>Following</a></span>
                                <b>{data.account.followers.following_count}</b>
                            </li>

                        </ul>
                    </div>
                    <ul class="social_links">
                        <li class="voilk_balance"><i class="fas fa-coins"></i> {data.account.balance}</li>
                        <li class="vsd_balance"><i class="fas fa-award"></i> {data.account.vsd_balance}</li>
                        <li class="coining_balance"><i class="fas fa-medal"></i> {data.account.coining_shares}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default UserProfile
