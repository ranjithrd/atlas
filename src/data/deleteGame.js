import firebase from "firebase"

export const deleteGame = async (code) => {
	const database = firebase.database().ref()
	const ref = database.child(`/games/${code}`)
	await ref.set(null)
}