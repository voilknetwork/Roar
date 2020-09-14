import React, { useContext } from 'react'
import {LoginContext} from "../../contexts"
import { isLoggedOut } from '../../constants/isloggedin';

function LogoBox() {
    const context = useContext(LoginContext);

    const username = context.username;
    const password = context.password;

    if(isLoggedOut(username, password)) return(<div class="widget widget-about">
    <img src={process.env.PUBLIC_URL+ "/images/wd-logo.png"} alt="" />
    <h3>Share content now!</h3>
    <span>Earn rewards for creating content</span>
    <div class="sign_link">
        <h3><a href="/register" title="">Sign up</a></h3>
        <a href="/forum" title="">Learn More</a>
    </div>
</div>)


    return (
        <div class="widget widget-about">
            <img src={process.env.PUBLIC_URL+ "/images/wd-logo.png"} alt="" />
            <h3>Create a Post!</h3>
            <span>Post a roar and earn rewards</span>
            <div class="sign_link">
                <h3><a href="/roar" title="">Create Post!</a></h3>
                <a href="/forum" title="">Learn More</a>
            </div>
        </div>
    )
}

export default LogoBox
