import React, { useState, useCallback, useContext, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from "axios";
import { useQuery, useMutation } from '@apollo/react-hooks';
import { DELETE_ARTICLE } from '../../queries/DELETE_ARTICLE';
import { POST_COMMENT } from '../../queries/POST_COMMENT';
import { UPDATE_COMMENT } from '../../queries/UPDATE_COMMENT';
import { UPVOTE } from '../../queries/UPVOTE';
import {Alert} from 'reactstrap'
import Slider from 'react-rangeslider'
import TimeAgo from 'timeago-react';
import isLoggedin from '../../constants/isloggedin';
const ReactMarkdown = require('react-markdown')
var eskape = require('eskape');
function Comment({ comment, context, refetch }) {
    //console.log(comment)
    return (<ul>
        {comment.replies.length !== 0 &&
            comment.replies.map((reply, index) => {
                return (<Reply reply={reply} key={index} context={context} refetch={refetch} />)
            })}
    </ul>)
}

function Reply({ reply, context, refetch }) {
    let username = context.username
    let wif = context.password


    const [progress, setProgress] = useState("")
    const upload = (file, name = '') => {
        setProgress("Uploading file..")
        //bilal
        const formData = new FormData()

        let URIpost = "https://graphql.voilk.com/upload/files/"
        formData.append("photos", file)
    
        const config = {
            onUploadProgress: progressEvent => {
                let pr = (parseInt(progressEvent.loaded)/10000).toFixed(2)
                setProgress(pr + " %")
            }, // TO SHOW UPLOAD STATUS
            
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post(URIpost, formData, config, {
        }).then(res => {
            if(res.data.files[0]){

                let name = res.data.files[0].metadata.originalname;
                let url = res.data.files[0].metadata.fileurl;
                const image_md = `![${name}](${url})`;
                setCommentBody(message + " " + image_md)
                setProgress("100 %")
                setTimeout(() => {
                    setProgress("")
                }, 1000)
                
                // const { body } = this.state;
                // const { selectionStart, selectionEnd } = this.refs.postRef;
                // body.props.onChange(
                //     body.value.substring(0, selectionStart) +
                //         image_md +
                //         body.value.substring(selectionEnd, body.value.length)
                // );
                   
            }
            setTimeout(() => {
                setProgress("")
            }, 8000)

        })
    };

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        // Do something with the files
        if (!acceptedFiles.length) {
            if (rejectedFiles.length) {
                setProgress("Only image files...")
                console.log('onDrop Rejected files: ', rejectedFiles);
            }
            return;
        }

        const file = acceptedFiles[0];
        upload(file, file.name);

    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    const [deletearticle] = useMutation(DELETE_ARTICLE);
    const [postComment] = useMutation(POST_COMMENT);
    const [updateComment] = useMutation(UPDATE_COMMENT);


    const [upvote] = useMutation(UPVOTE);
    const [notification, setNotification] = useState("")
    const [likePercent, setLikePercent] = useState(1)
    const [displayPost, setDisplayPost] = useState("auto")
    const [editoptions, setEditoptions] = useState("ed-options")
    const [message, setMessage] = useState(null)
    const [replyPost, setReplyPost] = useState("none")
    const [editPost, setEditPost] = useState("none")

    const [spinner, setSpinner] = useState(<i class="fas fa-heart"></i>)
    const [dropMenu, setDropMenu] = useState(null)
    const [commentBody, setCommentBody] = useState("")
    const [editCommentBody, setEditCommentBody] = useState(reply.body)

    const [hideComment, setHideComment] = useState("auto")
    const [commentSpinner, setCommentSpinner] = useState(<i class="la la-comment"></i>)
    const [slider, setSlider] = useState(false)

    let voted = (reply.active_votes.filter(e => {
        if (e.voter == username) {
            if (e.percent == 0) return false
            else return true
        }
    }).length > 0)

    useEffect(() => {
        refetch()
    }, [spinner])
    useEffect(() => {
        const timer = setTimeout(() => {
            setNotification("")
        }, 6000);
        return () => clearTimeout(timer);
    }, [notification]);
    let json = JSON.parse(reply.json_metadata)
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
                refetch()
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
    function handleEditcomment(parent_author, parent_permlink, permlink, tags, body) {
        setCommentSpinner(<i class="fas fa-spinner rotating"></i>)
        let text = eskape`${body}`

        updateComment({
            variables: {
                username,
                wif,
                parent_author,
                parent_permlink,
                permlink,
                tags,
                body: text
            }
        }).then(x => {
            console.log(x)
            if (x.data.update_a_comment.result) {
                refetch().then(x => {
                    console.log(x)
                    setCommentSpinner(<i class="la la-comment"></i>)
                    setEditPost("none")
                })

            }
            else {
                setCommentSpinner(<i class="la la-comment"></i>)
            }
        }).catch(x => {
            console.log(x)
            setCommentSpinner(<i class="la la-comment"></i>)
            setEditPost("none")
            setNotification(<ul class="skill-tags"><div class="alert alert-danger" role="alert">
                {x.toString().slice(15, 200)}...
          </div></ul>)
        })
    }
    return (<li style={{display: hideComment}}>
        <div class="comment-list">
            <div class="bg-img">
                <img src={process.env.PUBLIC_URL + reply.account.json_metadata.cover_image} alt="" />
            </div>
            <div class="comment">
                <img src={reply.account.json_metadata.profile_image} height="40px" width="40px" alt="" />

                <h3><a href={"/profile/@" + reply.author}>{reply.author}</a></h3>

                <span><img src={process.env.PUBLIC_URL + "/images/clock.png"} alt="" /> <TimeAgo datetime={reply.created + `Z`} /></span>
                <a href="#" title="" 
                    onClick={(e) => {
                        e.preventDefault()
                        dropMenu!=null?setDropMenu(null):setDropMenu(
                        <div class="widget-area no-padding blank">
                            <div className="card card-body" style={{maxWidth: "150px", margin: "-10px", padding: "0px"}}>
                            
                            <ul style={{maxWidth: "150px", margin: "2px", padding: "2px"}}>
                            {username==reply.author?
                                <>
                                <li><a href="#" title=""
                                onClick={(e)=> {
                                    e.preventDefault()
                                    editPost=="none"?setEditPost("auto"):setEditPost("none")
                                    setDropMenu(null)

                                }}
                                >
                        <i class="la la-edit"></i> Edit</a></li>
                                <li> <a href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            //deletepost
                            handledelete(reply.permlink)

                        }}
                        title=""><i class="la la-trash"></i> Delete</a></li>
                            
                                <li><a href="#" title=""
                                onClick={(e) => {
                                    e.preventDefault()
                                    setHideComment("none")
                                }}
                                ><i class="la la-eye"></i> Hide Post</a></li>
                            </>
                            :<li><a href="#" title=""
                            onClick={(e) => {
                                e.preventDefault()
                                setHideComment("none")
                            }}
                            ><i class="la la-eye"></i> Hide Post</a></li>}
                            </ul>  
                            </div>
                            
                        </div>)
                    }}><i class="fas fa-ellipsis-h"></i></a>
                                {dropMenu}
                <div><ReactMarkdown source={reply.body} escapeHtml={false} />
                    {notification}
                </div>

                <a href="#"
                    class={voted ? "active" : ""}
                    onClick={(e) => {
                        e.preventDefault()
                        slider ? setSlider(false) : setSlider(true)
                    }}
                >{spinner} {reply.net_votes} Likes </a>

                {slider&&isLoggedin(username, wif) ?
                    <div className="card card-body" style={{ maxWidth: "250px", maxHeight: "100px" }}>
                        {voted ? <span><a href="#"
                            class="active"
                            onClick={(e) => {
                                e.preventDefault()
                                let weight = 0

                                let permlink = reply.permlink
                                let author = reply.author
                                handleupvote(author, permlink, weight)
                            }}
                        >{spinner} UnLike </a>
                        </span> : <span><a href="#"

                            onClick={(e) => {
                                e.preventDefault()
                                let weight = parseInt(likePercent * 100)
                                let permlink = reply.permlink
                                let author = reply.author
                                handleupvote(author, permlink, weight)
                            }}
                        >{spinner} Like </a>({likePercent})%
                    <Slider
                                    value={likePercent}
                                    orientation="horizontal"
                                    onChange={(value) => { setLikePercent(value) }}
                                /></span>}

                    </div> : null}
                <a href="#" class="com"><i class="fas fa-comment-alt"></i> Comments {reply.children}</a>
                
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
                        handlecomment(reply.author, reply.permlink, reply.category, commentBody)
                    }}>
                        <textarea placeholder="What are you doing right now?" value={commentBody}
                            onChange={(e) => {
                                e.preventDefault()
                                let text = e.target.value
                                setCommentBody(text)
                                console.log(text)
                            }}></textarea>
                        <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {
                        isDragActive ?
                        <p>Yep! just drop them here...</p> :
                    <p><i class="fa fa-camera"></i> Click or drag N drop images here {progress}</p>
                    }
                </div>
                        <button type="submit" class="btn btn-danger red" onClick={

                            (e) => {
                                e.preventDefault()
                                handlecomment(reply.author, reply.permlink, reply.category, commentBody)
                            }
                        }>{commentSpinner} Reply</button>
                    </form>
                </div>
            </div>}
            {editPost == "none" ? null :
            <div class="widget-area no-padding blank">
                <div class="status-upload">
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        handleEditcomment(reply.author, reply.permlink, reply.category, commentBody)
                    }}>
                        <textarea placeholder="What are you doing right now?" value={editCommentBody}
                            onChange={(e) => {
                                e.preventDefault()
                                let text = e.target.value

                                setEditCommentBody(text)
                                
                            }}></textarea>
                        <ul>
                            <li><a title="" data-toggle="tooltip" data-placement="bottom" data-original-title="Picture"><i class="la la-picture-o"></i></a></li>
                        </ul>
                        <button type="submit" class="btn btn-warning" onClick={

                            (e) => {
                                e.preventDefault()
                                handleEditcomment(reply.parent_author, reply.parent_permlink, reply.permlink, reply.category, editCommentBody)
                            }
                        }>{commentSpinner} Update</button>
                    </form>
                </div>
            </div>}
        <Comment comment={reply} context={context} refetch={refetch} />
    </li>)
}

export default Comment