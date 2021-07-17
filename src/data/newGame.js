import firebase from "firebase"

const RANDOM_COUNTRIES = [
	"Afghanistan",
	"Australia",
	"Antigua and Barbuda",
	"Japan",
]

// async function getData(ref) {
// 	return (await ref.get()).val()
// }

export const newGame = async (playerName) => {
	console.log(playerName)

	const database = firebase.database().ref()
	const collection = database.child("games")

	const code = (Math.random() * 1000).toFixed(0)

	const randomCountry = RANDOM_COUNTRIES.sort(() => Math.random() - 0.5)[0]
	
	await collection.update({
		[`${code}`]: {
			guesses: [{
				guess: randomCountry,
				name: playerName
			}],
			lastPlayed: playerName,
			order: [playerName],
		},
	})

	return code
}
