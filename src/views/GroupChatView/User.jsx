import React, {useState, useContext} from 'react'
import TimeAgo from 'timeago-react';
import { SocketContext } from '../../contexts';

const User = ({ user, username, count }) => {



    let isSentByCurrentUser = false;

    let name = user.username
    let about = user.about
    let groupid = user.groupid

    const trimmedName = username.trim().toLowerCase();

    if(name == trimmedName) {
        isSentByCurrentUser = true;
    }

    return (
        <li class={isSentByCurrentUser?"active":""}>
        <div class="usr-msg-details">
            <div class="usr-ms-img">
                <img src={user.profile_image} alt="" />
                <span class="msg-status"></span>
            </div>
            <div class="usr-mg-info">
                <h3>{name}</h3>
                <p>{about}</p>
            </div>
            <span class="posted_time"><TimeAgo datetime={user.join_time} /></span>
        </div>
    </li>
    )
}

export default User
