import React, { useContext, useState, useEffect } from 'react'
import { UserContext, LoginContext, SocketContext } from "../../contexts"
import { DropdownItem } from 'reactstrap';
import isLoggedin, { isLoggedOut } from '../../constants/isloggedin';
import Notification from '../Notification/Notification';
import sound from "../../assets/sounds/piece-of-cake.ogg";
import Pmessage from './Pmessage';



function Header() {
    const context = useContext(LoginContext);
    const socket = useContext(SocketContext)
    //socket.connect()

    const [state, setState, fetchData] = useContext(UserContext);
    const isLoading = state.isLoading;
    let userdata, metadata, mana;

    const [accountMenu, setAccountMenu] = useState("none")
    const [notif, setNotif] = useState(false)
    const [messagbox, setMessagbox] = useState(false)
    const [menuButton, setMenuButton] = useState(false)
    const username = context.username;
    const password = context.password;



    const [userNotifs, setUserNotifs] = useState([])
    const [pMessages, setPMessages] = useState([])

    useEffect(() => {
        if (isLoggedin(username, password)) {
            socket.emit('join', {
                username,
                groupid: "login",
                key: password
            }, (error) => {
                if (error) {
                    console.log(error)
                }
            });
        }
    }, [])

    useEffect(() => {
        socket.on('notification', ({ notification }) => {

            console.log(notification)

            setUserNotifs(notifications => [...notifications, notification]);
            var x = document.getElementById("myAudio");
            x.play()
        });

        socket.on('pmessage', ({ pmessage }) => {

            console.log(pmessage)

            setPMessages(pMessages => [...pMessages, pmessage]);
            var x = document.getElementById("myAudio");
            x.play()
        });

        socket.on("notifications", (notifications) => {
            console.log(notifications)
            setUserNotifs(notifications)
        });

        socket.on("pmessages", (pmessages) => {
            console.log(pmessages)
            setPMessages(pmessages)
        });
    }, [])


    if (!isLoading) {
        userdata = state.userdata;
        metadata = userdata.json_metadata;
        mana = (userdata.voting_manabar.current_mana * 100) / 10000;
    }

    if (isLoading || isLoggedOut(username, password)) return (
        <header>
            <div class="container">
                <div class="header-data">
                    <div class="logo">
                        <a href="/trending" title=""><img src={process.env.PUBLIC_URL + "/images/logo.png"} alt="" /></a>
                    </div>
                    <div class="search-bar">
                        <form>
                            <input type="text" name="search" placeholder="Search..." />
                            <button type="submit"><i class="la la-search"></i></button>
                        </form>
                    </div>
                    <nav>
                        <ul>
                            <li>
                                <a href="/home" title="">
                                    <span><img src={process.env.PUBLIC_URL + "/images/icon1.png"} alt="" /></span>
                                    Home
                        </a>
                            </li>
                            <li>
                                <a href="/companies" title="">
                                    <span><img src={process.env.PUBLIC_URL + "/images/icon2.png"} alt="" /></span>
                                    Posts
                        </a>
                                <ul>
                                    <li><a href="http://localhost:3000/trending" title=""><i class="fas fa-fire-alt"></i> Trending</a></li>
                                    <li><a href="http://localhost:3000/created" title=""><i class="fas fa-bullhorn"></i> New</a></li>
                                    <li><a href="http://localhost:3000/voted" title=""><i class="fas fa-star"></i> voted</a></li>
                                    <li><a href="http://localhost:3000/children" title=""><i class="fas fa-comments-dollar"></i> Commented</a></li>
                                    <li><a href="http://localhost:3000/popular" title=""><i class="fas fa-rocket"></i> Popular</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="https://explorer.voilk.com" title="">
                                    <span><img src={process.env.PUBLIC_URL + "/images/icon3.png"} alt="" /></span>
                                    explorer
                        </a>
                            </li>
                            <li>
                                <a href="/users" title="">
                                    <span><img src={process.env.PUBLIC_URL + "/images/icon4.png"} alt="" /></span>
                                    Members
                        </a>
                            </li>
                            <li>
                                <a href="https://jobs.voilk.com" title="">
                                    <span><img src={process.env.PUBLIC_URL + "/images/icon5.png"} alt="" /></span>
                                    Jobs
                        </a>
                            </li>
                            <li><a href="/user/login" title="">
                                <span><i class="fas fa-sign-in-alt"></i></span>
                                Login
								</a>
                            </li>
                            <li><a href="https://landing.voilk.com/register" title="">
                                <span><i class="fas fa-user-plus"></i></span>
                                Register
								</a>
                            </li>
                        </ul>
                    </nav>
                    <div className="menu-msg">
                        <div class="menu-btn">
                            <a href="#" title=""
                                onClick={e => {
                                    e.preventDefault();
                                    setMenuButton(!menuButton)
                                    setNotif(false)
                                    setMessagbox(false)
                                    setAccountMenu("none")
                                    console.log("Menu button " + menuButton)
                                }}

                            ><i class="fa fa-bars"></i></a>
                        </div>
                        {menuButton ?

                            <div class="user-account-settingss d-block">
                                <h3>Posts</h3>
                                <ul class="us-links">
                                    <li><a href="http://localhost:3000/trending" title=""><i class="fas fa-fire-alt"></i> Trending</a></li>
                                    <li><a href="http://localhost:3000/created" title=""><i class="fas fa-bullhorn"></i> New</a></li>
                                    <li><a href="http://localhost:3000/voted" title=""><i class="fas fa-star"></i> voted</a></li>
                                    <li><a href="http://localhost:3000/children" title=""><i class="fas fa-comments-dollar"></i> Commented</a></li>
                                    <li><a href="http://localhost:3000/popular" title=""><i class="fas fa-rocket"></i> Popular</a></li>
                                </ul>
                                <h3>Explorer</h3>
                                <ul className="us-links">
                                    <li><a href="https://explorer.voilk.com">Blockchain Explorer</a></li>
                                </ul>
                                <h3>Users</h3>
                                <ul className="us-links">
                                    <li><a href="/users" title="">Users</a></li>
                                </ul>
                                <h3>Jobs</h3>
                                <ul className="us-links">
                                    <li><a href="https://jobs.voilk.com" title="">Jobs</a></li>
                                </ul>
                            </div> : null}
                    </div>
                </div>
            </div>
        </header>
    );

    return (
        <header>
            <audio id="myAudio">
                <source src={sound} type="audio/ogg" />
            </audio>
            <div class="container">
                <div class="header-data">
                    <div class="logo">
                        <a href="/home" title=""><img src={process.env.PUBLIC_URL + "/images/logo.png"} alt="" /></a>
                    </div>
                    <div class="search-bar">
                        <form>
                            <input type="text" name="search" placeholder="Search..." />
                            <button type="submit"><i class="la la-search"></i></button>
                        </form>
                    </div>
                    <nav class="d-none d-lg-block d-md-block">
                        <ul>
                            <li>
                                <a href="/home" title="">
                                    <span><img src={process.env.PUBLIC_URL + "/images/icon1.png"} alt="" /></span>
                                    Home
                                    </a>
                            </li>
                            <li>
                                <a href="/companies" title="">
                                    <span><img src={process.env.PUBLIC_URL + "/images/icon2.png"} alt="" /></span>
                                    Posts
                                    </a>
                                <ul>
                                    <li><a href="http://localhost:3000/trending" title=""><i class="fas fa-fire-alt"></i> Trending</a></li>
                                    <li><a href="http://localhost:3000/created" title=""><i class="fas fa-bullhorn"></i> New</a></li>
                                    <li><a href="http://localhost:3000/voted" title=""><i class="fas fa-star"></i> voted</a></li>
                                    <li><a href="http://localhost:3000/children" title=""><i class="fas fa-comments-dollar"></i> Commented</a></li>
                                    <li><a href="http://localhost:3000/popular" title=""><i class="fas fa-rocket"></i> Popular</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="https://explorer.voilk.com" title="">
                                    <span><img src={process.env.PUBLIC_URL + "/images/icon3.png"} alt="" /></span>
                                    Explorer
                                    </a>
                            </li>
                            <li>
                                <a href="/users" title="">
                                    <span><img src={process.env.PUBLIC_URL + "/images/icon4.png"} alt="" /></span>
                                    Members
                                    </a>
                            </li>
                            <li>
                                <a href="https://jobs.voilk.com" title="">
                                    <span><img src={process.env.PUBLIC_URL + "/images/icon5.png"} alt="" /></span>
                                    Jobs
                                    </a>
                            </li>
                        </ul>
                    </nav>

                    <div className="menu-msg">
                        <div class="menu-btn">
                            <a href="#" title=""
                                onClick={e => {
                                    e.preventDefault();
                                    setMenuButton(!menuButton)
                                    setNotif(false)
                                    setMessagbox(false)
                                    setAccountMenu("none")
                                    console.log("Menu button " + menuButton)
                                }}

                            ><i class="fa fa-bars"></i></a>
                        </div>
                        {menuButton ?

                            <div class="user-account-settingss d-block" >
                                <h3>Posts</h3>
                                <ul class="us-links">
                                    <li><a href="http://localhost:3000/trending" title=""><i class="fas fa-fire-alt"></i> Trending</a></li>
                                    <li><a href="http://localhost:3000/created" title=""><i class="fas fa-bullhorn"></i> New</a></li>
                                    <li><a href="http://localhost:3000/voted" title=""><i class="fas fa-star"></i> voted</a></li>
                                    <li><a href="http://localhost:3000/children" title=""><i class="fas fa-comments-dollar"></i> Commented</a></li>
                                    <li><a href="http://localhost:3000/popular" title=""><i class="fas fa-rocket"></i> Popular</a></li>
                                </ul>
                                <h3>Explorer</h3>
                                <ul className="us-links">
                                    <li><a href="https://explorer.voilk.com">Blockchain Explorer</a></li>
                                </ul>
                                <h3>Users</h3>
                                <ul className="us-links">
                                    <li><a href="/users" title="">Users</a></li>
                                </ul>
                                <h3>Jobs</h3>
                                <ul className="us-links">
                                    <li><a href="https://jobs.voilk.com" title="">Jobs</a></li>
                                </ul>
                            </div> : null}
                    </div>
                    {!isLoggedOut(username, password) ? <>
                        <div class="notification-msg">
                            <div class="user-info" caret="true">
                                <ul>
                                    <li>
                                        <a href="#" title="" class="not-box-open"
                                            onClick={e => {
                                                e.preventDefault()
                                                notif ? setNotif(false) : setNotif(true)
                                                setMessagbox(false)
                                                setAccountMenu("none")
                                            }}
                                        >
                                            <i class="fas fa-envelope" style={{ fontSize: "25px" }}> </i>
                                            <sup>
                                                <span class="badge badge-pill badge-light">{pMessages.length}</span></sup>
                                        </a>
                                        <div class="message_box" id="notification" style={{ display: notif && pMessages.length > 0 ? "block" : "none" }}>
                                            <div class="nt-title">
                                                <h4>Personal Messages</h4>
                                                <a href="#" title="">Clear all</a>
                                            </div>
                                            <div class="nott-list">
                                                {pMessages.reverse().map(pmsg => <Pmessage p={pmsg} />)}
                                                <div class="view-all-nots">
                                                    <a href="#" title="">View All Notification</a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <a href="#" title="" class="not-box-openm"

                                            onClick={e => {
                                                e.preventDefault()
                                                messagbox ? setMessagbox(false) : setMessagbox(true)

                                                setNotif(false)
                                                setAccountMenu("none")
                                            }}
                                        >
                                            <i class="fas fa-bell" style={{ fontSize: "25px" }}></i>
                                            <sup>
                                                <span class="badge badge-pill badge-light">{userNotifs.length}</span>
                                            </sup>

                                        </a>
                                        <div class="message_box" id="message" style={{ display: messagbox && userNotifs.length > 0 ? "block" : "none" }}>
                                            <div class="nt-title">
                                                <h4>Notifications</h4>
                                                <a href="#" title="">Clear all</a>
                                            </div>
                                            <div class="nott-list">

                                                {userNotifs.reverse().map(nof => {
                                                    return (<Notification nof={nof} />)
                                                })}
                                                <div class="view-all-nots">
                                                    <a href="messages.html" title="">View All Messsages</a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                </ul>
                                <img src={metadata.profile_image || process.env.PUBLIC_URL + "/images/resources/user.png"} alt="" width="30px" height="30px" />
                                <a href={"/profile/@" + username} title="">{userdata.name.slice(0, 6)} </a>
                                <a href="#" title="" onClick={(e) => {
                                    e.preventDefault()
                                    accountMenu == "none" ? setAccountMenu("block") : setAccountMenu("none")

                                    setNotif(false)
                                    setMessagbox(false)

                                }}><i class="la la-sort-down"></i></a>
                            </div>
                            <div class="user-account-settingss" style={{ display: accountMenu }}>
                                <h3 >Profile Info</h3>
                                <DropdownItem>@{userdata.name}</DropdownItem>
                                <DropdownItem divider />
                                <h3>Setting</h3>
                                <ul class="us-links">
                                    <li><a href="/roar" title=""><i class="la la-edit"></i> Create a Post</a></li>
                                    <li><a href="#" title="">Privacy</a></li>
                                    <li><a href="#" title="">Faqs</a></li>
                                    <li><a href="#" title="">Terms & Conditions</a></li>
                                    <li><a href="/user/logout" title=""><i class="la la-close"></i> Logout</a></li>
                                </ul>
                            </div>

                        </div> </>
                        : <div class="notification-msg">
                            <div class="user-info caret">
                                <ul>

                                    <li><a href="/user/login" title="">
                                        <span><i class="fas fa-sign-in-alt"></i></span>
                                        Login
								</a>
                                    </li>
                                    <li><a href="https://landing.voilk.com/register" title="">
                                        <span><i class="fas fa-user-plus"></i></span>
                                        Register
								</a>
                                    </li>
                                </ul>
                            </div>
                        </div>}
                </div>
            </div>
        </header>
    )
}

export default Header
