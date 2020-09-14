import React, {useState, useEffect, useContext} from 'react'
import axios from "axios"
import {UserContext, LoginContext} from "../../contexts"
import isLoggedin from '../../constants/isloggedin';
import Logo from "../../assets/user.png"

const API_LINK = "https://graphql.voilk.com/graphql"

function UProfile({usr, refetch}) {
    const context = useContext(LoginContext);
    const username = context.username;
    const password = context.password;

    const name = usr.name;

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
        <div class="user-profy">
            <img src={usr.json_metadata.profile_image?usr.json_metadata.profile_image:Logo} 
            alt="" 
            width="50px"
            height="50px"
            />
            <h3>{name}</h3>
    <span>{usr.json_metadata.about?usr.json_metadata.about.slice(0, 13):null}</span>
            {isLoggedin(username, password)?
            
            <ul>
                <li class="followw">{fButton}</li>
                <li><a href={`/chat/${username}:${name}`} title="" class="envlp"><img src="images/envelop.png" alt="" /></a></li>
                <li class="hire">{mButton}</li>
            </ul> :null}
            <a href={"/profile/@"+name} title="">View Profile</a>
        </div>

    )
}

export default UProfile
