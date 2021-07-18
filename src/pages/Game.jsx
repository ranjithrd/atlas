import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
// import http from "../helpers/http"
import Button from "../components/Button"
import { findGameWithCode } from "../data/findGame"
import { initialise } from "../helpers/config"
import { addGuess } from "../data/addGuess"
import { addPlayerToGame } from "../data/addPlayerToGame"
import { deleteGame } from "../data/deleteGame"
import { validateGuess } from "../helpers/validateGuess"
import { removePlayer } from "../data/removePlayer"
import Alert from "../components/Alert"

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
	})
}

function Game({
	history,
	match: {
		params: { code },
	},
}) {
	const [startError, setStartError] = useState("")
	const [guesses, setGuesses] = useState([])
	const [players, setPlayers] = useState([])
	const [hasInitialised, setHasInitialised] = useState(false)
	const [playerName, setPlayerName] = useState("No Name Entered")
	const [nextPlayer, setNextPlayer] = useState("")
	const [displayNext, setDisplayNext] = useState("")
	const [data, setData] = useState(null)

	const [newGuess, setNewGuess] = useState("")
	const [guessError, setGuessError] = useState("")

	const [alert, setAlert] = useState(null)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	function onDataChanged(data) {
		if (!data) return
		setGuesses(data.guesses)
		setPlayers(data.order)
		const lastPlayed = data.lastPlayed
		const players = data.order
		let intNextPlayer
		players.forEach((player, index) => {
			if (player === lastPlayed) {
				if (index < players.length - 1) {
					intNextPlayer = players[index + 1]
				} else {
					intNextPlayer = players[0]
				}
			}
			if (!intNextPlayer) {
				intNextPlayer = playerName
			}
		})
		setNextPlayer(intNextPlayer)
	}

	function startListener(reference) {
		reference.on(
			"value",
			(snapshot) => {
				setData(snapshot.val())
			},
			(error) => {
				setStartError("Something's wrong. " + error)
			}
		)
	}

	function submitGuess(g) {
		let isError = false
		const guess = !!g ? g : newGuess
		setGuessError("")
		if (guess === "" || !guess) {
			setGuessError("Please enter a guess.")
			isError = true
			return
		}
		if (
			guess.slice(0, 1).toLowerCase().trim() !==
			guesses.slice(-1)[0].guess.slice(-1).toLowerCase().trim()
		) {
			setGuessError("Make sure your guess starts with the right letter!")
			setNewGuess("")
			isError = true
			return
		}
		const formattedGuess = guess.toLowerCase().replace(/ /g, "")
		guesses.forEach((g) => {
			const formattedTestGuess = g.guess.toLowerCase().replace(/ /g, "")
			if (formattedTestGuess === formattedGuess) {
				setGuessError(
					"This guess is a repeat! Enter another place name!"
				)
				setNewGuess("")
				isError = true
				return
			}
		})
		const isGuessValid = validateGuess(guess.trim())
		if (!isGuessValid) {
			setGuessError("Please enter a name of a place that exists.")
			setNewGuess("")
			isError = true
			return
		}
		if (!isError) {
			addGuess({
				guess: toTitleCase(guess.trim()),
				player: playerName,
				gameCode: code,
			})
			setNewGuess("")
		}
	}

	function share() {
		const url = `${window.location.hostname}/join/${code}`
		if (navigator.share) {
			navigator
				.share({
					title: "Join my game of Atlas!",
					message: `Join my game of Atlas, the popular online game with the code ${code}`,
					url: url,
				})
				.then(
					setAlert({
						title: "Thank you for sharing!",
						button: "Close",
						onButton: () => setAlert(null),
					})
				)
		} else {
			function copyLink() {
				navigator.clipboard.writeText(url)
			}
			setAlert({
				title: "Please share this link!",
				message: (
					<div className="bg-gray-100 p-3 flex flex-row justify-between">
						{url}
						<button className="text-sm text-yellow-800 focus:text-red-500" onClick={copyLink} >Copy</button>
					</div>
				),
				button: "Close",
				onButton: () => setAlert(null),
			})
		}
	}

	function onRemovePlayer(player) {
		removePlayer(player, code)
	}

	function onExitGame() {
		removePlayer(playerName, code)
		history.push("/")
	}

	function onDeleteGame() {
		deleteGame(code)
		history.push("/")
	}

	function onKeyDown({ key }) {
		if (key === "Enter") {
			submitGuess()
		}
	}

	useEffect(() => onDataChanged(data), [data, onDataChanged])

	useEffect(() => {
		setDisplayNext(nextPlayer === playerName ? "Your" : `${nextPlayer}'s`)
	}, [nextPlayer, playerName])

	useEffect(() => {
		;(async () => {
			let internalPlayerName
			const requestedName =
				(document.location.href.split("?")[1] ?? "").split("=")[1] ??
				undefined
			if (requestedName) {
				const decodedName = decodeURI(requestedName)
				setPlayerName(decodedName)
				internalPlayerName = decodedName
			}
			while (!navigator.onLine) {
				console.log("You're not online.")
			}
			await initialise()
			const game = await findGameWithCode(code, true)
			if (game !== undefined) {
				setHasInitialised(true)
			}
			if (game === null) {
				setStartError(
					"Something's wrong. We couldn't find a game with that code."
				)
			} else {
				const gameVal = (await game.get()).val()
				let playerExists = false
				gameVal.order.forEach((player) => {
					if (player === internalPlayerName) {
						playerExists = true
					}
				})
				if (playerExists) {
					startListener(game)
				} else {
					await addPlayerToGame({
						player: internalPlayerName,
						gameCode: code,
					})
					startListener(game)
				}
			}
		})()
	}, [code])

	if (!hasInitialised)
		return (
			<div className="text-blue-500 font-lg text-center text-2xl">
				Loading...
			</div>
		)

	if (startError !== "")
		return (
			<div className="text-red-800 font-lg text-center text-2xl">
				There's been an error.
				<br></br>
				{startError}
			</div>
		)

	return (
		<>
			{alert ? (
				// <div className="fixed h-screen w-screen bg-opacity-60 bg-gray-800 flex flex-col justify-center">
				<div className="flex justify-center align-center">
					<Alert {...alert} className=" " />
				</div>
			) : (
				// </div>
				""
			)}
			<div
				className={
					alert
						? "w-full flex flex-col items-stretch blur-lg filter brightness-50 opacity-10 h-max-screen overflow-hidden"
						: "w-full flex flex-col items-stretch"
				}
			>
				<Link to="/">
					<h2 className="font-bold text-base mb-6 w-full text-left">
						Go back
					</h2>
				</Link>
				<div className="flex flex-row w-full">
					<div className="mt-4 text-xl">
						Code: <strong className="font-mono">{code}</strong>
					</div>
					<Button title="Share" onClick={share} />
				</div>
				<div className="flex flex-row my-4 gap-4">
					<Button
						title="Stop Game"
						onClick={onDeleteGame}
						outlined
						wide
					/>
					<Button
						title="Leave Game"
						onClick={onExitGame}
						outlined
						wide
					/>
				</div>
				<div className="text-2xl">
					<span className="font-bold">{displayNext}</span> turn
				</div>
				{nextPlayer === playerName ? (
					<div className="mt-2">
						<div className="mb-4 text-lg">
							Your guess must start with the letter{" "}
							<strong>
								{guesses
									.slice(-1)[0]
									.guess.slice(-1)
									.toUpperCase()}
							</strong>
						</div>
						<label htmlFor="name">Please enter your guess</label>
						<div className="flex flex-col gap-3 md:flex-row">
							<input
								type="text"
								className="mt-4 p-3 rounded-lg flex-grow shadow-lg focus:ring-2 focus:rounded-lg focus:ring-yellow-800 text-lg"
								onChange={(e) => setNewGuess(e.target.value)}
								value={newGuess}
								id="name"
								placeholder="Enter your guess"
								onKeyDown={onKeyDown}
							/>
							<Button
								title="Submit"
								onClick={() => submitGuess(newGuess)}
								className="w-full md:w-1/4"
							/>
						</div>
						{guessError === "" ? (
							""
						) : (
							<div className="mt-2 text-red-500 text-sm font-medium">
								{guessError}
							</div>
						)}
					</div>
				) : (
					<div className="text-sm">Not your turn yet!</div>
				)}
				<div
					className="mt-4 overflow-y-scroll"
					style={{ height: "60vh" }}
				>
					<div className="mb-2">{guesses.length} guesses</div>
					{guesses
						.map((guess) => (
							<div
								className="bg-white rounded-lg shadow-lg my-4 p-4 w-full flex flex-row"
								key={JSON.stringify(guess)}
							>
								<div className="font-bold">{guess.name}</div>
								<div className="ml-2">{guess.guess}</div>
							</div>
						))
						.reverse()}
				</div>
				<div className="my-8">
					<h3 className="font-bold text-lg">Players</h3>
					{players.map((player) => (
						<div
							className="w-full flex flex-row justify-between py-2 border-b-2 border-gray-200"
							key={player}
						>
							{player}
							<button
								onClick={() => onRemovePlayer(player)}
								className="text-red-500 text-sm"
							>
								Remove
							</button>
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default Game
