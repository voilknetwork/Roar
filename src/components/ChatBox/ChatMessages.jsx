import React from 'react'
import TimeAgo from 'timeago-react';
const ReactMarkdown = require('react-markdown')

function ChatMessages({ messages, username }) {

    if (!messages) return null

    return (
        <div class="chat-hist" id="chat-hist" data-mcs-theme="dark">
<div class="date-nd">
        <span>Say hi! to start chatting</span>
    </div>
            {messages.map((message, i) => {

                let groupid = message.groupid;

                console.log(groupid)
                console.log(username)
                console.log(message)
                console.log(groupid.includes(message.user))
                if (!(groupid.includes(message.user))) return null

                return (<ChatMsg message={message} key={i} username={username} />)
            })
            }
        </div>
    )
}

function ChatMsg({ message, username }) {

    return (<div class={message.user == username ? "chat-msg st2" : "chat-msg"}>
        <ReactMarkdown source={message.text} escapeHtml={false} />
        <span><TimeAgo datetime={message.created_at} /></span>
    </div>)
}

export default ChatMessages
