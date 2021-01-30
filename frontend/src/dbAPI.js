export async function createNewUser(fname, lname, email, password) {
	return fetch(`/api/users`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ fname, lname, email, password })
	}).then(res => res.json());
}

export async function signinUser(email, password) {
	return fetch(`/api/usersignin`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	}).then(res => res.json());
}

export async function authenticateUser() {
	return fetch(`/api/authuser/`, {
		method: 'GET',
		headers: {
			'Referrer-Policy': 'no-referrer',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('JWT')}`
		}
	})
		.then(res => res.json())
		.catch(error => console.log(error));
}

export async function stravaAuth(code, userId) {
	return fetch(`/api/strava/callback`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ code, userId })
	}).then(res => res.json());
}

export async function newStravaToken(refreshToken, userId) {
	return fetch(`/api/strava/refresh`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ refreshToken, userId })
	}).then(res => res.json());
}

export async function stravaWebhookSetupResponse(challenge) {
	return fetch(`/api/strava/webhook`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ challenge })
	}).then(res => res.json());
}

export async function stravaInitialPull(token, userId) {
	return fetch(`/api/strava/activitypull`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token, userId })
	}).then(res => res.json());
}