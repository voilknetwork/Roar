import React from 'react'

function Follower({user}) {
    return (
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="company_profile_info">
                <div class="company-up-info">
                    <img src={user.account.json_metadata.profile_image} alt="" />
    <h3>{user.account.name}</h3>
    <h4>{user.account.json_metadata.about?user.account.json_metadata.about.slice(0,17):null}</h4>
                    <ul>
                        <li><a href="#" title="" class="follow">Follow</a></li>
                        <li><a href="#" title="" class="message-us"><i class="fa fa-envelope"></i></a></li>
                    </ul>
                </div>
                <a href={`/profile/@${user.account.name}`} title="" class="view-more-pro">View Profile</a>
            </div>
        </div>
    )
}

export default Follower
