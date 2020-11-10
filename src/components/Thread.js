import { Avatar, IconButton } from '@material-ui/core';
import { MoreVert, InsertEmoticon, MicNoneOutlined, SendRounded } from '@material-ui/icons';
//import userEvent from '@testing-library/user-event';
import React from 'react';
import { useState, useEffect } from 'react';
import db from '../firebase';
import firebase from 'firebase';
import './Thread.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/counter/userSlice';
import { selectThreadId, selectThreadName } from '../features/counter/threadSlice';
import Message from './Message';
import * as timeago from 'timeago.js';

const Thread = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const threadId = useSelector(selectThreadId);
    const threadName = useSelector(selectThreadName);
    const user = useSelector(selectUser);

    useEffect(() => {
        if (threadId){
            db.collection('threads')
            .doc(threadId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) => 
                setMessages(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data()
                    }))
                )
            )
        }
    }, [threadId]);

    console.log(messages)

    const sendMessage = (e) => {
        e.preventDefault();
        if (input){
            db.collection('threads').doc(threadId).collection('messages').add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: input,
                uid: user.uid,
                photo: user.photo,
                email: user.email,
                displayName: user.displayName,
                
            });
            setInput('');
        }
    }

    console.log(input);

    return (
        <div className="thread">
            <div className="thread_header">
                <div className="thread__header__contents">
                    <Avatar/>
                    <div className="thread__header__contents__info">
                        <h4>{threadName}</h4>
                        <h5>{timeago.format(new Date(setMessages[0]?.timestamp?.toDate()))}</h5>
                    </div>
                </div>
                <IconButton>
                    <MoreVert className="thread__header__details"/>
                </IconButton>
            </div>
            <div className="thread__messages" style={{
                background: `url('${process.env.PUBLIC_URL}/bg.jpg')`
            }}>
                {messages.map(({ id, data }) => (
                    <Message key={id} data={data}/>
                ))}
            </div>
            <div className="thread__input">
                <InsertEmoticon />
                <form>
                    <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type a message"/>
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <MicNoneOutlined/>
            </div>
        </div>
    )
}

export default Thread
