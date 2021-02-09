import React, { useState, useEffect } from 'react';
import { newStravaToken, stravaInitialPull } from './dbAPI';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'


const Dashboard = props => {

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (props.user.stravaEnabled && activities.length === 0) {
      if (new Date(props.user.stravaExpiresAt * 1000) < Date.now()) {
        refreshToken(props.user.stravaRefreshToken, props.user.userId)
      } else {
        stravaActivitySet(props.user.stravaAccessToken, props.user.userId)
      }
    }
  })

  const refreshToken = async (refresh, userId) => {
		const res = await newStravaToken(refresh, userId);
		if (res.success) {
      props.updateRefresh(res.data);
    }
	}

  const stravaActivitySet = async (token, userId) => {
    const res = await stravaInitialPull(token, userId)
    if (res.success) {
      setActivities(res.data)
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
      <a className={props.user.stravaEnabled ? 'hidden' : ''} href={grantDomain}>Connect to Strava</a>
      <div className="max-w-7xl m-auto">
        <FullCalendar
          plugins={[ dayGridPlugin ]}
          initialView="dayGridMonth"
          firstDay={1}
          events={activities.map(a => {
            return {allDay: true, start: a.date, title: a.name, id: a._id}
          })}
        />
      </div>
    </div>

  )
}

export default Dashboard;