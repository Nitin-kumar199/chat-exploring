import { useState, useEffect } from 'react';
import {baseUrl, getRequest} from '../utils/service';

export const useFetchRecipient = (chat, user) =>{
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);

    const recipientId = chat?.members?.find((id)=> id !==user?._id)
    //console.log("recipient user", recipientId)

    useEffect(()=>{
        const getUser = async ()=>{
            if(!recipientId) return null;
            const response = await getRequest(`${baseUrl}/find/${recipientId}`);

            if(response.error) {
                console.log(response)
                return setError(response);
                
            }
            setRecipientUser(response);

        };
        getUser()
    }, []);
    return {recipientUser};
} 