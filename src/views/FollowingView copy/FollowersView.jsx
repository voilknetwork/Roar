import React, { useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import useFollowersSearch from '../../hooks/useFollowersSearch'
import Follower from './Follower'

function FollowersView() {
    const {username} = useParams()
    const [start, setStart] = useState("")
    const {
        users,
        hasMore,
        visible,
        error,
        setUsers
    } = useFollowersSearch(username, start, "blog")

    const observer = useRef()
    const lastBookElementRef = useCallback(node => {
        if (visible) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setStart(users[users.length - 1].account.name)
            }
        })
        if (node) observer.current.observe(node)
    }, [visible, hasMore])
    if (error) return `Error! ${error}`;


    return (
        <>
            <section class="banner">
                <span class="banner-title"><i class="fa fa-users"></i> Followers List</span>
            </section>
            <section class="companies-info">
                <div class="container">
                    <div class="company-title">
                    <h3>Followers of <a href={`/profile/@${username}`}>@{username}</a></h3>
                    </div>
                    <div class="companies-list">
                        <div class="row">
                            {users.map(user => {
                                return (<Follower user={user} />)
                            })}

                        </div>
                    </div>
                    <div class="process-comm" ref={lastBookElementRef}>
                        {visible ? <div class="spinner">
                            <div class="bounce1"></div>
                            <div class="bounce2"></div>
                            <div class="bounce3"></div>
                        </div> :
                            <button class="btn btn-primary btn-lg"
                                onClick={() => setStart(users[users.length - 1].account.name)}
                            >All Catched up..</button>
                        }
                    </div>
                </div>
            </section>
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
                        <p><img src="images/copy-icon2.png" alt="" />Copyright 2019</p>
                        <img class="fl-rgt" src="images/logo2.png" alt="" />
                    </div>
                </div>
            </footer>
        </>
    )
}

export default FollowersView
