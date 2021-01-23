import React, { useState, useEffect } from 'react';
import { newStravaToken } from './dbAPI';


const Dashboard = props => {

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (props.user.stravaEnabled && activities.length === 0) {
      if (new Date(props.user.stravaExpiresAt * 1000) < Date.now()) {
        refreshToken(props.user.stravaRefreshToken, props.user.userId)
      } else {
        fetch(`https://www.strava.com/api/v3/athlete/activities`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.user.stravaAccessToken}` }
          }).then(res => res.json()).then(data => {
            setActivities(data)
            console.log(data)});
      }
    }
  })

  const refreshToken = async (refresh, userId) => {
		const res = await newStravaToken(refresh, userId);
		if (res.success) {
      props.updateRefresh(res.data);
    }
	}

  let grantDomain = '';
  if (process.env.NODE_ENV === 'production') {
    grantDomain = `https://www.strava.com/oauth/authorize?client_id=26482&redirect_uri=https://my-run-log.herokuapp.com/api/strava/callback&response_type=code&scope=read,activity:read`
  } else {
    grantDomain = `https://www.strava.com/oauth/authorize?client_id=26482&redirect_uri=http://localhost:3000/api/strava/callback&response_type=code&scope=read,activity:read`
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <a href={grantDomain}>Connect to Strava</a>
    </div>

  )
}

export default Dashboard;