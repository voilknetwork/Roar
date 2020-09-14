import React, { useState, useContext, useEffect } from 'react'
import { UserContext, LoginContext } from "../../contexts"
import _ from "lodash";
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import { useParams } from 'react-router-dom'
import { GET_POST } from '../../queries/GET_POST';
// import style manually
import { Alert } from 'reactstrap';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { UPDATE_ARTICLE } from "../../queries/UPDATE_ARTICLE";
import 'react-markdown-editor-lite/lib/index.css';

import CKEditor from 'ckeditor4-react';
var eskape = require('eskape');
const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function UpdateView() {
    const context = useContext(LoginContext);
    const username = context.username;
    const wif = context.password;
    const { user, permlink } = useParams();
    const [post_body, setPostbody] = useState("")
    const [title, setTitle] = useState("")
    const [tags, setTags] = useState("")
    const [updatearticle, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_ARTICLE);
    const [message, setMessage] = useState(null)
    const [category, setCategory] = useState("")
    const { loading, error, data } = useQuery(GET_POST, {
        variables: { username: user, permlink },
    });
    useEffect(() => {
        if (!loading) {
            setPostbody(data.get_content.post_body)
            setTitle(data.get_content.title)
            let json = JSON.parse(data.get_content.json_metadata)
            let tags = json.tags.toString().replace(/,/g, ' ');
            setTags(tags)
            setCategory(data.get_content.category)
        }
    }, [data])


    const handleSubmit = (evt) => {
        evt.preventDefault()
        let text = post_body
        setMessage(<div><Alert color="primary">
            <div class="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div> Updating post kind wait ..
              </Alert></div>)
        var txt = eskape`${text}`
        alert(txt);
        updatearticle({
            variables: {
                username,
                wif,
                permlink,
                category,
                title,
                tags,
                body: post_body
            }
        }).then(x => {
            console.log(x)
            if (x.data.update_a_post.result) {
                setMessage(<div><Alert color="success">
                    Your post was successfully Updated!!
              </Alert>
                    <a href={"/profile/@"+user}>Click here</a> to visit Your profile or <a href={"/post/"+category+"/@"+user+"/"+permlink}>Click here</a> to visit your post
              </div>)
            }
            else {
                console.log(x)
                setMessage(<div><Alert color="danger">
                    There was an error!!
              </Alert></div>)
            }
        }).catch(x => {
            console.log(x)
            setMessage(<div><Alert color="danger">
                There was an error!!
          </Alert></div>)
        })
    }
    const handleEditorChange = ({ html, text }) => {
        setPostbody(text)
    }




    if (loading) return (<>
        <section class="banner">

            <span class="banner-title"><i class="fa fa-edit"></i> Update a Roar!!</span>
        </section>
        <section class="Company-overview">
            <div class="container">
                <div class="row">
                    <div class="col-md-12 col-sm-24">
                        <div class="spinner">
                            <div class="bounce1"></div>
                            <div class="bounce2"></div>
                            <div class="bounce3"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>);
    if (error) return `Error! ${error}`;
    console.log(data)
    console.log(user + "||" + username)

    if (user != username) return (
        <>
            <section class="Company-overview">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12 col-sm-24">
                            <div class="post-project">
                                <div class="post-project-fields">
                                    You cannot Edit this post!! <a href={"/post/"+category+"/@" + user +"/"+permlink}>click here</a> to go back
                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
    return (
        <>
            <section class="banner">

                <span class="banner-title"><i class="fa fa-edit"></i> Update Post!!</span>
            </section>
            <section class="Company-overview">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12 col-sm-24">
                            <div class="post-project">
    <h2><i class="fa fa-edit"></i>Update: {title}</h2>
                                <div class="post-project-fields">
                                    <form onSubmit={e => handleSubmit(e)}>
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <input type="text" name="title" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                                            </div>
                                            <div class="col-lg-12">
                                                <MdEditor
                                                    value={data.get_content.body}
                                                    style={{ height: "500px" }}
                                                    renderHTML={(text) => mdParser.render(text)}
                                                    onChange={handleEditorChange}
                                                />
                                            </div>
                                            <div class="col-lg-12">
                                                <input type="text" name="tags" value={tags} placeholder="Upto 5 Tags separated by space" onChange={e => setTags(e.target.value)} />
                                            </div>
                                            <div class="col-lg-12">
                                                {mutationLoading && <p>Loading...</p>}
                                                {mutationError && <p>Error :( Please try again</p>}
                                                {message}
                                                <ul>
                                                    <li><button class="active" type="submit" value="update">Update Post</button></li>
                                                    <li><a href="#" title="">Clear</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </form>
                                </div></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
