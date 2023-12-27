import { createContext, useCallback, useEffect, useState } from 'react';
import {baseUrl, getRequest, postRequest} from "../utils/service";
import { io } from 'socket.io-client';

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
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null); 
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(null);
    //console.log("messages",messages)
    console.log("onlineUsers",onlineUsers)
    //initialize socket.io
    useEffect(()=>{
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);
        return ()=>{
            newSocket.disconnect()
        }
    },[user])
////add online users
    useEffect(()=>{
        if(socket === null) return
        socket.emit("addNewUser", user?._id);
        socket.on("getOnlineUsers",(res)=>{
            setOnlineUsers(res);
        });
        return ()=>{
            socket.off("getOnlineUsers")
        };
    },[socket])
    //send messages realtime
    useEffect(()=>{
        if(socket === null) return;
        const recipientId = currentChat?.members?.find((id)=> id !==user?._id)
        socket.emit("sendMessage",{...newMessage, recipientId})
    },[newMessage]);

    //recieve messages
    useEffect(()=>{
        if(socket === null) return;
        socket.on("getMessage", res => {
            if(currentChat?._id !== res.chatId) return;
            setMessages((prev)=> [...prev, res])
        })

        return ()=>{
            socket.off("getMessage")
        }
    },[socket, currentChat]);

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
        console.log(chat);
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
    }, []);

    const sendTextMessage = useCallback( async (textMessage, sender, currentChatId, setTextMessage)=>{
        if(!textMessage) return console.log("You must type something...");

        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
            chatId: currentChatId,
            senderId: sender._id,
            text:textMessage
        }))

        if(response.error) sendTextMessageError(response);
        setNewMessage(response);
        setMessages((prev)=> [...prev, response])
        setTextMessage("")
    }, [])

    return <ChatContext.Provider value={{
        userChats,
        isUserChatLoading,
        userChatsError,
        potentialChats,
        currentChat, 
        createChat,
        updateCurrentChat,
        messages,
        messagesError,
        isMessagesLoading,
        sendTextMessage,
        onlineUsers
    }}>
        {children}
    </ChatContext.Provider>
}
