const filterNotifications = (notifications, username) =>{

    let newnotifications = []
    newnotifications = notifications.map(notif => {
        if(notif.user==username) return notif
    })
    console.log(newnotifications)
    return newnotifications
}

export default filterNotifications