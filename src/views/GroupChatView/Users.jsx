import React from 'react'
import User from './User'

function Users({users, username, count}) {

    if(!users) return null

    return (
        <ul>
            {users.map((user, i) => <User user={user} key={i} count={count} username={username}/>)}
        </ul>
    )
}

export default Users
