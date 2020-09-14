let usernames = []
let tags = []

const parseUsernames = (text) => {

    let usernames = []
	let str = text.split(" ")
	str.map(word => {
	  if(word[0]=="@"){
		usernames.push(word)
	  }
    })
    console.log(usernames)
    return usernames
}

export default parseUsernames