import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setThread } from '../features/counter/threadSlice'
import db from '../firebase'
import './SidebarThreads.css'
import * as timeago from 'timeago.js';

const SidebarThreads = ({id, threadName}) => {
    const dispatch = useDispatch();
    const [threadInfo, setThreadInfo] = useState([]);

    useEffect(() => {
        db.collection('threads')
            .doc(id)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) =>
                setThreadInfo(snapshot.docs.map((doc) => doc.data()))
            );
    }, [id]);

    console.log(id)

    return (
        <div 
        className="sidebar_thread" 
        onClick={() => 
            dispatch(
                setThread({
                    threadId: id,
                    threadName: threadName,
                })
            )
        }
        >
            <Avatar src={threadInfo[0]?.photo}/>
            <div className="sidebar__thread__details">
                <h3>{threadName}</h3>
                <p>{threadInfo[0]?.message}</p>
                <small className="sidebar__thread__timestamp">
                    {timeago.format(new Date(threadInfo[0]?.timestamp?.toDate()))}
                </small>
            </div>
        </div>
    )
}

export default SidebarThreads
