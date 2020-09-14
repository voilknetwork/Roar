import React from 'react'
import Logo from "../../assets/user.png"

function Suggestion({ usr, refetch }) {
    const name = usr.name;
    return (
        <div class="suggestion-usd">
            <img src={usr.json_metadata.profile_image ? usr.json_metadata.profile_image : Logo}
                alt=""
                width="35px"
                height="35px"
            />
            <div class="sgt-text">
                <h4>{name}</h4>
                <span>{usr.json_metadata.about ? usr.json_metadata.about.slice(0, 13) : null}</span>
            </div>
            <span><a href={`/profile/@${name}`}><i class="la la-plus"></i></a></span>
        </div>
    )
}

export default Suggestion
