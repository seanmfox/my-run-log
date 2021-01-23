import React, { useState} from 'react';

const Home = (props) => {
  const [loginEmail, setLoginEmail] = useState()
  const [loginPassword, setLoginPassword] = useState()
  const [firstName, setFirstName] = useState()
  const [lastName, setLastName] = useState()
  const [newEmail, setNewEmail] = useState()
  const [newPassword, setNewPassword] = useState()

  return (
    <div className="home">
      <h1 className='text-center'>My Run Log</h1>
      <form>
        <label htmlFor="email-input">
        Email
          <input type="text" onChange={e => setLoginEmail(e.target.value)} />
        </label>
        <label htmlFor="password-input">
          Password
          <input type="password" name="password-input" id="password-input" onChange={e => setLoginPassword(e.target.value)} />
        </label>
        <button onClick={e => {e.preventDefault();props.loginUser(loginEmail, loginPassword);}}>Submit</button>
      </form>
      <form>
        <label htmlFor="new-user-first-name">
          First Name
          <input type="text" onChange={e => setFirstName(e.target.value)} />
        </label>
        <label htmlFor="new-user-last-name">
          Last Name
          <input type="text" onChange={e => setLastName(e.target.value)} />
        </label>
        <label htmlFor="new-user-email">
        Email
          <input type="text" onChange={e => setNewEmail(e.target.value)} />
        </label>
        <label htmlFor="new-user-password">
          Password
          <input type="password" name="new-user-password" id="new-user-password" onChange={e => setNewPassword(e.target.value)} />
        </label>
        <button onClick={e => {e.preventDefault();props.createUser(firstName, lastName, newEmail, newPassword);}}>Submit</button>
      </form>
    </div>

  )
}

export default Home;