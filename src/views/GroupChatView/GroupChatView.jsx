import React, { useEffect, useState, useContext } from 'react';
import { UserContext, LoginContext, SocketContext } from "../../contexts"
import { useParams } from 'react-router-dom'

import Messages from './Messages';
import Users from './Users';
import Profile from "../../assets/user.png"
import { isLoggedOut } from '../../constants/isloggedin';
import SendMessage from './SendMessage';

function GroupChatView() {
    const { tag } = useParams()
    const socket = useContext(SocketContext)

    const [users, setUsers] = useState('');
    const [messages, setMessages] = useState([]);
    const [removeMessage, setRemoveMessage] = useState(null)

    const [groupid, setGroupid] = useState(tag)
    const context = useContext(LoginContext);
    const [state, setState, fetchData] = useContext(UserContext);
    const username = context.username
    const password = context.password
    const [msgCount, setMsgCount] = useState(0)

    /// intersection observer
    const [intersectionElm, setIntersectionElm] = useState(null)
    let observer;

    function handleIntersect(entries, observer) {
        let entry = entries[0]
        
        if(entry.isIntersecting){
            localStorage.setItem("u-message", null)
            setMsgCount(0)
            const schroll = document.getElementById("messages-area")
            schroll.scrollTop = schroll.scrollHeight;
            observer.disconnect()
        }
    }

    function createObserver() {
      
        let options = {
          root: null,
          rootMargin: "0px",
          threshold: 0.1
        };
        if(intersectionElm){
            observer = new IntersectionObserver(handleIntersect, options);    
            observer.observe(intersectionElm);
        }
    }

    useEffect(() => {
        let element = document.getElementById("messages-area").lastChild
        setIntersectionElm(element)
        if(element)
        createObserver();
    }, [messages, intersectionElm])


    useEffect(() => {
        socket.emit('join', { 
                username, 
                groupid, 
                key: password 
        }, (error) => {
                if (error) {
                    alert(error);
                }
        });
    }, [])

    useEffect(() => {
        if(removeMessage){
          let newMsgs  = messages.filter(item => item.id !== removeMessage)
          setMessages(newMsgs)
        }
    }, [removeMessage])

    useEffect(() => {

        socket.on("roomusers", (data) => {
            console.log(data)
            setUsers(data)
        })

        socket.on("roomdata", (data) => {
            console.log("Received Messages ..")
            setMessages(data)
        })

        socket.on("remove_message_user", (id) => {
            console.log("Remove message ", id)
            setRemoveMessage(id)
        })
    }, [])

    useEffect(() => {
        socket.on('message', message => {
          setMessages(messages => [ ...messages, message ]);
            if(message.username!=username){
                let x = localStorage.getItem("u-message")
                let arr = [0]
                if(x==null||x=="null"){
                    let item = JSON.stringify(arr)
                    setMsgCount(1)
                    localStorage.setItem("u-message", item)
                }
                else {
                    let cnt = JSON.parse(x)
                    cnt.push(0)
                    setMsgCount(cnt.length)
                    let item = JSON.stringify(cnt)
                    localStorage.setItem("u-message", item)
                }
            }
            else{
                console.log("clearing messages")
                localStorage.setItem("u-message", null)
                setMsgCount(0)
                const schroll = document.getElementById("messages-area")
                schroll.scrollTop = schroll.scrollHeight;
            }
        });
        
        
    }, []);

    if(isLoggedOut(username, password))
    {   window.location = "/home"
        return null;
        
    }


    return (
        <>
        <section class="banner">
            <span class="banner-title">Chat with #{groupid}({msgCount})</span>
        </section>
        <section class="messages-page">
            <div class="container">
                <div class="messages-sec">
                    <div class="row">
                        <div class="col-lg-4 col-md-12 no-pdd">
                            <div class="msgs-list">
                                <div class="msg-title">
                                    <h3>#{groupid}({messages.length})</h3>
                                    <ul>
                                        <li><a href="#" title=""><i class="fa fa-cog"></i></a></li>
                                        <li><a href="#" title=""><i class="fa fa-ellipsis-v"></i></a></li>
                                    </ul>
                                </div>
                                <div class="messages-list">
                                    <Users users={users} username={username} count={msgCount}/>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-8 col-md-12 pd-right-none pd-left-none">
                            <div class="main-conversation-box">
                                <div class="message-bar-head">
                                    <div class="usr-msg-details">
                                        <div class="usr-ms-img">
                                            <img src="images/resources/m-img1.png" alt="" />
                                        </div>
                                        <div class="usr-mg-info">
                                            <h3>{username}</h3>
                                            <p>Online</p>
                                        </div>
                                    </div>
                                    <a href="#" title=""><i class="fa fa-ellipsis-v"></i></a>
                                </div>
                                <Messages messages={messages} username={username} />
                                {msgCount==0?null:<div className="msg-notification">
                                    <div className="msg-notif">
                                        You have {msgCount} new {msgCount==1?"message":"messages"} <a href="#" onClick={(e) =>{
                                            e.preventDefault()
                                            const schroll = document.getElementById("messages-area")
                                            schroll.scrollTop = schroll.scrollHeight;
                                        }}>Click here</a>  
                                    </div>
                                </div>}
                                <SendMessage socket={socket} groupid={groupid}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
</>
    );
}

export default GroupChatView;
