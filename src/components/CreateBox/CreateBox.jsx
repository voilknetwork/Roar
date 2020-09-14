import React, { useContext, useState, useEffect } from 'react'
import {UserContext, LoginContext} from "../../contexts"
import isLoggedin from '../../constants/isloggedin';

function CreateBox() {
    const context = useContext(LoginContext);
    const [state, setState, fetchData] = useContext(UserContext);

    const username = context.username;
    const password = context.password;
    
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
        <div class="post-topbar">
            <div class="user-picy">
                <img src={metadata.profile_image} alt="" /> 
            </div>
    {" "}@{userdata.name}! Post a roar now!
            <div class="post-st">
                <ul>
                    <li><a class="active" href="/roar" title="">Roar!</a></li>
                </ul>
            </div>
        </div>

    )
}

export default CreateBox
