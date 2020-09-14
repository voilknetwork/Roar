import React, {useState, useEffect} from 'react'
import profile from "../../assets/user.png"
import axios from "axios"
import { Badge } from 'reactstrap'
const API_LINK = "https://graphql.voilk.com/graphql"

function ChatList({followers, context, state}){

    const [chatVisible, setChatVisible] = useState(false)
    const [data, setData] = useState(null)

    useEffect(() => {

        const query = `query GetAccounts{
            accounts(usernames: ${JSON.stringify(followers)}){
                id
                name
                coining_shares
                json_metadata {
                  about
                  profile_image
                }
            }
        }`
        console.log(query)
        axios({
            url: API_LINK,
            method: 'post',
            data: { query: query }
          }).then((result) => {
            console.log(result.data)
            
            if(result.data.data){
                setData(result.data.data)
            }
          }).catch(error=>{
              console.log(error)
          });

    }, [followers])

    if(followers.length<1||!data) return null

    return(
        <>
        {/* {chatBoxes.map(chatbox => {
            return(<ChatElement username={chatbox} current={currentUser} context={context} state={state}/>)
        })} */}
        <div class="chatbox">
            <div class="chat-mg bx">
                <a href="#" title=""
                onClick={(e) => {
                    e.preventDefault()
                    setChatVisible(!chatVisible)
                }}
                ><img src="images/chat.png" alt="" /></a>
                <span>2</span>
            </div>
            <div class={chatVisible?"conversation-box active":"conversation-box"}>
                <div class="con-title">
                    <h3>Messages</h3>
                    <a href="#" title="" class="close-chat"
                    onClick={(e)=>{
                        e.preventDefault()
                        setChatVisible(false)
                    }}
                    ><i class="la la-minus-square"></i></a>
                </div>
                <div class="chat-list">
                    {data.accounts.map(follower=> {
                        console.log(follower)
                        console.log(follower.json_metadata)
                        return(<div class="conv-list" onClick={(e) => {
                            e.preventDefault()
                            // if(!chatBoxes.includes(follower)){
                            //     setChatBoxes([...chatBoxes, follower])
                            // }
                            // setCurrentUser(follower)
                            window.location.href = `/chat/${follower.name}:${context.username}`
                        }}>
                        <div class="usrr-pic">
                            <img width="50px" height="50px" src={follower.json_metadata.profile_image?follower.json_metadata.profile_image:profile} alt="" />
                        </div>
                        <div class="usy-info">
                    <h3>{follower.name}</h3>
                    <span>{follower.coining_shares}</span>
                        </div>
                        <div class="ct-time">
                    <span><Badge className="primary">5</Badge></span>
                        </div>
                    </div>)
                    })}
                </div>
            </div>
        </div>
        </>
    )
}

export default ChatList
