import React, { useContext } from 'react'
import { ChatContext } from '../../context/ChatContex'
import { AuthContext } from '../../context/AuthContext'


export default function PotentialChat() {
  const {user} = useContext(AuthContext)
    const {potentialChats, createChat, onlineUsers} = useContext(ChatContext)
    //console.log("potencial chat",potentialChats)
  return (
    <>
    <div className="all-users">
        {potentialChats && potentialChats.map((u, index)=>{
           return(<div className="single-user" key={index} onClick={()=> createChat(user._id, u._id)}>
            {/* {console.log(u.name)} */}
                {u.name}
                <span className={onlineUsers?.some((user)=> user?.userId === u?._id) ? "online-user" : ""}></span>
            </div>);
        })}
    </div>
    </>
  )
}
