import React from 'react'
import Message from './Message'

function Messages({messages, username}) {

    if(!messages) return null

    return (
        <div class="messages-line" id="messages-area" style={{paddingTop: "110px"}}>
            {messages.map((message, i) => {
                return (<Message message={message} key={i} username={username}/>)})
            }
        </div>
    )
}

export default Messages
