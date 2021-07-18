import React, { useState } from "react"
import Button from "../components/Button"

function Join({
	history,
	match: {
		params: { code },
	},
}) {
	const [name, setName] = useState("")
	const [nameError, setNameError] = useState("")

	function onSubmit() {
		setNameError("")
		if (name === "") {
			setNameError("Please enter a name.")
			return
		}
		history.push(`/${code}?name=${name}`)
	}

	function onKeyPress({ key }) {
		if (key === "Enter") {
			onSubmit()
		}
	}

	return (
		<div className="w-full h-full flex flex-col justify-center">
			<div className="">
				<h3 className="text-lg font-bold">Welcome to Atlas!</h3>
				<p>
					Atlas is a simple game, where each person has to say a
					place's name which starts with the end letter of the
					previous guess.
					<br />
					This site provides a neat, fast, and easy experience to play
					the classic game online.
				</p>
			</div>
			<div className="mt-4 flex flex-col md:flex-row md:gap-2">
				<input
					type="text"
					className="mt-4 p-3 rounded-lg flex-grow shadow-lg focus:ring-2 focus:rounded-lg focus:ring-yellow-800 text-lg"
					onChange={(e) => setName(e.target.value)}
					value={name}
					id="name"
					placeholder="Enter your name"
					onKeyDown={onKeyPress}
				/>
				{nameError === "" ? (
					""
				) : (
					<div className="mt-2 text-red-500 text-sm font-medium">
						{nameError}
					</div>
				)}
				<Button
					title="Submit"
					onClick={onSubmit}
					className="w-full md:w-1/4"
				/>
			</div>
		</div>
	)
}

export default Join
