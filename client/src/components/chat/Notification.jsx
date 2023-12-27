import React, { useContext, useState } from 'react'
import { ChatContext } from '../../context/ChatContex';
import { AuthContext } from '../../context/AuthContext';
import { unreadNotificationsFunc } from '../../utils/unreadNotifications';
import moment from 'moment'

export default function Notification() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, userChats, allUsers, markAllNotificationAsRead, markNotificationAsRead} = useContext(ChatContext);
    const { user } = useContext(AuthContext);
    const unreadNotifications = unreadNotificationsFunc(notifications);
    const modifiedNotifications = notifications.map((n)=>{
        const sender = allUsers.find(user => user._id === n.senderId)
        return {
            ...n,
            senderName: sender?.name
        }
    })
    console.log("un", unreadNotifications);
    console.log("mn", modifiedNotifications)
  return (
    <div className='notifications'>
        <div className='notifications-icon' onClick={()=>{setIsOpen(!isOpen)}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chat-square-fill" viewBox="0 0 16 16">
                <path d="M2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
            </svg>
            {unreadNotifications?.length === 0 ? null : (
                <span className='notification-count'>
                    <span> {unreadNotifications?.length} </span>
                </span>
            ) }
        </div>
        {isOpen ? <div className="notifications-box">
            <div className="notifications-header">
                <h3>Notifications</h3>
                <div className='mark-as-read' onClick={()=>{markAllNotificationAsRead(notifications)}}>
                    Mark all read
                </div>
            </div>
            {modifiedNotifications?.length === 0 ? <span className='notification'>No notification yet..</span> : null }
            {modifiedNotifications && modifiedNotifications.map((n, index)=>{
                return <div key={index} className={n.isRead ? 'notification' : 'notification not-read'} onClick={()=>{markNotificationAsRead(n, userChats, user, notifications); setIsOpen(false)}}>
                        <span> {`${n.senderName} sent you a new message`} </span>
                        <span className='notification-time'> {moment(n.date).calendar()} </span>
                </div>
            })}
        </div> : null }
        
    </div>
  )
}
