import React,  {useState, useEffect, useContext} from 'react'
import ChatMessage from './ChatMessage';
import ChatMessages from './ChatMessages';
import Profile from "../../assets/user.png"
import { SocketContext } from '../../contexts';

function ChatElement({username, context, state, currentUser}){

    const socket = useContext(SocketContext)

    const [isVisible, setIsVisible] = useState(false)
    const [messages, setMessages] = useState([]);
    const [msgCount, setMsgCount] = useState(0)
    const [intersectionElm, setIntersectionElm] = useState(null)
    const [groupid, setGroupid] = useState("")

    let observer;

    function handleIntersect(entries, observer) {
        let entry = entries[0]
        
        if(entry.isIntersecting){
            localStorage.setItem("us-message", null)
            setMsgCount(0)
            const schroll = document.getElementById("chat-hist")
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

        let profile = state.userdata.json_metadata.profile_image || Profile
        let about = state.userdata.json_metadata.about || "I am cool :)"
        let folls = state.userdata.user_followers || []
        let muted = state.userdata.user_muted || []
        let ignored = state.userdata.user_ignored || []
        let following = state.userdata.user_following || []
        let join_time = new Date()

        setGroupid(username + ":" + context.username)
        console.log(groupid)
        console.log(socket.id)
        if(groupid){
        socket.emit('join', { 
            username: context.username, 
            groupid, 
            profile, 
            about, 
            join_time, 
            folls, 
            following, 
            ignored, 
            muted 
        }, (error) => {
            if (error) {
                alert(error);
            }
        });
        }
    }, [socket, state, groupid])

    useEffect(() => {
        if(currentUser==username)
        setIsVisible(true)
    }, [currentUser])

    useEffect(() => {
        let element = document.getElementById("chat-hist").lastChild
        setIntersectionElm(element)
        if(element)
        createObserver();
    }, [messages, intersectionElm])
    useEffect(() => {
        socket.on('message', message => {
          setMessages(messages => [ ...messages, message ]);
            if(message.user!=username){
                let x = localStorage.getItem("us-message")
                let arr = [0]
                if(x==null||x=="null"){
                    let item = JSON.stringify(arr)
                    setMsgCount(1)
                    localStorage.setItem("us-message", item)
                }
                else {
                    let cnt = JSON.parse(x)
                    cnt.push(0)
                    setMsgCount(cnt.length)
                    let item = JSON.stringify(cnt)
                    localStorage.setItem("us-message", item)
                }
            }
            else{
                console.log("clearing messages")
                localStorage.setItem("us-message", null)
                setMsgCount(0)
                const schroll = document.getElementById("chat-hist")
                schroll.scrollTop = schroll.scrollHeight;
            }
        });
        
        socket.on("roomData", ({ users, messages }) => {
          setMessages(messages);
        });
    }, []);

    return(
        <div class="chatbox">
            <div class="chat-mg">
                <a href="#" title=""><img src="images/resources/usr-img2.png" alt=""
                onClick={(e)=>{
                    e.preventDefault()
                    setIsVisible(!isVisible)
                }}
                /></a>
            </div>
            <div class={isVisible?"conversation-box active":"conversation-box"}>
                <div class="con-title mg-3">
                    <div class="chat-user-info">
                        <img src="images/resources/us-img1.png" alt="" />
                        <h3>{username} <span class="status-info"></span></h3>
                    </div>
                    <div class="st-icons">
                        <a href="#" title=""><i class="la la-cog"></i></a>
                        <a href="#" title="" class="close-chat"
                        onClick={(e)=>{
                            e.preventDefault()
                            setIsVisible(!isVisible)
                        }}
                        ><i class="la la-minus-square"></i></a>
                        <a href="#" title="" class="close-chat"
                        onClick={(e)=>{
                            e.preventDefault()
                            setIsVisible(!isVisible)
                        }}
                        ><i class="la la-close"></i></a>
                    </div>
                </div>
                <ChatMessages messages={messages} username={username}/>
                <ChatMessage socket={socket}/>
            </div>
        </div>
    )
}

export default ChatElement
