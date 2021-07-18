const { places } = require("../assets/places.json")

export const validateGuess = (guess) => {
	const existsIndex = places.findIndex(
		(place) => guess.toLowerCase().trim() === place.toLowerCase().trim()
	)
	const isIndexValidated = existsIndex !== -1
	return isIndexValidated
}
