import React, { useState, useEffect } from 'react';
import {Switch, Route, useLocation, Redirect, useHistory} from "react-router-dom";
import Home from './Home.js';
import { createNewUser, signinUser, authenticateUser, stravaAuth } from './dbAPI';
import Dashboard from './Dashboard.js';

const App = () => {
  const [user, setUser] = useState({})
  let location = useLocation()
  let history = useHistory();

  useEffect(() => {
    if (localStorage.getItem('JWT') && Object.keys(user).length === 0) {
      authUser();
		}
  })

  useEffect(() => {
    if (Object.keys(user).length !== 0 && location.pathname.startsWith('/api/strava/callback')) {
      const code = location.search.split('&')[1].substring(5)
      stravaConnect(code, user.userId);
    }
  })

  const stravaConnect = async (code, userId) => {
    const res = await stravaAuth(code, userId);
    if (res.success) {
      history.push('/dashboard')
    }
  }

  const authUser = async () => {
		const res = await authenticateUser();
		if (res.success) {
			setUser(res.user);
		}
	}

  const loginUser = async (email, password) => {
    const res = await signinUser(email, password);
    if (res.success) {
      localStorage.JWT = res.token;
      setUser(res.user);
    }
  }

  const createUser = async (firstName, lastName, newEmail, newPassword) => {
    const res = await createNewUser(firstName, lastName, newEmail, newPassword);
    if (res.success) {
      loginUser(newEmail, newPassword);
    }
  }

  const updateRefresh = (data) => {
    setUser({stravaRefreshToken: data.stravaRefreshToken, stravaAccessToken: data.stravaAccessToken, stravaExpiresAt: data.stravaExpiresAt, stravaExpiresIn: data.stravaExpiresIn})
  }

  return (
    <div>
      {user && location.pathname !== '/dashboard' && !location.pathname.startsWith('/api/strava/callback') && (
        <Redirect to='/dashboard' />
      )}
      <Switch>
        <Route exact path="/">
          <Home user={user} 
                loginUser={(email, password) => loginUser(email, password)} 
                createUser={(firstName, lastName, newEmail, newPassword) => createUser(firstName, lastName, newEmail, newPassword) } 
          />
        </Route>
        <Route path="/dashboard">
          <Dashboard user={user}
          updateRefresh={(refreshData) => updateRefresh(refreshData)}
          />
        </Route>
      </Switch>
  </div>
  )
}

export default App;