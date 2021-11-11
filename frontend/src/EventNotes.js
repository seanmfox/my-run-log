import React, { useState, useEffect } from 'react';

const EventNotes = props => {
  console.log(props)
  return(
    <div>
      <div id='eventModal' style={{display: 'block'}}>
        <div id='eventModalContentContainer'>
          <div id='eventModalContent'>
            Test Notes
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventNotes;