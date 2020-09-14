import React from 'react'
import TimeAgo from 'timeago-react';

function Pmessage({p}) {
    console.log(p)
    return (
        <div class="notfication-details">
            <div class="noty-user-img">
            <a href={`/chat/${p.from}:${p.to}`}><img src={p.profile} alt="" /></a>
            </div>
            <div class="notification-info">
                <h3><a href={`/profile/@${p.from}`} title="">{p.from}</a> </h3>
                
                 <p>{p.text.slice(0, 200)}... </p>
                <span><TimeAgo datetime={p.created_at} /></span>
            </div>
        </div>
    )
}

export default Pmessage
