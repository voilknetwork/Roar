import React, {useContext} from 'react'
import TimeAgo from 'timeago-react';
import { LoginContext, SocketContext } from '../../contexts';
const ReactMarkdown = require('react-markdown')
const Message = ({ message }) => {

    const {username, password} = useContext(LoginContext)
    const socket = useContext(SocketContext)

    const deleteComment =(id) => {
        socket.emit("delete_message", {id, username, key: password, groupid: message.groupid}, (error) => {
            if (error) {
                alert(error)
            }
        })
    }

    return (
        <div class={message.username == username ? "main-message-box ta-right" : "main-message-box st3"}>
            <div class={message.username == username ? "message-dt" : "message-dt st3"}>
                <div class="message-inner-dt">
                <ReactMarkdown source={message.text} escapeHtml={false} />
                
                
                
                </div>
                <span style={{fontSize: "10px"}}> 
                    <a href={`/profile/@${message.username.toLowerCase()}`}>@{message.username.toLowerCase()}
                    </a> - <TimeAgo datetime={message.created_at} /> | <a href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            deleteComment(message.id)
                        }}
                    > <i class="fas fa-trash"></i> </a></span>
            </div>
            <div class="messg-usr-img">
                <img src={message.profile_image} alt="" />
            </div>
        </div>
    )
}

export default Message
