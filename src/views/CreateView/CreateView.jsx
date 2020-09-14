import React, { useState, useContext, useEffect } from 'react'
import {UserContext, LoginContext} from "../../contexts"
import _ from "lodash";
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// import style manually
import { Alert } from 'reactstrap';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { POST_ARTICLE } from "../../queries/POST_ARTICLE";


import CKEditor from 'ckeditor4-react';
var eskape = require('eskape');
const mdParser = new MarkdownIt(/* Markdown-it options */);

function CreateView() {
    const context = useContext(LoginContext);
    const username = context.username;
    const wif = context.password;

    console.log(context)

    const [data, setdata] = useState("## Start typing here")
    const [title, setTitle] = useState("")
    const [tags, setTags] = useState("")
    const [postarticle, { loading: mutationLoading, error: mutationError }] = useMutation(POST_ARTICLE);
    const [message, setMessage] = useState(null)

    const handleSubmit = (evt) => {
        evt.preventDefault()
        let text = data
        setMessage(<div><Alert color="primary">
                <div class="spinner">
                    <div class="bounce1"></div>
                    <div class="bounce2"></div>
                    <div class="bounce3"></div>
                </div> Submitting post kind wait .. 
              </Alert></div>)
        var txt = eskape`${text}`
        alert(txt);
        postarticle({
            variables: {
                username,
                wif,
                title,
                tags,
                body: data
            }
        }).then(x=> {
            console.log(x)
            if(x.data.make_a_post.result){
                setMessage(<div><Alert color="success">
                Your post was successfully posted!! 
              </Alert>
              <a href="/created">Click here</a> to visit created posts
              </div>)
            }
            else {
                setMessage(<div><Alert color="danger">
                There was an error!! 
              </Alert></div>)
            }
        })
    }
    const handleEditorChange = ({ html, text }) => {
        setdata(text)
    }
    return (
        <>
            <section class="banner">
                
                <span class="banner-title"><i class="fa fa-edit"></i> Post a Roar!!</span>
            </section>
            <section class="Company-overview">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12 col-sm-24">
                            <div class="post-project">
                                <h2><i class="fa fa-edit"></i> Post a Roar!!</h2>
                                <div class="post-project-fields">
                                    <form onSubmit={e => handleSubmit(e)}>
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <input type="text" name="title" placeholder="Title" onChange={e => setTitle(e.target.value)} />
                                            </div>
                                            <div class="col-lg-12">
                                                <MdEditor
                                                    value={data}
                                                    style={{ height: "500px" }}
                                                    renderHTML={(text) => mdParser.render(text)}
                                                    onChange={handleEditorChange}
                                                />

                                            </div>
                                            <div class="col-lg-12">
                                                <input type="text" name="tags" placeholder="Upto 5 Tags separated by space" onChange={e => setTags(e.target.value)} />
                                            </div>
                                            <div class="col-lg-12">
                                                {message}
                                                <ul>
                                                    <li><button class="active" type="submit" value="post">Post</button></li>
                                                    <li><a href="#" title="">Clear</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CreateView
