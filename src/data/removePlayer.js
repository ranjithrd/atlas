import firebase from "firebase"

async function getData(ref) {
	return (await ref.get()).val()
}

export const removePlayer = async (player, code) => {
	const database = firebase.database().ref()
	const game = database.child(`games/${code}/order`)
	const players = await getData(game)
	const newPlayers = players.filter((p) => p !== player)
	await game.set(newPlayers)
}
