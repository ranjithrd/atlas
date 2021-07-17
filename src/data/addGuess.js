import firebase from "firebase"

async function getData(ref) {
	return (await ref.get()).val()
}

export const addGuess = async ({ guess, player, gameCode }) => {
	const database = firebase.database().ref()
	const gameReference = database.child(`games/${gameCode}`)
	const guessesReference = gameReference.child("guesses")
	const lastPlayedReference = gameReference.child("lastPlayed")
	await guessesReference.update({
		[(await getData(guessesReference)).length]: {
			guess: guess,
			name: player,
		},
	})
	await lastPlayedReference.set(player)
}
