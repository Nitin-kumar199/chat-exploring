import { createContext, useCallback, useEffect, useState } from 'react';
import {baseUrl, getRequest, postRequest} from "../utils/service";

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user})=>{
    const [userChats, setUserChats] = useState(null);
    const [isUserChatLoading, setIsUserChatLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    //console.log("currentchat===>",currentChat?._id)
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    console.log("messages",messages)

    useEffect(()=>{
        const getUsers = async ()=>{
            const respones = await getRequest(`${baseUrl}/`);
           //console.log("------>",respones)
           //console.log("****", user)
            if(respones.error){
                return console.log("error fetching user", respones);
            }
            const pUser = respones.filter((u)=>{
                let isChatCreated = false;
               // console.log("u", u)
                if(user?._id === u._id) return false;
                
                if(userChats){
                    //console.log("u id",u);
                   // console.log("userChats->>", userChats)
                    isChatCreated = userChats?.some((chat)=>{
                     return chat.members[0] === u._id || chat.members[1]._id
                    });
                }
                return !isChatCreated
            });
           // console.log("puser", pUser)
            setPotentialChats(pUser)

        }
        getUsers();
    }, [userChats])

    useEffect(()=>{
        const getUserChats = async () =>{
            if(user?._id){
                setIsUserChatLoading(true);
                const respones = await getRequest(`${baseUrl}/chat/${user?._id}`);
                setIsUserChatLoading(false)
                if(respones.error){
                    return setUserChatsError(respones)
                }
                setUserChats(respones);
            }
        }
        getUserChats();
    },[user]);


    useEffect(()=>{
        const getMessages = async () =>{
           
                setMessagesLoading(true);
                setMessagesError(null);
                const respones = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
                //console.log('messageresponse', respones)
                setMessagesLoading(false)
                if(respones.error){
                    return setMessagesError(respones)
                }
                setMessages(respones);
          
        }
        getMessages();
    },[currentChat]);



    const updateCurrentChat = useCallback((chat)=>{
        setCurrentChat(chat)
    },[])


    const createChat = useCallback( async (firstId, secondId)=>{
        const respones = await postRequest(`${baseUrl}/chat`, JSON.stringify({
            firstId,
            secondId
        }));
        //console.log("XXXXX", respones)
        if(respones.error){
            return console.log("Error creating chat", respones)
        }
        setUserChats((prev)=>[...prev, respones])
    }, [])

    return <ChatContext.Provider value={{
        userChats,
        isUserChatLoading,
        userChatsError,
        potentialChats, 
        createChat,
        updateCurrentChat,
        messages,
        messagesError,
        isMessagesLoading
    }}>
        {children}
    </ChatContext.Provider>
}
