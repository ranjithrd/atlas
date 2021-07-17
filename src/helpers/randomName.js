const ANIMAL_NAMES = []
const ADJECTIVES = []

function shuffle(l) {
	return l.sort((a, b) => Math.random() - 0.5)
}

export const randomName = () => {
	return shuffle(ANIMAL_NAMES)[0] + ' ' + shuffle(ADJECTIVES)[0]
}