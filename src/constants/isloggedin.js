export function isLoggedin(username, password){

    let isUsername = (username==null||username=="null"||username==undefined)
    let isPassword = (password==null||password=="null"||password==undefined)
    return !(isUsername||isPassword)
}
export function isLoggedOut(username, password){

    let isUsername = (username==null||username=="null"||username==undefined)
    let isPassword = (password==null||password=="null"||password==undefined)
    return (isUsername||isPassword)
}

export default isLoggedin