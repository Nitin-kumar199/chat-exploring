import React, { useContext } from 'react'
import { useFetchRecipient } from '../../hooks/useFetchRecipient'
import { Stack } from 'react-bootstrap';
import profile from "../../assets/profile.svg"
import { ChatContext } from '../../context/ChatContex';

export default function UserChat({chat, user}) {
    const {recipientUser} = useFetchRecipient(chat, user);
    const {onlineUsers} = useContext(ChatContext);
    let isOnline = onlineUsers?.some((user)=> user?.userId === recipientUser?._id)
    //console.log("recipientuser",recipientUser);
  return (
    <Stack direction='horizontal' gap={3} className='user-card align-items-center p-2 justify-content-between' role='button'>
        <div className='d-flex'>
            <div className='me-2'>
                <img src={profile} height="35px"/>
            </div>
            <div className='text-content'>
                <div className='name'> {recipientUser?.name} </div>
                <div className='text'>textMessage</div>
            </div>
        </div>
        <div className='d-flex flex-column align-items-end'>    
            <div className='date'>
                23/12/2023
            </div>
            <div className='this-user-notifications'>2</div>
            <span className={isOnline ? 'user-online' : ""}></span>
        </div>
    </Stack>
  )
}
