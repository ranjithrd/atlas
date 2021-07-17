import firebase from "firebase"

async function getData(ref) {
	return (await ref.get()).val()
}

export const addGuess = async ({ guess, player, gameCode }) => {
	console.log(guess)
	console.log(player)

	const database = firebase.database().ref()
	const gameReference = database.child(`games/${gameCode}`)
	const guessesReference = gameReference.child("guesses")
	const lastPlayedReference = gameReference.child("lastPlayed")

	console.log(await getData(gameReference))
	console.log(await getData(guessesReference))
	console.log(await getData(lastPlayedReference))

	await guessesReference.update({
		[(await getData(guessesReference)).length]: {
			guess: guess,
			name: player,
		},
	})
	await lastPlayedReference.set(player)

	console.log(await getData(gameReference))
	console.log(await getData(guessesReference))
	console.log(await getData(lastPlayedReference))
}
