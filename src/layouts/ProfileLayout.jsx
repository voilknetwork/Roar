import React, { useState, useRef, useCallback, useContext, useEffect } from 'react'
import Header from '../components/Header/Header'
import _ from "lodash";
import { useParams } from 'react-router-dom'
import useProfileSearch from '../hooks/useProfileSearch';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_USER } from '../queries/GET_USER';
import Post from '../components/Post/Post';

import LogoBox from '../components/LogoBox/LogoBox';
import {UserContext, LoginContext} from "../contexts"
import axios from "axios";
import UserProfile from '../components/UserProfile/UserProfile';
import isLoggedin from '../constants/isloggedin';


function ProfileLayout() {
    const { name } = useParams()
    const [query, setQuery] = useState(name || 'voilk')
    const [user, setUser] = useState(null)      

    const context = useContext(LoginContext);
    const username = context.username;
    const password = context.password;
    

    // const { loading, err, data, refetch } = useQuery(GET_USER, {
    //     variables: { username: query }
    // });



    // follow end
    

    const [pageNumber, setPageNumber] = useState(1)
    const [activeTab, setActiveTab] = useState(1)
    const {
        posts,
        hasMore,
        visible,
        error,
        setType,
        setPosts
    } = useProfileSearch(query, pageNumber, "blog")


    const refetch =() => {
        axios({
            url: 'https://graphql.voilk.com/graphql',
            method: 'post',
            data: {
              query: `
              query GetUserInfo{
                account(name: "${query}"){
                  id
                  bitcoin
                  bitcoincash
                  name
                  owner{
                    weight_threshold
                    account_auths
                    key_auths
                  }
                  active{
                    weight_threshold
                    account_auths
                    key_auths
                  }
                  posting{
                    weight_threshold
                    account_auths
                    key_auths
                  }
                  memo_key
                  json_metadata {
                    cover_image
                    name
                    about
                    location
                    website
                    profile_image
                  }
                  comment_count
                  followers{
                    follower_count
                    following_count
                  }
                  balance
                  vsd_balance
                  coining_shares
                  
                  
                }
        }
              `
            }
          }).then((result) => {
            console.log(result.data.data)
            setUser(result.data.data)
          });
    }

    useEffect(() => {
        refetch()
    }, [])



    const observer = useRef()
    const lastBookElementRef = useCallback(node => {
        if (visible) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [visible, hasMore])


    if (!user) return (
    
        <div class="wrapper">
        <Header />
    <div class="posts-section">
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div></div>
        </div>
         );
    // if (err) return `Error! ${err}`;
    function handleSearch(e) {
        setQuery(e.target.value)
        setPageNumber(1)
    }
    return (
        <div class="wrapper">
            <Header />
            <section class="cover-sec">
                <img src={user.account.json_metadata.cover_image} alt="" width="1600px" height="400px" />
            </section>


            <main>
                <div class="main-section">
                    <div class="container">
                        <div class="main-section-data">
                            <div class="row">
                                <UserProfile data={user} name={name} refetch={refetch}/>
                                <div class="col-lg-6">
                                    <div class="main-ws-sec">
                                        <div class="user-tab-sec">
                                            <h3>@{user.account.name}</h3>
                                            <div class="star-descp">
                                                <span>{user.account.json_metadata.about}</span>

                                            </div>
                                            <div class="tab-feed card card-body">
                                                <ul>
                                                    <li data-tab="feed-dd" class={activeTab==1?"active":""}>
                                                        <a href="#" title=""
                                                        onClick={e => {
                                                            e.preventDefault()
                                                            setActiveTab(1)
                                                        }}
                                                        >
                                                            <img src={process.env.PUBLIC_URL + "/images/ic1.png"} alt="" />
                                                            <span>Blog</span>
                                                        </a>
                                                    </li>
                                                    <li data-tab="info-dd" class={activeTab==2?"active":""}>
                                                        <a href="#" title=""
                                                        onClick={e => {
                                                            e.preventDefault()
                                                            setActiveTab(2)
                                                        }}>
                                                            <img src={process.env.PUBLIC_URL + "/images/ic2.png"} alt="" />
                                                            <span>Info</span>
                                                        </a>
                                                    </li>
                                                    <li data-tab="portfolio-dd" class={activeTab==3?"active":""}>
                                                        <a href="#" title=""
                                                        onClick={e => {
                                                            e.preventDefault()
                                                            setActiveTab(3)
                                                        }}
                                                        >
                                                            <img src={process.env.PUBLIC_URL + "/images/ic3.png"} alt="" />
                                                            <span>Portfolio</span>
                                                        </a>
                                                    </li>
                                                    <li data-tab="wallet-dd" class={activeTab==4?"active":""}>
                                                        <a href="#" title=""
                                                        onClick={e => {
                                                            e.preventDefault()
                                                            setActiveTab(4)
                                                        }}
                                                        >
                                                            <img src={process.env.PUBLIC_URL + "/images/ic6.png"} alt="" />
                                                            <span>Wallet</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class={activeTab==1?"product-feed-tab current":"product-feed-tab"} id="feed-dd">
                                            <div class="posts-section">
                                                {posts.map((post, index) => {
                                                    if(post.author==name)
                                                    return (<Post p={post} key={index} />)

                                                    return (<>
                                                    <div className="container">
                                                        <div className="card card-body" style={{background: "#53d690"}}>
                                                           <span className="text-default"><i class="fas fa-share-square"></i> Shared Post</span> 
                                                        </div>
                                                        <Post p={post} key={index} />
                                                    </div>
                                                    </>)
                                                })}
                                                <div class="process-comm" ref={lastBookElementRef}>
                                                    {visible ? <div class="spinner">
                                                        <div class="bounce1"></div>
                                                        <div class="bounce2"></div>
                                                        <div class="bounce3"></div>
                                                    </div> :
                                                        <button class="btn btn-primary btn-lg"
                                                            onClick={() => setPageNumber(prevPageNumber => prevPageNumber + 1)}
                                                        >All Catched up..</button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div class={activeTab==2?"product-feed-tab current":"product-feed-tab"} id="info-dd">
                                            <div class="user-profile-ov">
                                                <h3>Overview</h3>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor aliquam felis, nec condimentum ipsum commodo id. Vivamus sit amet augue nec urna efficitur tincidunt. Vivamus consectetur aliquam lectus commodo viverra. Nunc eu augue nec arcu efficitur faucibus. Aliquam accumsan ac magna convallis bibendum. Quisque laoreet augue eget augue fermentum scelerisque. Vivamus dignissim mollis est dictum blandit. Nam porta auctor neque sed congue. Nullam rutrum eget ex at maximus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget vestibulum lorem.</p>
                                            </div>
                                            <div class="user-profile-ov st2">
                                                <h3>Experience</h3>
                                                <h4>Web designer</h4>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor aliquam felis, nec condimentum ipsum commodo id. Vivamus sit amet augue nec urna efficitur tincidunt. Vivamus consectetur aliquam lectus commodo viverra. </p>
                                                <h4>UI / UX Designer</h4>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor aliquam felis, nec condimentum ipsum commodo id.</p>
                                                <h4>PHP developer</h4>
                                                <p class="no-margin">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor aliquam felis, nec condimentum ipsum commodo id. Vivamus sit amet augue nec urna efficitur tincidunt. Vivamus consectetur aliquam lectus commodo viverra. </p>
                                            </div>
                                            <div class="user-profile-ov">
                                                <h3>Education</h3>
                                                <h4>Master of Computer Science</h4>
                                                <span>2015 - 2018</span>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor aliquam felis, nec condimentum ipsum commodo id. Vivamus sit amet augue nec urna efficitur tincidunt. Vivamus consectetur aliquam lectus commodo viverra. </p>
                                            </div>
                                            <div class="user-profile-ov">
                                                <h3>Location</h3>
                                                <h4>India</h4>
                                                <p>151/4 BT Chownk, Delhi </p>
                                            </div>
                                            <div class="user-profile-ov">
                                                <h3>Skills</h3>
                                                <ul>
                                                    <li><a href="#" title="">HTML</a></li>
                                                    <li><a href="#" title="">PHP</a></li>
                                                    <li><a href="#" title="">CSS</a></li>
                                                    <li><a href="#" title="">Javascript</a></li>
                                                    <li><a href="#" title="">Wordpress</a></li>
                                                    <li><a href="#" title="">Photoshop</a></li>
                                                    <li><a href="#" title="">Illustrator</a></li>
                                                    <li><a href="#" title="">Corel Draw</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class={activeTab==3?"product-feed-tab current":"product-feed-tab"} id="portfolio-dd">
                                            <div class="portfolio-gallery-sec">
                                                <h3>Featured Images</h3>
                                                <div class="gallery_pf">
                                                    <div class="row">
                                                        <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                                                            <div class="gallery_pt">
                                                                <img src={process.env.PUBLIC_URL + "/images/resources/pf-img1.jpg"} alt="" />
                                                                <a href="#" title=""><img src={process.env.PUBLIC_URL + "/images/all-out.png"} alt="" /></a>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                                                            <div class="gallery_pt">
                                                                <img src={process.env.PUBLIC_URL + "/images/resources/pf-img2.jpg"} alt="" />
                                                                <a href="#" title=""><img src={process.env.PUBLIC_URL + "/images/all-out.png"} alt="" /></a>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                                                            <div class="gallery_pt">
                                                                <img src={process.env.PUBLIC_URL + "/images/resources/pf-img3.jpg"} alt="" />
                                                                <a href="#" title=""><img src={process.env.PUBLIC_URL + "/images/all-out.png"} alt="" /></a>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                                                            <div class="gallery_pt">
                                                                <img src={process.env.PUBLIC_URL + "/images/resources/pf-img4.jpg"} alt="" />
                                                                <a href="#" title=""><img src={process.env.PUBLIC_URL + "/images/all-out.png"} alt="" /></a>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                                                            <div class="gallery_pt">
                                                                <img src={process.env.PUBLIC_URL + "/images/resources/pf-img5.jpg"} alt="" />
                                                                <a href="#" title=""><img src={process.env.PUBLIC_URL + "/images/all-out.png"} alt="" /></a>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                                                            <div class="gallery_pt">
                                                                <img src={process.env.PUBLIC_URL + "/images/resources/pf-img6.jpg"} alt="" />
                                                                <a href="#" title=""><img src={process.env.PUBLIC_URL + "/images/all-out.png"} alt="" /></a>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                                                            <div class="gallery_pt">
                                                                <img src={process.env.PUBLIC_URL + "/images/resources/pf-img7.jpg"} alt="" />
                                                                <a href="#" title=""><img src={process.env.PUBLIC_URL + "/images/all-out.png"} alt="" /></a>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                                                            <div class="gallery_pt">
                                                                <img src={process.env.PUBLIC_URL + "/images/resources/pf-img8.jpg"} alt="" />
                                                                <a href="#" title=""><img src={process.env.PUBLIC_URL + "/images/all-out.png"} alt="" /></a>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                                                            <div class="gallery_pt">
                                                                <img src={process.env.PUBLIC_URL + "/images/resources/pf-img9.jpg"} alt="" />
                                                                <a href="#" title=""><img src={process.env.PUBLIC_URL + "/images/all-out.png"} alt="" /></a>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                                                            <div class="gallery_pt">
                                                                <img src={process.env.PUBLIC_URL + "/images/resources/pf-img10.jpg"} alt="" />
                                                                <a href="#" title=""><img src={process.env.PUBLIC_URL + "/images/all-out.png"} alt="" /></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class={activeTab==4?"product-feed-tab current":"product-feed-tab"} id="wallet-dd">
                                            <div class="user-profile-ov">
                                                <h3>Wallet</h3>
                                                <p> You can use your account wallet, to send or receive payments, from other users
                                                    </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-3">
                                    <div class="right-sidebar">
                                        {isLoggedin(username, password)?
                                        <div class="message-btn">
                                            <a href={`/chat/${name}:${username}`} title=""><i class="fa fa-envelope"></i> Message</a>
                                        </div>:null}
                                        <LogoBox />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>


            <footer>
                <div class="footy-sec mn no-margin">
                    <div class="container">
                        <ul>
                            <li><a href="help-center.html" title="">Help Center</a></li>
                            <li><a href="about.html" title="">About</a></li>
                            <li><a href="#" title="">Privacy Policy</a></li>
                            <li><a href="#" title="">Community Guidelines</a></li>
                            <li><a href="#" title="">Cookies Policy</a></li>
                            <li><a href="#" title="">Career</a></li>
                            <li><a href="forum.html" title="">Forum</a></li>
                            <li><a href="#" title="">Language</a></li>
                            <li><a href="#" title="">Copyright Policy</a></li>
                        </ul>
                        <p><img src={process.env.PUBLIC_URL + "/images/copy-icon2.png"} alt="" />Copyright 2019</p>
                        <img class="fl-rgt" src={process.env.PUBLIC_URL + "/images/logo2.png"} alt="" />
                    </div>
                </div>
            </footer>


            <div class="overview-box active" id="create-portfolio">
                <div class="overview-edit">
                    <h3>Create Portfolio</h3>
                    <form>
                        <input type="text" name="pf-name" placeholder="Portfolio Name" />
                        <div class="file-submit">
                            <input type="file" name="file" />
                        </div>
                        <div class="pf-img">
                            <img src={process.env.PUBLIC_URL + "/images/resources/np.png"} alt="" />
                        </div>
                        <input type="text" name="website-url" placeholder="htp://www.example.com" />
                        <button type="submit" class="save">Save</button>
                        <button type="submit" class="cancel">Cancel</button>
                    </form>
                    <a href="#" title="" class="close-box"><i class="la la-close"></i></a>
                </div>
            </div>



        </div>
    )
}

export default ProfileLayout
