import React, { useState, useContext, useEffect, useRef, useCallback } from 'react'

import usePostSearch from '../../hooks/usePostSearch';
import { useParams } from 'react-router-dom'

import Cookies from 'universal-cookie';
// Using an ES6 transpiler like Babel
import Post from '../Post/Post';
import TopProfiles from '../TopProfiles/TopProfiles';


function PostsBox(props) {
    const { name, type } = useParams()

    useEffect(() => {
        const cookies = new Cookies();
        cookies.set('type', type)
    })
    const [query, setQuery] = useState(name || '')
    const [pageNumber, setPageNumber] = useState(1)
    const {
        posts,
        hasMore,
        visible,
        error,
        setType
    } = usePostSearch(query, pageNumber)

    //console.log(visible + " This is loading")
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

    function handleSearch(e) {
        setQuery(e.target.value)
        setPageNumber(1)
    }
    // const [posts, setPosts] = useState([])
    const [limit, setLimit] = useState(10)
    // const [page, setPage] = useState(1)
    // const [tag, setTag] = useState("")


    // const { loading, error, data, refetch } = useQuery(GET_TRENDING_POSTS, {
    //     variables: { limit, page, tag, truncate: 0 },
    // });
    // useEffect(() => {
    //     if (!loading && !error) {
    //         localStorage.setItem('posts', data.get_trending_posts);
    //         setPosts(data.get_trending_posts)
    //     }
    // }, [page])
    // useEffect(() => {
    //     refetch({ limit, tag, page, truncate: 0 })
    //     // if(!loading)
    //     // setPosts(posts => [...posts, data.get_trending_posts])
    // }, [limit])
    // if (loading) return null;
    // if (error) return `Error! ${error}`;

    return (
        <div class="posts-section">
            {posts.map((post, index) => {
                if(index==1) {
                    return(<>
                    <TopProfiles />
                    <Post p={post} key={index} />
                    </>)
                }
                return (<Post p={post} key={index} />)
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
    )
}

export default PostsBox
