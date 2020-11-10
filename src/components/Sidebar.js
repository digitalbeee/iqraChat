import React, {useEffect, useState} from 'react'
import './Sidebar.css'
import { BorderColorOutlined, ChatOutlined, DonutLargeOutlined, MoreVert, SearchOutlined} from '@material-ui/icons'
import { Avatar, IconButton } from '@material-ui/core'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import SidebarThreads from './SidebarThreads';
import db, { auth } from '../firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/counter/userSlice';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        zIndex: 1,
        color: '#fff',
    },
    paper: {
        backgroundColor: '#2d4671',
        color: 'white',
      },
  }));

const Sidebar = () => {

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);


    const user = useSelector(selectUser);
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        db.collection('threads').onSnapshot((snapshot) => setThreads(snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
        }))))
    }, []);

    const addThread = () => {
        const threadName = prompt('Enter a chat room name.');
        if (threadName){
            db.collection('threads').add({
                threadName: threadName,
            })
        }
    }

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar className="sidebar__header__avatar" src={user?.photo}/>
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeOutlined />
                    </IconButton>
                    <IconButton onClick={addThread}>
                        <ChatOutlined/>
                    </IconButton>
                    <IconButton ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}>
                        <MoreVert/>
                    </IconButton>

                    <div className={classes.root}>
                        <div>
                            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                {...TransitionProps}
                                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                                        <MenuItem onClick={handleClose}>My account</MenuItem>
                                        <MenuItem onClick={() => auth.signOut()}>Logout</MenuItem>
                                    </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                                </Grow>
                            )}
                            </Popper>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sidebar__search__box">
                <div className="sidebar__search">
                    <div className="sidebar__searchContainer">
                        <SearchOutlined/>
                        <input placeholder="Search or start new chat room" type="text" />
                    </div>
                </div>
            </div>
            
            <div className="sidebar_threads">
                {threads.map(({id, data: {threadName}}) => (
                    <SidebarThreads key={id} id={id} threadName={threadName}/>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
