import React from 'react'
const LoginContext = React.createContext({})

export const LoginProvider = LoginContext.Provider
export const LoginConsumer = LoginContext.Consumer

export function LoginProviderComponent(props) {

    const user = {
      username: localStorage.getItem('username'),
      password: localStorage.getItem('password'),
      posting_pubkey: localStorage.getItem('password_pub')
    }
    // console.log(user)
    return (
      <LoginProvider value={user}>
        {props.children}
      </LoginProvider>
    )
}
export default LoginContext