import firebase from "firebase"
import { countries } from "./countries"

const RANDOM_COUNTRIES = countries

export const newGame = async (playerName) => {
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
