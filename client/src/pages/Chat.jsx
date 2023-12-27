import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContex'
import { Container, Stack } from 'react-bootstrap';
import UserChat from '../components/chat/UserChat';
import { AuthContext } from '../context/AuthContext';
import PotentialChat from '../components/chat/PotentialChat';
import ChatBox from '../components/chat/ChatBox';

export default function Chat() {
  const {user} = useContext(AuthContext);
  const {userChats,
    isUserChatLoading,
    updateCurrentChat } = useContext(ChatContext);
    //console.log("UserChats====", userChats);
  return (
    <Container>
      <PotentialChat />
      {/* {console.log("after potential chat",userChats?.length > 1)} */}
      {userChats?.length < 1 ? null : (<Stack direction='horizontal' gap={4} className='align-items-start'>
        <Stack className='message-box flex-grow-0 pe-3' gap={3}>
          {isUserChatLoading && <p>Loading chats...</p>}
          {userChats?.map((chat, index)=>{
            return(
              <div key={index} onClick={()=>{updateCurrentChat(chat)}}>
                <UserChat chat= {chat} user={user} />
              </div>
            )
          })}
        </Stack>
        <ChatBox/>
      </Stack>)}
    </Container>
  )
}
