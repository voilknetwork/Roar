import React from 'react'
import io from 'socket.io-client';


const ENDPOINT = 'https://graphql.voilk.com'
const SocketContext = React.createContext({})
export const SocketProvider = SocketContext.Provider
export const SocketConsumer = SocketContext.Consumer


export function SocketProviderComponent(props) {
    const socket = io(ENDPOINT);
    // console.log(user)
    return (
      <SocketProvider value={socket}>
        {props.children}
      </SocketProvider>
    )
}
export default SocketContext