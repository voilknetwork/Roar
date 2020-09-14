import React, {useState, useRef, useCallback} from 'react'
import SingleUser from './SingleUser'
import useUsersSearch from '../../hooks/useUsersSearch'

function UsersView() {
    const [lowerBound, setLowerBound] = useState("")

    const {
        users,
        hasMore,
        visible,
        error,
        setUsers
    } = useUsersSearch(lowerBound)

    const observer = useRef()
    const lastBookElementRef = useCallback(node => {
        if (visible) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setLowerBound(users[users.length-1].name)
            }
        })
        if (node) observer.current.observe(node)
    }, [visible, hasMore])
    if (error) return `Error! ${error}`;

    return (
        <>
            <section class="banner">
                <span class="banner-title"><i class="fa fa-users"></i> Users List</span>
            </section>
            <section class="companies-info">
			<div class="container">
				<div class="company-title">
					<h3>All Users</h3>
				</div>
				<div class="companies-list">
					<div class="row">
                        {users.map(user=> {
                            return(<SingleUser user={user}/>)
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
                                                            onClick={() => setLowerBound(users[users.length-1].name)}
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

export default UsersView
