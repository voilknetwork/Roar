import React, { useState, useContext, useEffect } from 'react'
import { UserContext, LoginContext } from "../../contexts"
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_POST } from '../../queries/GET_POST';
import TimeAgo from 'timeago-react';
import SinglePost from './SinglePost';
import Cover from "../../assets/voilk.png"
import MetaTags from 'react-meta-tags';
const removeMd = require('remove-markdown');
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

function PostView() {
    const context = useContext(LoginContext);
    const user = context.username;
    const wif = context.password;

    let { username, permlink, category } = useParams()
    const { loading, error, data, refetch } = useQuery(GET_POST, {
        variables: { username, permlink: permlink },
    });

    const [notification, setNotification] = useState("")
    const [displayPost, setDisplayPost] = useState("auto")



    useEffect(() => {
        const timer = setTimeout(() => {
            setNotification("")
        }, 6000);
        return () => clearTimeout(timer);
    }, [notification]);

    if (loading) return (<div class="posts-section">
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div></div>);
    if (error) return `Error! ${error}`;

    let text = htmlToText.fromString(data.get_content.body, {
        wordwrap: 10
    });
    text = removeUnwanted(text)
    //text = removeUnwanted(text)
    text = text.slice(0, 180)
    let json = JSON.parse(data.get_content.json_metadata)

    let voted = (data.get_content.active_votes.filter(e => {

        if (e.voter == user) {
            if (e.percent == 0) return false
            else return true
        }
    }).length > 0)
    return (
        <>
            <MetaTags>
    <title>{data.get_content.title} - Voilk</title>
            <meta name="description" content={text} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={`https://voilk.com/post/${data.get_content.permlink}`} />
            <meta property="og:title" content={data.get_content.title} />
            <meta property="og:image" content={json.image ? json.image[0]:Cover} />
            <meta property="og:description" content={text} />
            <meta property="fb:app_id" content="588295505354973" />
            <meta name="article:tag" content={data.get_content.category} data-reactid="15"></meta>
            <meta name="article:published_time" content={data.get_content.created} data-reactid="16"></meta>
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content={`@voilk`} data-reactid="14"></meta>
            <meta name="twitter:title" content={data.get_content.title} data-reactid="15"></meta>
            <meta name="twitter:description" content={text} />
            <meta name="twitter:image" content= {json.image ? json.image[0]:Cover} data-reactid="16"></meta>
        
        </MetaTags>
            <section class="banner">

                <span class="banner-title">{data.get_content.title}</span>
            </section>
            <main>
                <div class="main-section" style={{ display: displayPost }}>
                    <div class="container">
                        <div class="main-section-data">
                            <div class="row">
                                <div class="col-xl-12 col-lg-12 col-md-12">
                                    <div class="bids-detail">
                                        <div class="row">
                                            <div class="col-12">
                                                <ul>
                                                    <li>
                                                        <h3><i class="fas fa-heart"></i> Likes ({data.get_content.net_votes})</h3>
                                                    </li>
                                                    <li>
                                                        <h3><i class="fas fa-coins"></i> Rewards ({data.get_content.pending_payout_value})</h3>
                                                    </li>
                                                    <li>
                                                        <h3><i class="fas fa-stopwatch"></i> Cashout (<TimeAgo datetime={data.get_content.cashout_time + 'Z'} />)</h3>
                                                    </li>
                                                    <li>
                                                        <h3><i class="fas fa-stopwatch"></i> Second (<TimeAgo datetime={data.get_content.max_cashout_time + 'Z'} />)</h3>
                                                    </li>
                                                    <li>
                                                        <h3><i class="fas fa-clock"></i> Created (<TimeAgo datetime={data.get_content.created + 'Z'} />)</h3>
                                                    </li>
                                                </ul>
                                                <div class="bids-time">
                                                    <h3><i class="fas fa-comment-alt"></i> Comments ({data.get_content.children})</h3>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="main-ws-sec">
                                        <div class="posts-section">
                                            <SinglePost p={data.get_content} />    
                                        </div>

                                    </div>

                                </div>
                            </div>

                            <div class="col-12">
                                <div class="freelancerbiding">
                                    <div class="row">
                                        <div class="col-md-4 col-sm-12">
                                            <h3>Supporters/Curators ({data.get_content.net_votes})</h3>
                                        </div>
                                        <div class="col-md-4 col-sm-12">
                                            <div class="repcent">
                                                <h3>Rshares<i class="la la-angle-down"></i></h3>
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-sm-12">
                                            <div class="bidrit">
                                                <h3>Weight</h3>
                                            </div>
                                        </div>
                                    </div>
                                    {data.get_content.active_votes.map((vote) => {
                                        return (<>
                                            <div class="row">
                                                <div class="col-md-4 col-sm-12">
                                                    <div class="usy-dt">
                                                        <img src={vote.account.json_metadata.profile_image} alt="" width="40px" height="40px" />
                                                        <div class="usy-name">
                                                            <h3><a href={"/profile/@" + vote.voter}>@{vote.voter}</a></h3>
                                                            <span><img src={process.env.PUBLIC_URL + "/images/icon9.png"} alt="" />{vote.account.coining_shares}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-4 col-sm-12">
                                                    <div class="repcent">
                                                        <h3>{((vote.rshares * 100) / data.get_content.abs_rshares).toFixed(2)}%</h3>
                                                        <p>{vote.rshares}/{data.get_content.abs_rshares}</p>
                                                    </div>
                                                </div>
                                                <div class="col-md-4 col-sm-12">
                                                    <div class="bidrit">
                                                        <p>{vote.percent} Percent</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </>
                                        )
                                    })}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default PostView
