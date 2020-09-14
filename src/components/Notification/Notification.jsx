import React from 'react'
import TimeAgo from 'timeago-react';
function Notification({nof: {from, to, text, profile, created_at}}) {
    return (
        <div class="notfication-details">
            <div class="noty-user-img">
                <img src={profile} alt="" />
            </div>
            <div class="notification-info">
    <h3><a href={"/profile/@"+from} title="">@{from}</a> </h3>
    <p>{text}</p>
                <span><TimeAgo datetime={created_at} /></span>
            </div>
        </div>
    )
}

export default Notification
