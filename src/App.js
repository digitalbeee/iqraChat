import React, { useEffect } from 'react';
import './App.css';
import Telegram from './components/Telegram'
import Login from './components/Login'
import { auth } from './firebase'
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, login, logout } from './features/counter/userSlice';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser){
        //login
        dispatch(
          login({
            uid: authUser.uid,
            photo: authUser.photoURL,
            email: authUser.email,
            displayName: authUser.displayName
          })
        )
      } else {
        dispatch(logout())
      }
    });
  }, [dispatch]);

  return (
    <div className="App">
      {user ? <Telegram/> : <Login/>}
    </div>
  );
}

export default App;
