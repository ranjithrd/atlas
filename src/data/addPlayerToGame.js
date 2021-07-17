import firebase from "firebase"

async function getData(ref) {
	return (await ref.get()).val()
}

export const addPlayerToGame = async ({player, gameCode}) => {
	const database = firebase.database().ref()
	const gameReference = database.child(`games/${gameCode}`)
	const orderReference = gameReference.child('order')
	await orderReference.update({
		[(await getData(orderReference)).length] : player
	})
}
