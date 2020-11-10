import { Avatar } from '@material-ui/core';
import React from 'react'
import './Message.css'
import { selectUser } from '../features/counter/userSlice'
import { useSelector } from 'react-redux'
import * as timeago from 'timeago.js';

const Message = ({id, data: {displayName, email, message, photo, timestamp, uid } }) => {
    const user = useSelector(selectUser);
    return (
        <div
            className={`message ${user.email === email && `message__sender`}`}>
            <Avatar src={photo} className="message__photo"/>
            <div className="message__contents">
                <p>{message}</p>

                <small>{timeago.format(new Date(timestamp?.toDate()))}</small>
            </div>
        </div>
    )
}

export default Message