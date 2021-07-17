import React, { useState } from "react"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { findGameWithCode } from "../data/findGame"
import { newGame } from "../data/newGame"

function Home({ history }) {
	const [code, change_code] = useState("")
	const [error, setError] = useState("")

	const [playerName, setPlayerName] = useState(
		localStorage.getItem("atlasname") ?? ""
	)
	const [nameError, setNameError] = useState("")

	const [newPlayerName, setNewPlayerName] = useState(
		localStorage.getItem("atlasname") ?? ""
	)
	const [newNameError, setNewNameError] = useState("")

	async function submitWithCode(code, name) {
		setError("")
		setNameError("")

		if (code === "") {
			setError("Please enter a code.")
			return
		}
		if (name === "") {
			setNameError("Please enter a name.")
			return
		}
		localStorage.setItem("atlasname", name)
		const game = await findGameWithCode(code)
		if (game === null) {
			setError("A game with that code does not exist. Please try again.")
		} else {
			const url = `/${code}?player=${name}`
			history.push(url)
		}
	}

	async function createGame(name) {
		setNewNameError("")

		if (name === "") {
			setNewNameError("Please enter a name.")
			return
		}

		localStorage.setItem("atlasname", name)

		const newCode = await newGame(name)

		history.push(`/${newCode}?player=${name}`)
	}

	return (
		<div className="w-full h-full flex flex-col justify-center">
			<Link to="/">
				<h2 className="font-bold text-2xl mb-6">Atlas</h2>
			</Link>
			<form className="w-full" onSubmit={(event) => {}}>
				<label htmlFor="code">Please enter the game code</label>
				<input
					type="number"
					className="mt-4 p-3 rounded-lg w-full shadow-lg focus:ring-2 focus:ring-yellow-800 text-center text-xl font-mono tracking-wider"
					onChange={(e) => change_code(e.target.valueAsNumber)}
					value={code}
					id="code"
					placeholder="123456"
				/>
				{error === "" ? (
					""
				) : (
					<div className="mt-2 text-red-500 text-sm font-medium">
						{error}
					</div>
				)}
				<div className="h-8"></div>
				<label htmlFor="name">Please enter your name</label>
				<input
					type="text"
					className="mt-4 p-3 rounded-lg w-full shadow-lg focus:ring-2 focus:ring-yellow-800 text-center text-xl font-mono tracking-wider"
					onChange={(e) => setPlayerName(e.target.value)}
					value={playerName}
					id="name"
					placeholder="Ipsum"
				/>
				{nameError === "" ? (
					""
				) : (
					<div className="mt-2 text-red-500 text-sm font-medium">
						{nameError}
					</div>
				)}
				<div className="flex flex-row space-x-2 w-full">
					<Button
						title="Go!"
						onClick={(event) => {
							event.preventDefault()
							submitWithCode(code, playerName)
						}}
						className="flex-grow"
					/>
				</div>
			</form>
			<div className="mt-16 w-full">
				<label htmlFor="name">Please enter your name</label>
				<input
					type="text"
					className="mt-2 p-3 rounded-lg w-full shadow-lg focus:ring-2 focus:ring-yellow-800 text-center text-xl font-mono tracking-wider"
					onChange={(e) => setNewPlayerName(e.target.value)}
					value={newPlayerName}
					id="name"
					placeholder="Lorem"
				/>
				{newNameError === "" ? (
					""
				) : (
					<div className="mt-2 text-red-500 text-sm font-medium">
						{newNameError}
					</div>
				)}
				<Button
					outlined
					title="Start a game!"
					onClick={() => createGame(newPlayerName)}
				/>
			</div>
		</div>
	)
}

export default Home
