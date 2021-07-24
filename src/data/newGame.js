import firebase from "firebase"
import { countries } from "./countries"
import { findGameWithCode } from "./findGame"

const RANDOM_COUNTRIES = countries

export const newGame = async (playerName) => {
	const database = firebase.database().ref()
	const collection = database.child("games")

	let code = (Math.random() * 100000).toFixed(0)
	const gameWithCodeExists = await findGameWithCode(code, false)
	while (gameWithCodeExists) {
		code = (Math.random() * 100000).toFixed(0)
	}

	const randomCountry = RANDOM_COUNTRIES.sort(() => Math.random() - 0.5)[0]

	await collection.update({
		[`${code}`]: {
			guesses: [
				{
					guess: randomCountry,
					name: playerName,
				},
			],
			lastPlayed: playerName,
			order: [playerName],
		},
	})

	return code
}
