import React, { useState, useContext, useEffect, useRef, useCallback } from 'react'
import { UserContext, LoginContext } from "../../contexts"
import _ from "lodash";
import TimeAgo from 'timeago-react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { DELETE_ARTICLE } from "../../queries/DELETE_ARTICLE";
import { Alert } from 'reactstrap';
import Slider from 'react-rangeslider'

// To include the default styles
import '../../assets/slider.css'
import { UPVOTE } from '../../queries/UPVOTE';
import { GET_POST } from '../../queries/GET_POST';
import { POST_COMMENT } from '../../queries/POST_COMMENT';
import { SHARE_POST } from '../../queries/SHARE_POST';
import isLoggedin from '../../constants/isloggedin';
import Comment from '../../components/Comment/Comment';

var eskape = require('eskape');
const removeMd = require('remove-markdown');
const ReactMarkdown = require('react-markdown')
const htmlToText = require('html-to-text');

function removeUnwanted(post) {
    // remove links and images
    //mystr = "check this out <a href='http://www.google.com'>Click me</a>. cool, huh?";

    // remove markdown
    let plainText = removeMd(post, {
        stripListLeaders: true, // strip list leaders (default: true)
        listUnicodeChar: '',     // char to insert instead of stripped list leaders (default: '')
        gfm: true,               // support GitHub-Flavored Markdown (default: true)
        useImgAltText: false      // replace images with alt-text, if present (default: true)
    });


    // remove links
    plainText = plainText.replace(/<a\b[^>]*>(.*?)<\/a>/i, "")
    plainText = plainText.replace(/https?:\/\/[^\s]+/g, '');

    return plainText
}

const SinglePost = ({ p, setposts }) => {

    const context = useContext(LoginContext);
    const username = context.username;
    const wif = context.password;
    const [deletearticle] = useMutation(DELETE_ARTICLE);
    const [postComment] = useMutation(POST_COMMENT);
    const [sharePost] = useMutation(SHARE_POST);

    const [upvote] = useMutation(UPVOTE);
    const [post, setPost] = useState(p)
    const [notification, setNotification] = useState("")
    const { loading, error, data, refetch, networkStatus } = useQuery(GET_POST, {
        variables: {
            username: post.author,
            permlink: post.permlink
        },
    });
    const [likePercent, setLikePercent] = useState(1)
    const [displayPost, setDisplayPost] = useState("auto")
    const [editoptions, setEditoptions] = useState("ed-options")
    const [message, setMessage] = useState(null)
    const [replyPost, setReplyPost] = useState("none")
    const [spinner, setSpinner] = useState(<i class="fas fa-heart"></i>)
    const [commentBody, setCommentBody] = useState("")
    const [commentSpinner, setCommentSpinner] = useState(<i class="la la-comment"></i>)
    const [shareButton, setShareButton] = useState(<li><a href="#" 
    onClick={(e)=>{
        e.preventDefault()
        handleShare(post.author, post.permlink)
    }}
    ><i class="fas fa-share-square"></i></a></li>)
    const [shareLoading, setShareLoading] = useState(<li><i class="fas fa-spinner rotating"></i></li>)
    const [shareBtn, setShareBtn] = useState(shareButton)
    const [tickShare, setTickShare] = useState(null)

    const [slider, setSlider] = useState(false)

    let voted = (post.active_votes.filter(e => {
        if (e.voter == username) {
            if (e.percent == 0) return false
            else return true
        }
    }).length > 0)

    useEffect(() => {
        if (!loading) {
            setPost(data.get_content)
        }
    }, [spinner, data])
    useEffect(() => {
        const timer = setTimeout(() => {
            setNotification("")
        }, 6000);
        return () => clearTimeout(timer);
    }, [notification]);
    let json = JSON.parse(post.json_metadata)
    function handledelete(permlink) {
        setEditoptions("ed-options")
        setMessage(<div><Alert color="primary">
            <div class="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div><br /> Deleting post kindly wait ..
          </Alert></div>)

        deletearticle({
            variables: {
                username,
                wif,
                permlink
            }
        }).then(x => {
            console.log(x)
            if (x.data.delete_a_post.result) {
                setMessage(<Alert color="success">
                    Your post was successfully deleted!!
                    </Alert>)
                setDisplayPost("none")
            }
            else {
                setMessage(<div class="alert alert-danger" role="alert">
                    <a href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            setMessage(null)

                        }}
                    ><i class="la la-close"></i></a> We could not delete it!

                </div>)
            }
        })

    }
    function handleupvote(author, permlink, weight) {
        console.log(weight)
        setSpinner(<i class="fas fa-spinner rotating"></i>)
        upvote({
            variables: {
                username,
                wif,
                author,
                permlink,
                weight
            }
        }).then(x => {
            console.log(x)
            if (x.data.upvote.result) {

                refetch().then(x => {
                    console.log(x)
                    setSpinner(<i class="fas fa-heart"></i>)
                    setSlider(false)
                })

            }
            else {
                setSpinner(<i class="fas fa-heart"></i>)
                setSlider(false)
            }
        }).catch(x => {
            console.log(x)
            setNotification(<ul class="skill-tags"><div class="alert alert-danger" role="alert">
                {x.toString().slice(15, 200)}...
          </div></ul>)
            setSpinner(<i class="fas fa-heart"></i>)
            setSlider(false)
        })

    }
    function handlecomment(parent_author, parent_permlink, tags, body) {
        setCommentSpinner(<i class="fas fa-spinner rotating"></i>)
        let text = eskape`${body}`

        postComment({
            variables: {
                username,
                wif,
                parent_author,
                parent_permlink,
                tags,
                body: text
            }
        }).then(x => {
            console.log(x)
            if (x.data.make_a_comment.result) {
                refetch().then(x => {
                    console.log(x)
                    setCommentSpinner(<i class="la la-comment"></i>)
                    setReplyPost("none")
                })

            }
            else {
                setCommentSpinner(<i class="la la-comment"></i>)

            }
        }).catch(x => {
            console.log(x)
            setCommentSpinner(<i class="la la-comment"></i>)

            setNotification(<ul class="skill-tags"><div class="alert alert-danger" role="alert">
                {x.toString().slice(15, 200)}...
          </div></ul>)
        })
    }
    function handleShare(author, permlink){
        setShareBtn(shareLoading)
        /// do the share thing here..
        sharePost({
            variables: {
                username,
                wif,
                author,
                permlink
            }
        }).then(x => {
            console.log(x)
            if (x.data.share.result) {
                refetch().then(x => {
                    setTickShare(<li>Success <i class="fas fa-check text-success" style={{fontSize: "30px"}}></i></li>)
                    setTimeout(() => {
                        setTickShare(null)
                    }, 3000)
                }
            )} else {
                setShareBtn(shareButton)
            }
        
        })
    }
    return (
        <div class="post-bar" key={post.permlink} style={{ display: displayPost }}>
            <div class="post-bar no-margin">
                <div class="post_topbar">
                    <div class="usy-dt">
                        <img src={post.account.json_metadata.profile_image} height="40px" width="40px" alt="" />
                        <div class="usy-name">
                            <h3><a href={"/profile/@" + post.author}>@{post.author}</a></h3>
                            <span><img src={process.env.PUBLIC_URL + "/images/clock.png"} alt="" /><TimeAgo datetime={post.created + 'Z'} /></span>
                        </div>
                    </div>
                    <div class="ed-opts">
                        <a href="#" title=""
                            onClick={(e) => {
                                e.preventDefault()
                                editoptions == "ed-options" ? setEditoptions("ed-options active") : setEditoptions("ed-options")
                            }}
                            class="ed-opts-open"><i class="la la-ellipsis-v"></i></a>
                        <ul class={editoptions}>
                            {post.author == username ? <>
                                <li><a href={`/edit/@${post.author}/${post.permlink}`} title="">
                                    <i class="la la-edit"></i> Edit Post</a></li>
                                <li><a href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        //deletepost
                                        handledelete(post.permlink)

                                    }}
                                    title=""><i class="la la-trash"></i> Delete Post</a></li>
                            </> : null}

                            <li><a href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setDisplayPost("none")
                                }}
                                title=""><i class="la la-eye-slash"></i> Hide Post</a></li>
                        </ul>
                    </div>
                </div>
                <div class="epi-sec">
                    <ul class="descp">
                        <li><img src={process.env.PUBLIC_URL + "/images/icon8.png"} alt="" /><span><a href={"/trending/" + post.category}>{post.category}</a></span></li>
                        <li><img src={process.env.PUBLIC_URL + "/images/icon9.png"} alt="" /><span>{post.pending_payout_value}</span></li>
                    </ul>
                    {isLoggedin(username, wif)?<ul class="bk-links">
                        <>
                        {tickShare}
                        {post.reblogged_by.includes(username)?null:shareBtn}
                        </>
                        <li><a href={`/chat/${post.author}:${username}`} title=""><i class="la la-envelope"></i></a></li>
                    </ul>:null}
                </div>
                <div class="job_descp">
                    {message}
                    <h3><a href={"/post/" + post.category + "/@" + post.author + "/" + post.permlink}>{post.title}</a></h3>
                    <ul class="job-dt">
                        <li><a href="#" title="">Next Payout</a></li>
                            <li><span>{post.cashout_time}</span></li>
                    </ul>
                    <p><ReactMarkdown source={post.body} escapeHtml={false} /></p>
                    <ul class="skill-tags">
                        {json.tags.map((tag, i) => (<li key={i}><a href={"/trending/" + tag} title="">{tag}</a></li>))}

                    </ul>

                    {notification}
                </div>
                <div class="job-status-bar">
                    <ul class="like-com">
                        <li>
                            <a href="#"
                                class={voted ? "active" : ""}
                                onClick={(e) => {
                                    e.preventDefault()
                                    slider ? setSlider(false) : setSlider(true)
                                }}
                            >{spinner} Like</a>
                            <img src={process.env.PUBLIC_URL + "/images/liked-img.png"} alt="" />
                            <span>{post.net_votes}</span>
                        </li>
                        <li><a href="#" class="com"><i class="fas fa-comment-alt"></i> Comments {post.children}</a></li>
                            <li><a href="#" class="com"><i class="fas fa-share-square"></i>Shares {post.reblogged_by.length-1}</a></li>
                        {slider&&isLoggedin(username, wif) ?
                            <div className="card card-body">
                                {voted ? <span><a href="#"
                                    class="active"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        let weight = 0

                                        let permlink = post.permlink
                                        let author = post.author
                                        handleupvote(author, permlink, weight)
                                    }}
                                >{spinner} UnLike </a>
                                </span> : <span><a href="#"

                                    onClick={(e) => {
                                        e.preventDefault()
                                        let weight = parseInt(likePercent * 100)
                                        let permlink = post.permlink
                                        let author = post.author
                                        handleupvote(author, permlink, weight)
                                    }}
                                >{spinner} Like </a>({likePercent})%
                            <Slider
                                            value={likePercent}
                                            orientation="horizontal"
                                            onChange={(value) => { setLikePercent(value) }}
                                        /></span>}

                            </div> : null}
                    </ul>
                    {isLoggedin(username, wif)?<a href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            console.log(replyPost)
                            replyPost == "none" ? setReplyPost("auto") : setReplyPost("none")
                        }}
                    > Reply</a>:null}
                </div>
            </div>
            {replyPost == "none" ? null :
                <div class="widget-area no-padding blank">
                    <div class="status-upload">
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            console.log(post)
                            handlecomment(post.author, post.permlink, post.category, commentBody)
                        }}>
                            <textarea placeholder="What are you doing right now?" value={commentBody}
                                onChange={(e) => {
                                    e.preventDefault()
                                    let text = e.target.value
                                    setCommentBody(text)
                                    console.log(text)
                                }}></textarea>
                            <ul>
                                <li><a title="" data-toggle="tooltip" data-placement="bottom" data-original-title="Picture"><i class="la la-picture-o"></i></a></li>
                            </ul>
                            <button type="submit" class="btn btn-success green" onClick={

                                (e) => {
                                    e.preventDefault()
                                    console.log(post)
                                    handlecomment(post.author, post.permlink, post.category, commentBody)
                                }
                            }>{commentSpinner} Reply</button>
                        </form>
                    </div>
                </div>}
            <div class="comment-section">
                <div class="comment-sec">
                <Comment comment={post} key={post.permlink} context={context} refetch={refetch} />
                </div>

            </div>
        </div>

    )
}

export default SinglePost