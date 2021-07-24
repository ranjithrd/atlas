import firebase from "firebase"

export const findGameWithCode = async (code, reactive) => {
	let isOffline = true
	while (isOffline) {
		console.log("You're not online.")
		try {
			const d = await firebase.database().ref().child(`games`).get()
			console.log(d)
			isOffline = false
		} catch (error) {
			isOffline = true
			console.log(error)
		}
	}
	try {
		const rx = reactive ?? false
		const database = firebase.database().ref()
		const referenceToTry = `games/${code}`
		const gameReference = database.child(referenceToTry)
		const dataReturned = await gameReference.get()

		if (dataReturned.exists()) {
			if (rx) {
				return gameReference
			} else {
				return (await gameReference.once("value")).val()
			}
		} else {
			return null
		}
	} catch (error) {
		alert(`There's been an error. \n ${error}`)
	}
}
